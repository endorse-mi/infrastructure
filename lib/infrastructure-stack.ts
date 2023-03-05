import * as cdk from 'aws-cdk-lib';
import { type Construct } from 'constructs';
import { UserStack } from './user/user-stack';
import { PostStack } from './post/post-stack';

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new UserStack(scope, 'user-stack');
    new PostStack(scope, 'post-stack');
  }
}
