import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export const DEV_REGION = 'us-west-2';

export class PetTrackerDevStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, {
      description: 'pet-tracker',
      ...props,
    });
  }
}
