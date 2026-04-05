import {z} from "zod";

export const signupSchema = z.object({
    name : z.string()
        .min(2, "Name must be at least 2 characters long")
        .max(100, "Name is too long"),
    email: z.email("Invalid email address"),
    password: z.string()
        .min(6, "Password must be at least 6 characters long")
        .regex(/\d/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
})


export const loginSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
})


export type SigUpFormData = z.infer<typeof signupSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;