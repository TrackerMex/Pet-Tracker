import * as iam from 'aws-cdk-lib/aws-iam';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Platform } from 'aws-cdk-lib/aws-ecr-assets';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import {
  QUEUE_POSITIONS_RAW, QUEUE_POSITIONS_RAW_DLQ,
  QUEUE_NOTIFICATIONS, QUEUE_NOTIFICATIONS_DLQ,
  QUEUE_GEOFENCE_EVENTS, QUEUE_GEOFENCE_EVENTS_DLQ,
  SQS_MAX_RECEIVE_COUNT, EVENT_BUS_NAME, EVENT_SOURCE,
  BUCKET_MEDIA_BASE, resourceName,
  TABLE_POSITIONS, TABLE_POSITIONS_PARTITION_KEY, TABLE_POSITIONS_SORT_KEY, TABLE_POSITIONS_TTL_ATTRIBUTE,
  DETAIL_TYPE_POSITION_UPDATED, DETAIL_TYPE_BATTERY_LOW, RULE_GEOFENCE_EVENTS,
} from '@backend/aws/constants';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Aws, Duration, RemovalPolicy, Stack, StackProps, Token } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export interface PetTrackerProdStackProps extends StackProps {
  readonly env: { readonly region: string; readonly account?: string };
  readonly apiDomain: string;
  readonly hostedZoneId: string;
  readonly hostedZoneName: string;
  readonly alarmEmail: string;
  readonly resendFrom: string;
  readonly resetLinkHost: string;
  readonly imageDirectory: string;
}

export class PetTrackerProdStack extends Stack {
  constructor(scope: Construct, id: string, props: PetTrackerProdStackProps) {
    super(scope, id, props);
    if (props.apiDomain !== props.hostedZoneName && !props.apiDomain.endsWith(`.${props.hostedZoneName}`)) {
      throw new Error(`apiDomain "${props.apiDomain}" is not inside hosted zone "${props.hostedZoneName}"`);
    }
    const vpc = new ec2.Vpc(this, 'Vpc', {
      availabilityZones: [`${this.region}a`, `${this.region}b`, `${this.region}c`],
      natGateways: 0,
      subnetConfiguration: [
        { name: 'public', subnetType: ec2.SubnetType.PUBLIC },
        { name: 'isolated', subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      ],
      gatewayEndpoints: {
        S3: { service: ec2.GatewayVpcEndpointAwsService.S3 },
        DynamoDB: { service: ec2.GatewayVpcEndpointAwsService.DYNAMODB },
      },
    });
    const positionsRawDlq = new sqs.Queue(this, 'PositionsRawDlq', {
      queueName: QUEUE_POSITIONS_RAW_DLQ, retentionPeriod: Duration.days(14),
    });
    new sqs.Queue(this, 'PositionsRaw', {
      queueName: QUEUE_POSITIONS_RAW,
      deadLetterQueue: { queue: positionsRawDlq, maxReceiveCount: SQS_MAX_RECEIVE_COUNT },
    });
    const notificationsDlq = new sqs.Queue(this, 'NotificationsDlq', {
      queueName: QUEUE_NOTIFICATIONS_DLQ, retentionPeriod: Duration.days(14),
    });
    new sqs.Queue(this, 'Notifications', {
      queueName: QUEUE_NOTIFICATIONS,
      deadLetterQueue: { queue: notificationsDlq, maxReceiveCount: SQS_MAX_RECEIVE_COUNT },
    });
    const geofenceEventsDlq = new sqs.Queue(this, 'GeofenceEventsDlq', {
      queueName: QUEUE_GEOFENCE_EVENTS_DLQ, retentionPeriod: Duration.days(14),
    });
    const geofenceEventsQueue = new sqs.Queue(this, 'GeofenceEvents', {
      queueName: QUEUE_GEOFENCE_EVENTS,
      deadLetterQueue: { queue: geofenceEventsDlq, maxReceiveCount: SQS_MAX_RECEIVE_COUNT },
    });
    const eventBus = new events.EventBus(this, 'EventBus', { eventBusName: EVENT_BUS_NAME });
    const geofenceEventsRule = new events.Rule(this, 'GeofenceEventsRule', {
      eventBus, ruleName: RULE_GEOFENCE_EVENTS,
      eventPattern: { source: [EVENT_SOURCE], detailType: [DETAIL_TYPE_POSITION_UPDATED, DETAIL_TYPE_BATTERY_LOW] },
    });
    geofenceEventsRule.addTarget(new targets.SqsQueue(geofenceEventsQueue));
    const table = new dynamodb.TableV2(this, 'PositionsTable', {
      tableName: TABLE_POSITIONS,
      billing: dynamodb.Billing.onDemand(),
      partitionKey: { name: TABLE_POSITIONS_PARTITION_KEY, type: dynamodb.AttributeType.STRING },
      sortKey: { name: TABLE_POSITIONS_SORT_KEY, type: dynamodb.AttributeType.NUMBER },
      timeToLiveAttribute: TABLE_POSITIONS_TTL_ATTRIBUTE,
      pointInTimeRecoverySpecification: { pointInTimeRecoveryEnabled: true },
      deletionProtection: true,
      removalPolicy: RemovalPolicy.RETAIN,
    });
    const bucket = new s3.Bucket(this, 'MediaBucket', {
      bucketName: resourceName(BUCKET_MEDIA_BASE, `prod-${this.region}-${Aws.ACCOUNT_ID}`),
      versioned: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      removalPolicy: RemovalPolicy.RETAIN,
      lifecycleRules: [{ noncurrentVersionExpiration: Duration.days(30), expiredObjectDeleteMarker: true }],
    });
    const dbSecret = new rds.DatabaseSecret(this, 'DbSecret', { username: 'pet_tracker' });
    dbSecret.applyRemovalPolicy(RemovalPolicy.RETAIN);
    const db = new rds.DatabaseCluster(this, 'Db', {
      vpc, vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      engine: rds.DatabaseClusterEngine.auroraPostgres({ version: rds.AuroraPostgresEngineVersion.VER_17_4 }),
      credentials: rds.Credentials.fromSecret(dbSecret),
      writer: rds.ClusterInstance.serverlessV2('Writer', { availabilityZone: `${this.region}a` }),
      readers: [rds.ClusterInstance.serverlessV2('Reader', { scaleWithWriter: true, availabilityZone: `${this.region}b` })],
      serverlessV2MinCapacity: 0.5, serverlessV2MaxCapacity: 4,
      storageEncrypted: true, deletionProtection: true,
      removalPolicy: RemovalPolicy.SNAPSHOT,
      backup: { retention: Duration.days(7) }, defaultDatabaseName: 'pet_tracker',
    });
    const cluster = new ecs.Cluster(this, 'Cluster', { vpc });
    const zone = route53.HostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
      hostedZoneId: props.hostedZoneId, zoneName: props.hostedZoneName,
    });
    const image = ecs.ContainerImage.fromAsset(props.imageDirectory, { platform: Platform.LINUX_AMD64 });
    const jwtSecret = secretsmanager.Secret.fromSecretNameV2(this, 'JwtSecret', 'pet-tracker/prod/jwt');
    const wialonTokenSecret = secretsmanager.Secret.fromSecretNameV2(this, 'WialonTokenSecret', 'pet-tracker/prod/wialon-token');
    const resendApiKeySecret = secretsmanager.Secret.fromSecretNameV2(this, 'ResendApiKeySecret', 'pet-tracker/prod/resend-api-key');
    const anthropicApiKeySecret = secretsmanager.Secret.fromSecretNameV2(this, 'AnthropicApiKeySecret', 'pet-tracker/prod/anthropic-api-key');
    const apiLogs = new logs.LogGroup(this, 'ApiLogs', { retention: logs.RetentionDays.ONE_MONTH });
    const api = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'Api', {
      cluster, cpu: 512, memoryLimitMiB: 1024, desiredCount: 2,
      runtimePlatform: { cpuArchitecture: ecs.CpuArchitecture.X86_64, operatingSystemFamily: ecs.OperatingSystemFamily.LINUX },
      domainName: props.apiDomain, domainZone: zone,
      protocol: elbv2.ApplicationProtocol.HTTPS, sslPolicy: elbv2.SslPolicy.RECOMMENDED_TLS,
      redirectHTTP: true, idleTimeout: Duration.seconds(60),
      assignPublicIp: true, taskSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      circuitBreaker: { rollback: true }, minHealthyPercent: 100, maxHealthyPercent: 200,
      taskImageOptions: {
        image, containerName: 'api', containerPort: 3000,
        environment: {
          PORT: '3000', PGHOST: db.clusterEndpoint.hostname, PGPORT: Token.asString(db.clusterEndpoint.port),
          PGDATABASE: 'pet_tracker', PGUSER: 'pet_tracker', DB_POOL_MAX: '10', AWS_MODE: 'aws',
          MEDIA_BUCKET_NAME: bucket.bucketName, SIM_MODE: 'false', EMAIL_ENABLED: 'true',
          RESEND_FROM: props.resendFrom, RESET_LINK_HOST: props.resetLinkHost,
          ANTHROPIC_ENABLED: 'true', ANTHROPIC_MODEL: 'claude-haiku-5-5',
        },
        secrets: {
          PGPASSWORD: ecs.Secret.fromSecretsManager(db.secret!, 'password'),
          JWT_SECRET: ecs.Secret.fromSecretsManager(jwtSecret),
          WIALON_TOKEN: ecs.Secret.fromSecretsManager(wialonTokenSecret),
          RESEND_API_KEY: ecs.Secret.fromSecretsManager(resendApiKeySecret),
          ANTHROPIC_API_KEY: ecs.Secret.fromSecretsManager(anthropicApiKeySecret),
        },
        logDriver: ecs.LogDrivers.awsLogs({ streamPrefix: 'api', logGroup: apiLogs }),
      },
    });
    api.targetGroup.configureHealthCheck({ path: '/v1/health/live', healthyHttpCodes: '200' });
    api.targetGroup.setAttribute('deregistration_delay.timeout_seconds', '30');
    api.taskDefinition.taskRole.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['s3:GetObject', 's3:PutObject'], resources: [bucket.arnForObjects('*')],
    }));
    api.taskDefinition.taskRole.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['s3:DeleteObject'], resources: [bucket.arnForObjects('pets/*')],
    }));
    api.taskDefinition.taskRole.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['s3:ListBucket'], resources: [bucket.bucketArn], conditions: { StringLike: { 's3:prefix': 'pets/*' } },
    }));
    api.taskDefinition.taskRole.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['dynamodb:Query', 'dynamodb:BatchWriteItem'], resources: [table.tableArn],
    }));
  }
}
