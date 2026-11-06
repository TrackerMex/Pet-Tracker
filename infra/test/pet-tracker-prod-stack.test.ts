import { App } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as cxapi from 'aws-cdk-lib/cx-api';
import { join } from 'path';
import { PetTrackerProdStack } from '../lib/pet-tracker-prod-stack';

const FIXTURE_IMAGE_DIRECTORY = join(__dirname, 'fixtures', 'backend-image');
const PROPS = {
  apiDomain: 'api.example.com',
  hostedZoneId: 'Z0EXAMPLE123',
  hostedZoneName: 'example.com',
  alarmEmail: 'alerts@example.com',
  resendFrom: 'no-reply@example.com',
  resetLinkHost: 'app.example.com',
  imageDirectory: FIXTURE_IMAGE_DIRECTORY,
};

function buildStack(region: string, apiDomain: string = PROPS.apiDomain): PetTrackerProdStack {
  return new PetTrackerProdStack(new App(), `PetTrackerProd-${region}`, { env: { region }, ...PROPS, apiDomain });
}

describe('#246 R3: apiDomain tiene que estar dentro de la zona', () => {
  it('#246 R3: lanza fuera de la zona y no lanza dentro', () => {
    expect(() => buildStack('mx-central-1', 'api.other.com')).toThrow(
      new Error('apiDomain "api.other.com" is not inside hosted zone "example.com"'),
    );
    expect(() => buildStack('mx-central-1', 'apiexample.com')).toThrow(
      new Error('apiDomain "apiexample.com" is not inside hosted zone "example.com"'),
    );
    expect(() => buildStack('mx-central-1', 'example.com')).not.toThrow();
    expect(() => buildStack('mx-central-1', 'api.example.com')).not.toThrow();
  }, 60_000);
});

const REGIONS = ['mx-central-1', 'us-east-2'] as const;
interface SynthesizedResource {
  readonly Type: string;
  readonly Properties?: Record<string, unknown>;
  readonly DeletionPolicy?: string;
  readonly UpdateReplacePolicy?: string;
}
interface Synthesized {
  readonly template: Template;
  readonly resources: Record<string, SynthesizedResource>;
  readonly outputs: Record<string, { Value?: unknown }>;
  readonly assembly: cxapi.CloudAssembly;
}
const templates = new Map<string, Synthesized>();
function synthesized(region: string): Synthesized {
  const cached = templates.get(region);
  if (cached) return cached;
  const app = new App();
  const stack = new PetTrackerProdStack(app, `PetTrackerProd-${region}`, { env: { region }, ...PROPS });
  const template = Template.fromStack(stack);
  const json = template.toJSON() as {
    Resources?: Record<string, SynthesizedResource>;
    Outputs?: Record<string, { Value?: unknown }>;
  };
  const result = { template, resources: json.Resources ?? {}, outputs: json.Outputs ?? {}, assembly: app.synth() };
  templates.set(region, result);
  return result;
}

beforeAll(() => { REGIONS.forEach((region) => synthesized(region)); }, 120_000);

function ofType(region: string, type: string): Array<[string, SynthesizedResource]> {
  return Object.entries(synthesized(region).resources).filter(([, resource]) => resource.Type === type);
}
function subnetIdsByAz(region: string, kind: 'Public' | 'Isolated'): string[] {
  return ofType(region, 'AWS::EC2::Subnet').filter(([, resource]) => {
    const tags = (resource.Properties?.Tags ?? []) as Array<{ Key: string; Value: string }>;
    return tags.some((tag) => tag.Key === 'aws-cdk:subnet-type' && tag.Value === kind);
  }).sort((a, b) => String(a[1].Properties?.AvailabilityZone).localeCompare(String(b[1].Properties?.AvailabilityZone)))
    .map(([id]) => id);
}

describe('#246 R4: VPC de 3 AZ sin NAT con endpoints gateway', () => {
  it.each(REGIONS)('#246 R4: red de %s', (region) => {
    const { template, resources } = synthesized(region);
    template.resourceCountIs('AWS::EC2::VPC', 1);
    template.resourceCountIs('AWS::EC2::InternetGateway', 1);
    template.resourceCountIs('AWS::EC2::NatGateway', 0);
    template.resourceCountIs('AWS::EC2::EIP', 0);
    template.resourceCountIs('AWS::EC2::Subnet', 6);
    for (const kind of ['Public', 'Isolated'] as const) {
      expect(subnetIdsByAz(region, kind).map((id) => resources[id]?.Properties?.AvailabilityZone))
        .toEqual([`${region}a`, `${region}b`, `${region}c`]);
    }
    const endpoints = ofType(region, 'AWS::EC2::VPCEndpoint');
    expect(endpoints).toHaveLength(2);
    for (const [, endpoint] of endpoints) {
      expect(endpoint.Properties?.VpcEndpointType).toBe('Gateway');
      expect(endpoint.Properties?.RouteTableIds).toHaveLength(6);
    }
    expect(endpoints.map(([, endpoint]) => {
      const serviceName = JSON.stringify(endpoint.Properties?.ServiceName);
      return serviceName?.includes('.s3"') ? 's3' : serviceName?.includes('.dynamodb"') ? 'dynamodb' : serviceName;
    }).sort()).toEqual(['dynamodb', 's3']);
    const routes = ofType(region, 'AWS::EC2::Route');
    expect(routes).toHaveLength(3);
    for (const [, route] of routes) {
      expect(route.Properties?.DestinationCidrBlock).toBe('0.0.0.0/0');
      expect(route.Properties?.GatewayId).toEqual({ Ref: ofType(region, 'AWS::EC2::InternetGateway')[0]?.[0] });
    }
    const publicSubnets = subnetIdsByAz(region, 'Public').map((id) => JSON.stringify({ Ref: id }));
    const publicRouteTables = ofType(region, 'AWS::EC2::SubnetRouteTableAssociation')
      .filter(([, resource]) => publicSubnets.includes(JSON.stringify(resource.Properties?.SubnetId)))
      .map(([, resource]) => JSON.stringify(resource.Properties?.RouteTableId)).sort();
    expect(routes.map(([, route]) => JSON.stringify(route.Properties?.RouteTableId)).sort()).toEqual(publicRouteTables);
  });
});

function queueId(region: string, queueName: string): string | undefined {
  return ofType(region, 'AWS::SQS::Queue').find(([, resource]) => resource.Properties?.QueueName === queueName)?.[0];
}

describe('#246 R5: colas con DLQ, bus y regla de geocercas', () => {
  it('#246 R5: seis colas, redrive, retención de DLQ, bus, regla y política', () => {
    const region = 'mx-central-1';
    const { template, resources } = synthesized(region);
    template.resourceCountIs('AWS::SQS::Queue', 6);
    expect(ofType(region, 'AWS::SQS::Queue').map(([, resource]) => resource.Properties?.QueueName).sort())
      .toEqual(['positions-raw', 'positions-raw-dlq', 'notifications', 'notifications-dlq', 'geofence-events', 'geofence-events-dlq'].sort());
    for (const name of ['positions-raw', 'notifications', 'geofence-events']) {
      const dlq = queueId(region, `${name}-dlq`);
      template.hasResourceProperties('AWS::SQS::Queue', {
        QueueName: name,
        RedrivePolicy: { deadLetterTargetArn: { 'Fn::GetAtt': [dlq, 'Arn'] }, maxReceiveCount: 3 },
      });
      expect(dlq ? resources[dlq]?.Properties?.MessageRetentionPeriod : undefined).toBe(1209600);
    }
    template.resourceCountIs('AWS::Events::EventBus', 1);
    template.resourceCountIs('AWS::Events::Rule', 1);
    template.hasResourceProperties('AWS::Events::EventBus', { Name: 'pet-tracker' });
    template.hasResourceProperties('AWS::Events::Rule', {
      Name: 'geofence-events', EventBusName: { Ref: ofType(region, 'AWS::Events::EventBus')[0]?.[0] },
      EventPattern: { source: ['pet-tracker'], 'detail-type': ['position.updated', 'battery.low'] },
      State: 'ENABLED',
      Targets: [{ Arn: { 'Fn::GetAtt': [queueId(region, 'geofence-events'), 'Arn'] }, Id: 'Target0' }],
    });
    const policy = ofType(region, 'AWS::SQS::QueuePolicy').find(([, resource]) =>
      JSON.stringify(resource.Properties?.Queues) === JSON.stringify([{ Ref: queueId(region, 'geofence-events') }]));
    const document = policy?.[1].Properties?.PolicyDocument as { Statement?: Array<{ Principal?: unknown; Action?: string | string[] }> } | undefined;
    expect(document?.Statement?.some((statement) =>
      JSON.stringify(statement.Principal) === JSON.stringify({ Service: 'events.amazonaws.com' }) &&
      [statement.Action].flat().includes('sqs:SendMessage'))).toBe(true);
  });
});

describe('#246 R6: tabla positions on-demand con PITR, protección y clave de AWS', () => {
  it('#246 R6: GlobalTable de una réplica, Retain y sin KMS', () => {
    const region = 'mx-central-1';
    const { template } = synthesized(region);
    template.resourceCountIs('AWS::DynamoDB::GlobalTable', 1);
    template.hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      TableName: 'positions', BillingMode: 'PAY_PER_REQUEST',
      KeySchema: [{ AttributeName: 'pk', KeyType: 'HASH' }, { AttributeName: 'sk', KeyType: 'RANGE' }],
      AttributeDefinitions: [{ AttributeName: 'pk', AttributeType: 'S' }, { AttributeName: 'sk', AttributeType: 'N' }],
      TimeToLiveSpecification: { AttributeName: 'expires_at', Enabled: true },
      SSESpecification: Match.absent(),
    });
    const table = ofType(region, 'AWS::DynamoDB::GlobalTable')[0]?.[1];
    expect(table?.Properties?.Replicas).toEqual([{ Region: region, PointInTimeRecoverySpecification: { PointInTimeRecoveryEnabled: true }, DeletionProtectionEnabled: true }]);
    expect(table?.DeletionPolicy).toBe('Retain');
    expect(table?.UpdateReplacePolicy).toBe('Retain');
    template.resourceCountIs('AWS::KMS::Key', 0);
  });
});

describe('#246 R7: bucket de media versionado, SSE-S3 y Retain', () => {
  it.each(REGIONS)('#246 R7: bucket de %s', (region) => {
    const { template } = synthesized(region);
    template.resourceCountIs('AWS::S3::Bucket', 1);
    template.hasResourceProperties('AWS::S3::Bucket', {
      BucketName: { 'Fn::Join': ['', [`pet-tracker-media-prod-${region}-`, { Ref: 'AWS::AccountId' }]] },
      VersioningConfiguration: { Status: 'Enabled' },
      PublicAccessBlockConfiguration: { BlockPublicAcls: true, BlockPublicPolicy: true, IgnorePublicAcls: true, RestrictPublicBuckets: true },
      CorsConfiguration: Match.absent(),
    });
    const bucket = ofType(region, 'AWS::S3::Bucket')[0];
    expect(bucket?.[1].Properties?.BucketEncryption).toEqual({ ServerSideEncryptionConfiguration: [{ ServerSideEncryptionByDefault: { SSEAlgorithm: 'AES256' } }] });
    expect(bucket?.[1].Properties?.LifecycleConfiguration).toEqual({ Rules: [{ ExpiredObjectDeleteMarker: true, NoncurrentVersionExpiration: { NoncurrentDays: 30 }, Status: 'Enabled' }] });
    expect(bucket?.[1].DeletionPolicy).toBe('Retain');
    expect(bucket?.[1].UpdateReplacePolicy).toBe('Retain');
    template.hasResourceProperties('AWS::S3::BucketPolicy', {
      Bucket: { Ref: bucket?.[0] },
      PolicyDocument: { Statement: Match.arrayWith([Match.objectLike({
        Effect: 'Deny', Action: 's3:*', Principal: { AWS: '*' }, Condition: { Bool: { 'aws:SecureTransport': 'false' } },
      })]) },
    });
  });
});

describe('#246 R8: Aurora Serverless v2 en subredes aisladas', () => {
  it.each(REGIONS)('#246 R8: Aurora de %s', (region) => {
    const { template } = synthesized(region);
    template.resourceCountIs('AWS::RDS::DBSubnetGroup', 1);
    template.resourceCountIs('AWS::RDS::DBCluster', 1);
    template.resourceCountIs('AWS::RDS::DBInstance', 2);
    template.resourceCountIs('AWS::SecretsManager::Secret', 1);
    const subnetGroup = ofType(region, 'AWS::RDS::DBSubnetGroup')[0];
    const subnetIds = (subnetGroup?.[1].Properties?.SubnetIds ?? []) as unknown[];
    expect(subnetIds.map((value) => JSON.stringify(value)).sort())
      .toEqual(subnetIdsByAz(region, 'Isolated').map((id) => JSON.stringify({ Ref: id })).sort());
    template.hasResourceProperties('AWS::RDS::DBCluster', {
      Engine: 'aurora-postgresql', EngineVersion: '17.4',
      ServerlessV2ScalingConfiguration: { MinCapacity: 0.5, MaxCapacity: 4 },
      StorageEncrypted: true, KmsKeyId: Match.absent(), DeletionProtection: true,
      BackupRetentionPeriod: 7, DatabaseName: 'pet_tracker', DBSubnetGroupName: { Ref: subnetGroup?.[0] },
    });
    const db = ofType(region, 'AWS::RDS::DBCluster')[0];
    const secret = ofType(region, 'AWS::SecretsManager::Secret')[0];
    expect(JSON.stringify(db?.[1].Properties?.MasterUserPassword)).toContain(JSON.stringify({ Ref: secret?.[0] }));
    expect(JSON.stringify(db?.[1].Properties?.MasterUserPassword)).toContain(':SecretString:password::}}');
    expect(db?.[1].DeletionPolicy).toBe('Snapshot');
    expect(db?.[1].UpdateReplacePolicy).toBe('Snapshot');
    for (const [tier, az] of [[0, 'a'], [1, 'b']] as const) {
      template.hasResourceProperties('AWS::RDS::DBInstance', {
        DBInstanceClass: 'db.serverless', Engine: 'aurora-postgresql', PubliclyAccessible: false,
        DBClusterIdentifier: { Ref: db?.[0] }, PromotionTier: tier, AvailabilityZone: `${region}${az}`,
      });
    }
    template.hasResourceProperties('AWS::SecretsManager::Secret', {
      GenerateSecretString: { SecretStringTemplate: '{"username":"pet_tracker"}', GenerateStringKey: 'password' },
      SecretString: Match.absent(),
    });
    expect(secret?.[1].DeletionPolicy).toBe('Retain');
    expect(secret?.[1].UpdateReplacePolicy).toBe('Retain');
  });
});

interface ContainerProperties extends Record<string, unknown> {
  readonly Environment?: Array<{ Name: string; Value: unknown }>;
  readonly Secrets?: Array<{ Name: string; ValueFrom: unknown }>;
  readonly LogConfiguration?: { LogDriver?: string; Options?: Record<string, unknown> };
}
interface TaskDefinitionProperties extends Record<string, unknown> {
  readonly ContainerDefinitions?: ContainerProperties[];
}
function taskDefinition(region: string, which: 'api' | 'workers' | 'ops'): [string, TaskDefinitionProperties] | undefined {
  return ofType(region, 'AWS::ECS::TaskDefinition')
    .map(([id, resource]): [string, TaskDefinitionProperties] => [id, resource.Properties as TaskDefinitionProperties])
    .find(([, props]) => which === 'ops' ? props?.Family === 'pet-tracker-ops' :
      props?.ContainerDefinitions?.length === 1 && props.ContainerDefinitions[0]?.Name === which);
}
function containerOf(region: string, which: 'api' | 'workers' | 'ops'): ContainerProperties | undefined {
  return taskDefinition(region, which)?.[1].ContainerDefinitions?.[0];
}
function service(region: string, which: 'api' | 'workers'): [string, Record<string, unknown>] | undefined {
  return ofType(region, 'AWS::ECS::Service')
    .map(([id, resource]): [string, Record<string, unknown>] => [id, resource.Properties ?? {}])
    .find(([, props]) => which === 'api' ? props.LoadBalancers !== undefined : props.LoadBalancers === undefined);
}
function securityGroupIdOf(value: unknown): string | undefined {
  if (typeof value !== 'object' || value === null) return undefined;
  const parts = (value as { 'Fn::GetAtt'?: unknown[] })['Fn::GetAtt'];
  return parts?.[1] === 'GroupId' && typeof parts[0] === 'string' ? parts[0] : undefined;
}
function withoutDescription(entry: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(entry).filter(([key]) => key !== 'Description'));
}
function ingressesTo(region: string, groupId: string): Array<Record<string, unknown>> {
  return ofType(region, 'AWS::EC2::SecurityGroupIngress')
    .filter(([, resource]) => securityGroupIdOf(resource.Properties?.GroupId) === groupId)
    .map(([, resource]) => withoutDescription(resource.Properties ?? {}));
}
function dockerImageSources(region: string) {
  return synthesized(region).assembly.artifacts.flatMap((artifact) => artifact instanceof cxapi.AssetManifestArtifact
    ? Object.values(artifact.contents.dockerImages ?? {}).map((asset) => asset.source) : []);
}

describe('#246 R9: API en Fargate detrás de un ALB HTTPS', () => {
  it('#246 R9: balanceador, certificado, registro, listeners y target group', () => {
    const region = 'mx-central-1';
    const { template } = synthesized(region);
    template.resourceCountIs('AWS::ECS::Cluster', 1);
    template.resourceCountIs('AWS::ElasticLoadBalancingV2::LoadBalancer', 1);
    template.resourceCountIs('AWS::CertificateManager::Certificate', 1);
    template.resourceCountIs('AWS::Route53::RecordSet', 1);
    template.resourceCountIs('AWS::ElasticLoadBalancingV2::Listener', 2);
    template.resourceCountIs('AWS::ElasticLoadBalancingV2::TargetGroup', 1);
    const lb = ofType(region, 'AWS::ElasticLoadBalancingV2::LoadBalancer')[0];
    expect(lb?.[1].Properties?.Scheme).toBe('internet-facing');
    expect(lb?.[1].Properties?.Type).toBe('application');
    expect(((lb?.[1].Properties?.Subnets ?? []) as unknown[]).map((v) => JSON.stringify(v)).sort())
      .toEqual(subnetIdsByAz(region, 'Public').map((id) => JSON.stringify({ Ref: id })).sort());
    expect((lb?.[1].Properties?.LoadBalancerAttributes as Array<{ Key: string; Value: string }> | undefined)
      ?.find((attribute) => attribute.Key === 'idle_timeout.timeout_seconds')?.Value).toBe('60');
    template.hasResourceProperties('AWS::CertificateManager::Certificate', {
      DomainName: PROPS.apiDomain, ValidationMethod: 'DNS',
      DomainValidationOptions: [{ DomainName: PROPS.apiDomain, HostedZoneId: PROPS.hostedZoneId }],
    });
    template.hasResourceProperties('AWS::Route53::RecordSet', {
      Type: 'A', Name: `${PROPS.apiDomain}.`, HostedZoneId: PROPS.hostedZoneId,
    });
    expect(JSON.stringify(ofType(region, 'AWS::Route53::RecordSet')[0]?.[1].Properties?.AliasTarget))
      .toContain(JSON.stringify({ 'Fn::GetAtt': [lb?.[0], 'DNSName'] }));
    const tg = ofType(region, 'AWS::ElasticLoadBalancingV2::TargetGroup')[0];
    const certificate = ofType(region, 'AWS::CertificateManager::Certificate')[0]?.[0];
    template.hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
      Port: 443, Protocol: 'HTTPS', Certificates: [{ CertificateArn: { Ref: certificate } }],
      SslPolicy: 'ELBSecurityPolicy-TLS13-1-2-2021-06',
      DefaultActions: [{ Type: 'forward', TargetGroupArn: { Ref: tg?.[0] } }],
    });
    template.hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
      Port: 80, Protocol: 'HTTP',
      DefaultActions: [{ Type: 'redirect', RedirectConfig: { Port: '443', Protocol: 'HTTPS', StatusCode: 'HTTP_301' } }],
    });
    template.hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
      TargetType: 'ip', Protocol: 'HTTP', HealthCheckPath: '/v1/health/live', Matcher: { HttpCode: '200' },
    });
    expect((tg?.[1].Properties?.TargetGroupAttributes as Array<{ Key: string; Value: string }> | undefined)
      ?.find((attribute) => attribute.Key === 'deregistration_delay.timeout_seconds')?.Value).toBe('30');
  });

  it('#246 R9: servicio API y su task definition', () => {
    const region = 'mx-central-1';
    const svc = service(region, 'api')?.[1];
    expect(svc?.LaunchType).toBe('FARGATE');
    expect(svc?.DesiredCount).toBe(2);
    expect(svc?.LoadBalancers).toEqual([{ ContainerName: 'api', ContainerPort: 3000, TargetGroupArn: { Ref: ofType(region, 'AWS::ElasticLoadBalancingV2::TargetGroup')[0]?.[0] } }]);
    const network = svc?.NetworkConfiguration as { AwsvpcConfiguration?: { AssignPublicIp?: string; Subnets?: unknown[] } } | undefined;
    expect(network?.AwsvpcConfiguration?.AssignPublicIp).toBe('ENABLED');
    expect(network?.AwsvpcConfiguration?.Subnets?.map((v) => JSON.stringify(v)).sort())
      .toEqual(subnetIdsByAz(region, 'Public').map((id) => JSON.stringify({ Ref: id })).sort());
    const deployment = svc?.DeploymentConfiguration as Record<string, unknown> | undefined;
    expect(deployment?.DeploymentCircuitBreaker).toEqual({ Enable: true, Rollback: true });
    expect(deployment?.MaximumPercent).toBe(200);
    expect(deployment?.MinimumHealthyPercent).toBe(100);
    const td = taskDefinition(region, 'api')?.[1];
    expect(td?.Cpu).toBe('512');
    expect(td?.Memory).toBe('1024');
    expect(td?.RuntimePlatform).toEqual({ CpuArchitecture: 'X86_64', OperatingSystemFamily: 'LINUX' });
    expect(td?.RequiresCompatibilities).toEqual(['FARGATE']);
    expect(td?.NetworkMode).toBe('awsvpc');
    expect(td?.ContainerDefinitions).toHaveLength(1);
    const container = containerOf(region, 'api');
    expect(container?.Name).toBe('api');
    expect(container?.PortMappings).toEqual([{ ContainerPort: 3000, Protocol: 'tcp' }]);
    expect(container?.LogConfiguration?.LogDriver).toBe('awslogs');
    const logGroup = container?.LogConfiguration?.Options?.['awslogs-group'] as { Ref?: string } | undefined;
    expect(logGroup?.Ref ? synthesized(region).resources[logGroup.Ref]?.Properties?.RetentionInDays : undefined).toBe(30);
  });

  it('#246 R9: grupos de seguridad del servicio y del balanceador', () => {
    const region = 'mx-central-1';
    const network = service(region, 'api')?.[1].NetworkConfiguration as { AwsvpcConfiguration?: { SecurityGroups?: unknown[] } } | undefined;
    const apiSg = securityGroupIdOf(network?.AwsvpcConfiguration?.SecurityGroups?.[0]);
    expect(apiSg).toBeDefined();
    const lbGroups = ofType(region, 'AWS::ElasticLoadBalancingV2::LoadBalancer')[0]?.[1].Properties?.SecurityGroups as unknown[] | undefined;
    const lbSg = securityGroupIdOf(lbGroups?.[0]);
    expect(lbSg).toBeDefined();
    expect(apiSg ? synthesized(region).resources[apiSg]?.Properties?.SecurityGroupIngress : undefined).toBeUndefined();
    expect(ingressesTo(region, apiSg ?? '')).toEqual([{
      IpProtocol: 'tcp', FromPort: 3000, ToPort: 3000,
      GroupId: { 'Fn::GetAtt': [apiSg, 'GroupId'] }, SourceSecurityGroupId: { 'Fn::GetAtt': [lbSg, 'GroupId'] },
    }]);
    const ingress = (lbSg ? synthesized(region).resources[lbSg]?.Properties?.SecurityGroupIngress : []) as Array<Record<string, unknown>>;
    expect(ingress.map(withoutDescription).sort((a, b) => Number(a.FromPort) - Number(b.FromPort)))
      .toEqual([80, 443].map((port) => ({ IpProtocol: 'tcp', FromPort: port, ToPort: port, CidrIp: '0.0.0.0/0' })));
  });

  it('#246 R9: una sola imagen Docker linux/amd64', () => {
    expect(dockerImageSources('mx-central-1')).toHaveLength(1);
    expect(dockerImageSources('mx-central-1')[0]?.platform).toBe('linux/amd64');
  });
});

function envMap(container: ContainerProperties | undefined): Record<string, unknown> {
  return Object.fromEntries((container?.Environment ?? []).map(({ Name, Value }) => [Name, Value]));
}
function roleIdOf(arn: unknown): string | undefined {
  if (typeof arn !== 'object' || arn === null) return undefined;
  const parts = (arn as { 'Fn::GetAtt'?: unknown[] })['Fn::GetAtt'];
  return parts?.[1] === 'Arn' && typeof parts[0] === 'string' ? parts[0] : undefined;
}
function secretsReadBy(region: string, roleId: string | undefined): string[] {
  if (!roleId) return [];
  const attachmentId = ofType(region, 'AWS::SecretsManager::SecretTargetAttachment')[0]?.[0];
  const labels: string[] = [];
  for (const [, policy] of ofType(region, 'AWS::IAM::Policy')) {
    const roles = (policy.Properties?.Roles ?? []) as unknown[];
    if (!roles.some((role) => JSON.stringify(role) === JSON.stringify({ Ref: roleId }))) continue;
    const document = policy.Properties?.PolicyDocument as { Statement?: Array<{ Action?: string | string[]; Resource?: unknown }> } | undefined;
    for (const statement of document?.Statement ?? []) {
      if (![statement.Action].flat().includes('secretsmanager:GetSecretValue')) continue;
      const resources: unknown[] = Array.isArray(statement.Resource) ? statement.Resource as unknown[] : [statement.Resource];
      for (const resource of resources) {
        const serialized = JSON.stringify(resource) ?? 'undefined';
        labels.push(serialized === JSON.stringify({ Ref: attachmentId }) ? 'db' :
          /:secret:pet-tracker\/prod\/([a-z-]+)-\?{6}/.exec(serialized)?.[1] ?? serialized);
      }
    }
  }
  return [...new Set(labels)].sort();
}

describe('#246 R10: entorno y secretos del contenedor api', () => {
  it('#246 R10: environment exacto', () => {
    const region = 'mx-central-1';
    const db = ofType(region, 'AWS::RDS::DBCluster')[0]?.[0];
    expect(envMap(containerOf(region, 'api'))).toEqual({
      PORT: '3000', PGHOST: { 'Fn::GetAtt': [db, 'Endpoint.Address'] }, PGPORT: { 'Fn::GetAtt': [db, 'Endpoint.Port'] },
      PGDATABASE: 'pet_tracker', PGUSER: 'pet_tracker', DB_POOL_MAX: '10', AWS_MODE: 'aws',
      MEDIA_BUCKET_NAME: { Ref: ofType(region, 'AWS::S3::Bucket')[0]?.[0] }, SIM_MODE: 'false', EMAIL_ENABLED: 'true',
      RESEND_FROM: PROPS.resendFrom, RESET_LINK_HOST: PROPS.resetLinkHost, ANTHROPIC_ENABLED: 'true', ANTHROPIC_MODEL: 'claude-haiku-5-5',
    });
  });
  it('#246 R10: secretos y lectura del execution role', () => {
    const region = 'mx-central-1';
    const secrets = containerOf(region, 'api')?.Secrets ?? [];
    expect(secrets.map(({ Name }) => Name).sort()).toEqual(['ANTHROPIC_API_KEY', 'JWT_SECRET', 'PGPASSWORD', 'RESEND_API_KEY', 'WIALON_TOKEN']);
    expect(secrets.find(({ Name }) => Name === 'PGPASSWORD')?.ValueFrom).toEqual({
      'Fn::Join': ['', [{ Ref: ofType(region, 'AWS::SecretsManager::SecretTargetAttachment')[0]?.[0] }, ':password::']],
    });
    for (const [variable, name] of [['ANTHROPIC_API_KEY', 'anthropic-api-key'], ['JWT_SECRET', 'jwt'], ['RESEND_API_KEY', 'resend-api-key'], ['WIALON_TOKEN', 'wialon-token']]) {
      expect(JSON.stringify(secrets.find(({ Name }) => Name === variable)?.ValueFrom)).toContain(`:secret:pet-tracker/prod/${name}"`);
    }
    expect(secretsReadBy(region, roleIdOf(taskDefinition(region, 'api')?.[1].ExecutionRoleArn)))
      .toEqual(['anthropic-api-key', 'db', 'jwt', 'resend-api-key', 'wialon-token']);
  });
});

function statementsOf(region: string, roleId: string | undefined): unknown[] {
  if (!roleId) return [];
  return ofType(region, 'AWS::IAM::Policy').flatMap(([, policy]) => {
    const roles = (policy.Properties?.Roles ?? []) as unknown[];
    if (!roles.some((role) => JSON.stringify(role) === JSON.stringify({ Ref: roleId }))) return [];
    const document = policy.Properties?.PolicyDocument as { Statement?: Array<Record<string, unknown>> } | undefined;
    return (document?.Statement ?? []).map((statement) => ({
      ...statement,
      Action: (typeof statement.Action === 'string' ? [statement.Action] : statement.Action as string[]).sort(),
      Resource: Array.isArray(statement.Resource) ? (statement.Resource as unknown[]).sort((a,b) => JSON.stringify(a).localeCompare(JSON.stringify(b))) : statement.Resource,
    }));
  }).sort((a,b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
}

describe('#246 R11: task role de la API con permisos mínimos', () => {
  it('#246 R11: cuatro sentencias exactas, sin políticas administradas', () => {
    const region = 'mx-central-1';
    const roleId = roleIdOf(taskDefinition(region, 'api')?.[1].TaskRoleArn);
    const bucket = ofType(region, 'AWS::S3::Bucket')[0]?.[0];
    const table = ofType(region, 'AWS::DynamoDB::GlobalTable')[0]?.[0];
    const expected = [
      { Effect: 'Allow', Action: ['s3:GetObject', 's3:PutObject'], Resource: { 'Fn::Join': ['', [{ 'Fn::GetAtt': [bucket, 'Arn'] }, '/*']] } },
      { Effect: 'Allow', Action: ['s3:DeleteObject'], Resource: { 'Fn::Join': ['', [{ 'Fn::GetAtt': [bucket, 'Arn'] }, '/pets/*']] } },
      { Effect: 'Allow', Action: ['s3:ListBucket'], Resource: { 'Fn::GetAtt': [bucket, 'Arn'] }, Condition: { StringLike: { 's3:prefix': 'pets/*' } } },
      { Effect: 'Allow', Action: ['dynamodb:BatchWriteItem', 'dynamodb:Query'], Resource: { 'Fn::GetAtt': [table, 'Arn'] } },
    ].sort((a,b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
    expect(statementsOf(region, roleId)).toEqual(expected);
    expect(roleId ? synthesized(region).resources[roleId]?.Properties?.ManagedPolicyArns : undefined).toBeUndefined();
  });
});

describe('#246 R12: la API escala de 2 a 4 tareas por CPU', () => {
  it('#246 R12: scalable target y política target tracking al 60 %', () => {
    const region = 'mx-central-1';
    const { template } = synthesized(region);
    template.resourceCountIs('AWS::ApplicationAutoScaling::ScalableTarget', 1);
    template.resourceCountIs('AWS::ApplicationAutoScaling::ScalingPolicy', 1);
    template.hasResourceProperties('AWS::ApplicationAutoScaling::ScalableTarget', {
      MinCapacity: 2, MaxCapacity: 4, ScalableDimension: 'ecs:service:DesiredCount', ServiceNamespace: 'ecs',
      ResourceId: { 'Fn::Join': ['', ['service/', { Ref: ofType(region, 'AWS::ECS::Cluster')[0]?.[0] }, '/', { 'Fn::GetAtt': [service(region, 'api')?.[0], 'Name'] }]] },
    });
    template.hasResourceProperties('AWS::ApplicationAutoScaling::ScalingPolicy', {
      PolicyType: 'TargetTrackingScaling', ScalingTargetId: { Ref: ofType(region, 'AWS::ApplicationAutoScaling::ScalableTarget')[0]?.[0] },
      TargetTrackingScalingPolicyConfiguration: {
        PredefinedMetricSpecification: { PredefinedMetricType: 'ECSServiceAverageCPUUtilization' }, TargetValue: 60,
      },
    });
  });
});

describe('#246 R13: un único worker sin entrada de red', () => {
  it('#246 R13: servicio workers, su grupo y la imagen compartida', () => {
    const region = 'mx-central-1';
    synthesized(region).template.resourceCountIs('AWS::ECS::Service', 2);
    const svc = service(region, 'workers')?.[1];
    expect(svc?.LaunchType).toBe('FARGATE');
    expect(svc?.DesiredCount).toBe(1);
    const deployment = svc?.DeploymentConfiguration as Record<string, unknown> | undefined;
    expect(deployment?.DeploymentCircuitBreaker).toEqual({ Enable: true, Rollback: true });
    expect(deployment?.MaximumPercent).toBe(100);
    expect(deployment?.MinimumHealthyPercent).toBe(0);
    const network = svc?.NetworkConfiguration as { AwsvpcConfiguration?: { AssignPublicIp?: string; Subnets?: unknown[]; SecurityGroups?: unknown[] } } | undefined;
    expect(network?.AwsvpcConfiguration?.AssignPublicIp).toBe('ENABLED');
    expect(network?.AwsvpcConfiguration?.Subnets?.map((v) => JSON.stringify(v)).sort())
      .toEqual(subnetIdsByAz(region, 'Public').map((id) => JSON.stringify({ Ref: id })).sort());
    expect(network?.AwsvpcConfiguration?.SecurityGroups).toHaveLength(1);
    const sg = securityGroupIdOf(network?.AwsvpcConfiguration?.SecurityGroups?.[0]);
    expect(sg).toBeDefined();
    const props = sg ? synthesized(region).resources[sg]?.Properties : undefined;
    expect(props?.SecurityGroupIngress).toBeUndefined();
    expect(ingressesTo(region, sg ?? '')).toEqual([]);
    expect((props?.SecurityGroupEgress as Array<Record<string, unknown>> | undefined)?.map(withoutDescription))
      .toEqual([{ CidrIp: '0.0.0.0/0', IpProtocol: '-1' }]);
    expect(dockerImageSources(region)).toHaveLength(1);
  });
  it('#246 R13: task definition workers', () => {
    const region = 'mx-central-1';
    const td = taskDefinition(region, 'workers')?.[1];
    expect(td?.Cpu).toBe('512');
    expect(td?.Memory).toBe('1024');
    expect(td?.RuntimePlatform).toEqual({ CpuArchitecture: 'X86_64', OperatingSystemFamily: 'LINUX' });
    expect(td?.ContainerDefinitions).toHaveLength(1);
    const container = containerOf(region, 'workers');
    expect(container?.Name).toBe('workers');
    expect(container?.PortMappings).toBeUndefined();
    expect(container?.Image).toEqual(containerOf(region, 'api')?.Image);
    expect(container?.LogConfiguration?.LogDriver).toBe('awslogs');
    const log = container?.LogConfiguration?.Options?.['awslogs-group'] as { Ref?: string } | undefined;
    expect(log?.Ref ? synthesized(region).resources[log.Ref]?.Properties?.RetentionInDays : undefined).toBe(30);
  });
});

describe('#246 R14: entorno y secretos del contenedor workers', () => {
  it('#246 R14: environment exacto', () => {
    const region = 'mx-central-1';
    const db = ofType(region, 'AWS::RDS::DBCluster')[0]?.[0];
    expect(envMap(containerOf(region, 'workers'))).toEqual({
      PORT: '3000', PGHOST: { 'Fn::GetAtt': [db, 'Endpoint.Address'] }, PGPORT: { 'Fn::GetAtt': [db, 'Endpoint.Port'] },
      PGDATABASE: 'pet_tracker', PGUSER: 'pet_tracker', DB_POOL_MAX: '5', AWS_MODE: 'aws',
      MEDIA_BUCKET_NAME: { Ref: ofType(region, 'AWS::S3::Bucket')[0]?.[0] }, SIM_MODE: 'false', PUSH_ENABLED: 'true',
      POLLER_ENABLED: 'true', ACTIVITY_AGGREGATOR_ENABLED: 'true', ALERTS_ENGINE_ENABLED: 'true', NOTIFIER_ENABLED: 'true', REMINDERS_ENABLED: 'true',
    });
  });
  it('#246 R14: secretos y lectura del execution role', () => {
    const region = 'mx-central-1';
    const secrets = containerOf(region, 'workers')?.Secrets ?? [];
    expect(secrets.map(({ Name }) => Name).sort()).toEqual(['JWT_SECRET', 'PGPASSWORD', 'WIALON_TOKEN']);
    expect(secrets.find(({ Name }) => Name === 'PGPASSWORD')?.ValueFrom).toEqual({
      'Fn::Join': ['', [{ Ref: ofType(region, 'AWS::SecretsManager::SecretTargetAttachment')[0]?.[0] }, ':password::']],
    });
    for (const [variable, name] of [['JWT_SECRET', 'jwt'], ['WIALON_TOKEN', 'wialon-token']]) {
      expect(JSON.stringify(secrets.find(({ Name }) => Name === variable)?.ValueFrom)).toContain(`:secret:pet-tracker/prod/${name}"`);
    }
    expect(secretsReadBy(region, roleIdOf(taskDefinition(region, 'workers')?.[1].ExecutionRoleArn))).toEqual(['db', 'jwt', 'wialon-token']);
  });
});
