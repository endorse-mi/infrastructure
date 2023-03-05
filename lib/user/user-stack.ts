import * as cdk from 'aws-cdk-lib';
import { type Construct } from 'constructs';
import { Cognito } from './cognito';

export class UserStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new Cognito(this);
  }
}
