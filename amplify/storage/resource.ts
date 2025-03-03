import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
    name: "SPCloudBucket",
    access: (allow) => ({
        "audioFiles/{entity_id}/*": [
            allow.entity('identity').to(
                [
                    'read', 
                    'write', 
                    'delete'
                ])
        ]
    }),
    isDefault: true,
})