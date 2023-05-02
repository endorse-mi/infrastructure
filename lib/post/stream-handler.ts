import { Duration } from 'aws-cdk-lib';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Runtime, StartingPosition } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import path = require('path');

type StreamHandlerProps = {
  tableName: string;
  tableStreamArn: string;
};

export class StreamHandler {
  constructor(scope: Construct, { tableName, tableStreamArn }: StreamHandlerProps) {
    const streamHandler = new NodejsFunction(scope, `${tableName}-table-stream-handler`, {
      functionName: `${tableName}-table-stream-handler-prod`,
      runtime: Runtime.NODEJS_18_X,
      entry: path.join(__dirname, `${tableName}-lambda.ts`),
      handler: 'handler',
      timeout: Duration.seconds(10),
    });

    const streamHandlerPermissions = new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ['dynamodb:GetRecords', 'dynamodb:GetShardIterator', 'dynamodb:DescribeStream', 'dynamodb:ListStreams'],
      resources: [tableStreamArn ?? ''],
    });

    streamHandler.role?.addToPrincipalPolicy(streamHandlerPermissions);

    // Associate the stream with the Lambda function
    streamHandler.addEventSourceMapping(`${tableName}-table-stream-mapping`, {
      eventSourceArn: tableStreamArn ?? '',
      batchSize: 10,
      startingPosition: StartingPosition.LATEST,
    });
  }
}
