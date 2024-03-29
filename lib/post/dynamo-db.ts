import { type Construct } from 'constructs';
import { AttributeType, BillingMode, ProjectionType, StreamViewType, Table, TableEncryption } from 'aws-cdk-lib/aws-dynamodb';
import { RemovalPolicy } from 'aws-cdk-lib';
import { StreamHandler } from './stream-handler';
import { ENVIRONMENT } from '../config';

export class DynamoDB {
  constructor(scope: Construct) {
    const postTable = new Table(scope, 'post-table', {
      tableName: `post-table-${ENVIRONMENT}`,
      partitionKey: {
        name: 'postId',
        type: AttributeType.STRING,
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
      encryption: TableEncryption.AWS_MANAGED,
      stream: StreamViewType.NEW_AND_OLD_IMAGES,
      removalPolicy: RemovalPolicy.DESTROY,
      timeToLiveAttribute: 'TTL',
    });

    // For retrieving posts belonging to a user quickly.
    postTable.addGlobalSecondaryIndex({
      indexName: 'authorId-index',
      partitionKey: { name: 'authorId', type: AttributeType.STRING },
      sortKey: { name: 'createdAt', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    postTable.addGlobalSecondaryIndex({
      indexName: 'type-index',
      partitionKey: { name: 'type', type: AttributeType.STRING },
      sortKey: { name: 'createdAt', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    new StreamHandler(scope, {
      tableName: 'post',
      tableStreamArn: postTable.tableStreamArn ?? '',
    });

    const postInteractionTable = new Table(scope, 'post-interaction-table', {
      tableName: `post-interaction-table-${ENVIRONMENT}`,
      partitionKey: {
        name: 'postId',
        type: AttributeType.STRING,
      },
      sortKey: {
        // the user who do the endorsement or recommendation of the post
        name: 'fulfillerId',
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

    new StreamHandler(scope, {
      tableName: 'post-interaction',
      tableStreamArn: postInteractionTable.tableStreamArn ?? '',
    });
  }
}
