import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
    name: "SPCloudBucket",
    access: (allow) => ({
        "public/${cognito-identity.amazonaws.com:sub}/*": [
            allow.entity('identity').to([
                'write', 
                'read',
                'delete'
            ])
        ]
    }),
    isDefault: true,
});
