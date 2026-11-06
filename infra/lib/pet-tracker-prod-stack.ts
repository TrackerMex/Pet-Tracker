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
  }
}
