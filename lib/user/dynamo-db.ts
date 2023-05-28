import { type Construct } from 'constructs';
import { AttributeType, BillingMode, Table, TableEncryption } from 'aws-cdk-lib/aws-dynamodb';
import { RemovalPolicy } from 'aws-cdk-lib';
import { ENVIRONMENT } from '../config';

export class DynamoDB {
  constructor(scope: Construct) {
    new Table(scope, 'user-table', {
      tableName: `user-table-${ENVIRONMENT}`,
      partitionKey: {
        name: 'userId',
        type: AttributeType.STRING,
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
      encryption: TableEncryption.AWS_MANAGED,
      removalPolicy: RemovalPolicy.DESTROY,
    });
  }
}
