import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { aws_dynamodb } from 'aws-cdk-lib';
import { storage } from './storage/resource';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/
 * @see https://docs.amplify.aws/react/build-a-backend/
 */

const backend = defineBackend({
  auth,
  data,
  storage,
});

const externalDataSourcesStack = backend.createStack('ExternalDataSources');

// Define the DeviceRegistrations table
const deviceRegistrationsTable = aws_dynamodb.Table.fromTableName(
  externalDataSourcesStack,
  'DeviceRegistrationsTable',
  'SPCloudDeviceReg'
);

backend.data.addDynamoDbDataSource(
  'SPCloudDeviceRegDataSource',
  deviceRegistrationsTable
);

// Define the SPCloudUserDeviceLinks table
const userDeviceLinksTable = aws_dynamodb.Table.fromTableName(
  externalDataSourcesStack,
  'UserDeviceLinksTable',
  'SPCloudUserDeviceLinks'
);

backend.data.addDynamoDbDataSource(
  'SPCloudUserDeviceLinksDataSource',
  userDeviceLinksTable
);

// Define the UserLoadouts table
const userLoadoutsTable = aws_dynamodb.Table.fromTableName(
  externalDataSourcesStack,
  'UserLoadoutsTable',
  'UserLoadouts'
);

backend.data.addDynamoDbDataSource(
  'UserLoadoutsDataSource',
  userLoadoutsTable
);