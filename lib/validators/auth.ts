import { z } from "zod";



export const LoginSchema: any = z.object({
    email: z
        .string()
        .nonempty("Email is required")
        .trim()
        .email("Enter a valid email"),
    password: z
        .string()
        .nonempty("Password is required")
        .min(8, "Minimum 8 characters"),

    remember: z.boolean().default(true),
});

export type LoginInput = z.infer<typeof LoginSchema>;

const RoleEnum:any = z.enum(["owner", "admin", "user"]);

export const RegisterSchema = z
    .object({
        name: z.string().nonempty("Name is required").trim().min(2, "Name is too short"),
        email: z.string().nonempty("Email is required").trim().email("Enter a valid email"),
        password: z.string().nonempty("Password is required").min(8, "Minimum 8 characters"),
        confirmPassword: z.string().nonempty("Please confirm your password"),
        role: RoleEnum.default("user"),           
        accept: z.literal(true, {
            errorMap: () => ({ message: "Please accept the terms" }), 
        } as any),
    })
    .refine((d) => d.password === d.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type RegisterInput = z.infer<typeof RegisterSchema>;

// change the schema