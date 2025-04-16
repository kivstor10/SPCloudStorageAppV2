import { type ClientSchema, a, defineData } from '@aws-amplify/backend';


const schema = a.schema({
  AudioFiles: a
    .model({
      id: a.id(),
      filename: a.string().required(),
    })
    .authorization((allow) => 
      [allow.guest().to(["read"]),
      allow.authenticated().to(["read"]),
      allow.group("Admins").to(["create", "read", "update", "delete"])
      ]),

        
  DeviceRegistration: a
    .model({
      deviceId: a.string().required(),
      registrationCode: a.string(),
    })
    .authorization((allow) => 
      [allow.guest().to(["read"]),
      allow.authenticated().to(["read"]),
      allow.group("Admins").to(["create", "read", "update", "delete"])
      ]),

  UserDeviceLink: a
      .model({
        userId: a.string().required(),
        deviceId: a.string().required(),
      })
      .authorization((allow) => 
        [allow.guest().to(["read"]),
        allow.authenticated().to(["read"]),
        allow.group("Admins").to(["create", "read", "update", "delete"])
        ]),

  // Query to get a DeviceRegistration
  // getDeviceRegistration: a
  //     .query()
  //     .arguments({ deviceId: a.string().required() })
  //     .returns(a.ref("DeviceRegistration"))
  //     .handler(/* ... */),

  // Mutation to create a UserDeviceLink
  // createUserDeviceLink: a
  //     .mutation()
  //     .arguments(/* ... */)
  //     .returns(a.ref("UserDeviceLink"))
  //     .handler(/* ... */),


});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'iam',
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
