import * as cdk from 'aws-cdk-lib';
import { type Construct } from 'constructs';
import { Cognito } from './user/cognito';
import { DynamoDB as UserDynamoDB } from './user/dynamo-db';
import { DynamoDB as PostDynamoDB } from './post/dynamo-db';

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new Cognito(this);
    new UserDynamoDB(this);
    new PostDynamoDB(this);
  }
}
