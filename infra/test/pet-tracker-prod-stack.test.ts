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
