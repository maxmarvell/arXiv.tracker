

import z from "zod";


export const createSessionSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: "email is required"
    }).email("must be of email format"),
    password: z.string({
      required_error: "password is required"
    })
  })
});


export type CreateUserInput = z.TypeOf<typeof createSessionSchema>;