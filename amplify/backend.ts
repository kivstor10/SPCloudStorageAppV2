import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/
 */

const backend = defineBackend({
  auth,
  data,
  storage,
});

backend.addOutput({
  custom: {
    api_id: "2wtysnmtungedjhmpfdpvklnvm",
    api_endpoint: "https://pmpeik7lxbcjhctk4fgyn4c2li.appsync-api.eu-west-2.amazonaws.com/graphql",
    api_name: "SPCloudDeviceRegCodeAPI",
  },
});