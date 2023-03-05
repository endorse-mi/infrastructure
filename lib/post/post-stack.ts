import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { DynamoDB } from "./dynamo-db";

export class PostStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new DynamoDB(scope, "post-stack-dynamodb");
  }
}
