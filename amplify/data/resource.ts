import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
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

  DeviceRegistration: a
    .model({ // Use a.type instead of a.model
      deviceId: a.string().required(),
      registrationCode: a.string(),
    })
    .authorization((allow) => [
      allow.guest().to(["read"]),
      allow.authenticated().to(["read"]),
      allow.group("Admins").to(["create", "read", "update", "delete"]),
    ]),

  UserDeviceLink: a
    .model({ // Use a.type instead of a.model
      userId: a.string().required(),
      deviceId: a.string().required(),
    })
    .authorization((allow) => [
      allow.guest().to(["read"]),
      allow.authenticated().to(["read"]),
      allow.group("Admins").to(["create", "read", "update", "delete"]),
    ]),

  // Query to get a DeviceRegistration using a custom resolver
  getDeviceRegistration: a
    .query()
    .arguments({ deviceId: a.string().required() })
    .returns(a.ref("DeviceRegistration"))
    .handler(
      a.handler.custom({
        dataSource: "DeviceRegistrationsDataSource", // Reference the data source name from backend.ts
        entry: "./resolvers/getDeviceRegistration.js", // Path to your custom resolver
      })
    ),

  // Mutation to create a UserDeviceLink using a custom resolver
  createUserDeviceLink: a
    .mutation()
    .arguments({ userId: a.string().required(), deviceId: a.string().required() })
    .returns(a.ref("UserDeviceLink"))
    .handler(
      a.handler.custom({
        dataSource: "UserDeviceLinksDataSource", // Reference the data source name from backend.ts
        entry: "./resolvers/createUserDeviceLink.js", // Path to your custom resolver
      })
    ),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'iam',
  },
});