import z from "zod";

export  const baseAuthSchema = z
  .object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .refine((pw) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pw), {
        message: "Password must contain at least one special character",
      }),
  })
  .required();

export const SignUpSchema = baseAuthSchema
  .extend({
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters" })
      .max(20, { message: "Username must be at most 20 characters" }),
  })
  .refine((data) => data.username !== data.password, {
    message: "Username and password must not match.",
    path: ["password"],
  });