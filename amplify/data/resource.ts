import {
  type ClientSchema,
  a,
  defineData,
} from '@aws-amplify/backend';

const schema = a.schema({
  // Model for S3-backed Audio Files
  AudioFiles: a
    .model({
      id: a.id(),
      filename: a.string().required(),
    })
    .authorization((allow) => [
      allow.guest().to(["read"]),
      allow.authenticated().to(["read"]),
      allow.group("Admins").to(["create", "read", "update", "delete"]),
    ]),

  // Model for Device Registrations (backed by DynamoDB via DataStore)
  DeviceRegistration: a
    .customType({
      deviceId: a.string().required(),
      registrationCode: a.string(),
    }),

  // Type for User Device Links (interacting with existing DynamoDB via custom resolvers)
  UserDeviceLink: a
    .customType({
      userId: a.string().required(),
      deviceId: a.string().required(),
    }),


  // Custom query for DeviceRegistration (DynamoDB)
  getDeviceRegistration: a
    .query()
    .arguments({ deviceId: a.string().required() })
    .returns(a.ref("DeviceRegistration"))
    .authorization(allow => [allow.publicApiKey()])
    .handler(
      a.handler.custom({
        dataSource: "SPCloudDeviceReg",
        entry: "./resolvers/getReg.js",
      })
    ),

  // Custom mutation for UserDeviceLink (DynamoDB)
  createUserDeviceLink: a
    .mutation()
    .arguments({
      userId: a.string().required(),
      deviceId: a.string().required()
    })
    .returns(a.ref("UserDeviceLink"))
    .authorization(allow => [allow.publicApiKey()])
    .handler(a.handler.custom({
      dataSource: "SPCloudUserDeviceLinkSource",
      entry: "./resolvers/updateLink.js",
    }),
    ),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'iam',
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    }
  },
});