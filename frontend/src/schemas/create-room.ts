import { z } from "zod"

export const CreateRoomSchema = z.object({
    name: z.string().min(3, "atleast required 3 words").max(40, "less than 40 words"),
    description: z.string().min(10, "atleast required 10 words").max(100, "less than 100 words").optional()
})

export type CreateRoomSchemaSchemaType = z.infer<typeof CreateRoomSchema>