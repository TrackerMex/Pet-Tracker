import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Stack, StackProps } from 'aws-cdk-lib';
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
    new ec2.Vpc(this, 'Vpc', {
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
  }
}
