import { type Construct } from 'constructs';
import { AttributeType, BillingMode, ProjectionType, StreamViewType, Table, TableEncryption } from 'aws-cdk-lib/aws-dynamodb';
import { Runtime, StartingPosition } from 'aws-cdk-lib/aws-lambda';
import { Duration, RemovalPolicy } from 'aws-cdk-lib';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import path = require('path');
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';

export class DynamoDB {
  constructor(scope: Construct) {
    const postTable = new Table(scope, 'post-table', {
      tableName: 'post-table-prod',
      partitionKey: {
        name: 'postId',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'createdAt',
        type: AttributeType.STRING,
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
      encryption: TableEncryption.AWS_MANAGED,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // For retrieving posts belonging to a user quickly.
    postTable.addGlobalSecondaryIndex({
      indexName: 'userId-index',
      partitionKey: { name: 'userId', type: AttributeType.STRING },
      sortKey: { name: 'createdAt', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    // The industry is not used yet.
    postTable.addLocalSecondaryIndex({
      indexName: 'industry-index',
      sortKey: {
        name: 'industry',
        type: AttributeType.STRING,
      },
      projectionType: ProjectionType.ALL,
    });

    // The post type can either be ENDORSE or RECOMMEND
    postTable.addLocalSecondaryIndex({
      indexName: 'type-index',
      sortKey: {
        name: 'type',
        type: AttributeType.STRING,
      },
      projectionType: ProjectionType.ALL,
    });

    const postInteractionTable = new Table(scope, 'post-interaction-table', {
      tableName: 'post-interaction-table-prod',
      partitionKey: {
        name: 'postId',
        type: AttributeType.STRING,
      },
      sortKey: {
        // the user who do the endorsement or recommendation of the post
        name: 'userId',
        type: AttributeType.STRING,
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
      encryption: TableEncryption.AWS_MANAGED,
      stream: StreamViewType.NEW_AND_OLD_IMAGES,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    postInteractionTable.addLocalSecondaryIndex({
      indexName: 'state-index',
      sortKey: {
        name: 'state',
        type: AttributeType.STRING,
      },
      projectionType: ProjectionType.ALL,
    });

    const streamHandler = new NodejsFunction(scope, 'post-interaction-table-stream-handler', {
      functionName: 'post-interaction-table-stream-handler-prod',
      runtime: Runtime.NODEJS_18_X,
      entry: path.join(__dirname, 'post-interaction-lambda.ts'),
      handler: 'handler',
      timeout: Duration.seconds(10),
    });

    const streamHandlerPermissions = new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ['dynamodb:GetRecords', 'dynamodb:GetShardIterator', 'dynamodb:DescribeStream', 'dynamodb:ListStreams'],
      resources: [postInteractionTable.tableStreamArn ?? ''],
    });

    streamHandler.role?.addToPrincipalPolicy(streamHandlerPermissions);

    // Associate the post-interaction-table stream with the Lambda function
    streamHandler.addEventSourceMapping('post-interaction-table-stream-mapping', {
      eventSourceArn: postInteractionTable.tableStreamArn,
      batchSize: 10,
      startingPosition: StartingPosition.LATEST,
    });
  }
}
