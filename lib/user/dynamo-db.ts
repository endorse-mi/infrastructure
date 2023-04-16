import { type Construct } from 'constructs';
import { AttributeType, BillingMode, ProjectionType, Table, TableEncryption } from 'aws-cdk-lib/aws-dynamodb';
import { RemovalPolicy } from 'aws-cdk-lib';

export class DynamoDB {
  constructor(scope: Construct) {
    const table = new Table(scope, 'user-table', {
      tableName: 'user-table-prod',
      partitionKey: {
        name: 'userId',
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

    table.addLocalSecondaryIndex({
      indexName: 'updatedAt-index',
      sortKey: {
        name: 'updatedAt',
        type: AttributeType.STRING,
      },
      // Determines which attributes are included in an index's projection, i.e.
      // returned from the query result
      projectionType: ProjectionType.ALL,
    });

    table.addLocalSecondaryIndex({
      indexName: 'familyName-index',
      sortKey: {
        name: 'familyName',
        type: AttributeType.STRING,
      },
      projectionType: ProjectionType.ALL,
    });

    table.addLocalSecondaryIndex({
      indexName: 'givenName-index',
      sortKey: {
        name: 'givenName',
        type: AttributeType.STRING,
      },
      projectionType: ProjectionType.ALL,
    });

    // The industry is not used yet.
    table.addLocalSecondaryIndex({
      indexName: 'industry-index',
      sortKey: {
        name: 'industry',
        type: AttributeType.STRING,
      },
      projectionType: ProjectionType.ALL,
    });
  }
}
