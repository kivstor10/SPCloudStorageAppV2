import { 
  type ClientSchema, 
  a, 
  defineData,
  defineFunction
} from '@aws-amplify/backend';


const createUserDeviceLink = defineFunction({
  entry: './resolvers/createUserDeviceLink.ts'
})

const getDeviceRegistration = defineFunction({
  entry: './resolvers/getDeviceRegistration.ts'
})



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
    .model({
      deviceId: a.string().required(),
      registrationCode: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  // Type for User Device Links (interacting with existing DynamoDB via custom resolvers)
  UserDeviceLink: a
    .model({
      userId: a.string().required(),
      deviceId: a.string().required(),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  // Custom query for DeviceRegistration (DynamoDB)
  getDeviceRegistration: a
    .query()
    .arguments({ deviceId: a.string().required() })
    .returns(a.ref("DeviceRegistration"))
    .authorization((allow) => [/* ... */])
    .handler(a.handler.function(getDeviceRegistration)),

  // Custom mutation for UserDeviceLink (DynamoDB)
  createUserDeviceLink: a
    .mutation()
    .arguments({ userId: a.string().required(), deviceId: a.string().required() })
    .returns(a.ref("UserDeviceLink"))
    .handler(a.handler.function(createUserDeviceLink)),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'iam',
  },
});