import { type DynamoDBStreamEvent, type DynamoDBStreamHandler } from 'aws-lambda';

export const handler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent) => {
  console.log('Received event:', JSON.stringify(event));

  for (const record of event.Records) {
    if (record.eventName === 'INSERT') {
      console.log('Processing new record:', JSON.stringify(record.dynamodb?.NewImage));
      // Do something with the new record
    } else if (record.eventName === 'MODIFY') {
      console.log('Processing modified record:', JSON.stringify(record.dynamodb?.NewImage));
      // Do something with the modified record
    } else if (record.eventName === 'REMOVE') {
      console.log('Processing removed record:', JSON.stringify(record.dynamodb?.OldImage));
      // Do something with the removed record
    }
  }
};
