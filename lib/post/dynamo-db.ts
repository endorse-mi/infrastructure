import { type Construct } from 'constructs';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';

export class DynamoDB {
  constructor(scope: Construct) {
    const table = new Table(scope, 'posts', {
      tableName: 'posts',
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'createdAt',
        type: AttributeType.NUMBER,
      },
    });
  }
}
