import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  AudioFiles: a
    .model({
      id: a.id(),
      filename: a.string().required(),
    })
    .authorization((allow: any) => [
      allow.guest().to(["read"]),
      allow.authenticated().to(["read"]),
      allow.group("Admins").to(["create", "read", "update", "delete"]),
    ]),

    DeviceRegistration: a
    .model({
      deviceId: a.string().required(),
      registrationCode: a.string(),
    })
    .authorization((allow: any) => [ 
      allow.guest().to(["read"]),
      allow.authenticated().to(["read"]),
      allow.group("Admins").to(["create", "read", "update", "delete"]),
    ]),

  UserDeviceLink: a
    .model({
      userId: a.string().required(),
      deviceId: a.string().required(),
    })
    .authorization((allow: any) => [
      allow.guest().to(["read"]),
      allow.authenticated().to(["read"]),
      allow.group("Admins").to(["create", "read", "update", "delete"]),
    ]),

  // Query to get a DeviceRegistration using a custom resolver
  getDeviceRegistration: a
    .query()
    .arguments({ deviceId: a.string().required() })
    .returns(a.ref("DeviceRegistration"))
    .authorization((allow: any) => [ 
      allow.authenticated().to(["read"]),
    ])
    .handler(
      a.handler.custom({
        dataSource: "SPCloudDeviceRegDataSource",
        entry: "./resolvers/getDeviceRegistration.js",
      })
    ),

  // Mutation to create a UserDeviceLink using a custom resolver
  createUserDeviceLink: a
    .mutation()
    .arguments({ userId: a.string().required(), deviceId: a.string().required() })
    .returns(a.ref("UserDeviceLink"))
    .handler(
      a.handler.custom({
        dataSource: "UserDeviceLinksDataSource",
        entry: "./resolvers/createUserDeviceLink.js",
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