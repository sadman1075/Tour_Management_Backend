import z from "zod";
import { IsActive, Role } from "./user.interface";

export const createUserZodSchema = z.object({
    name: z
        .string({ invalid_type_error: "name must be string" })
        .min(2, { message: "Name must be at least 2 characters long" })
        .max(50, { message: "Name cant not exceed 50 characters" }),

    email: z
        .string({ invalid_type_error: "name must be string" })
        .email({ message: "Invalid email address format" })
        .min(5, { message: "email must be at least 2 characters long" })
        .max(100, { message: "email cant not exceed 100 characters" }),

    password: z
        .string({ invalid_type_error: "name must be string" })
        .min(8, { message: "password must be at least 8 characters long" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
        .regex(/\d/, { message: "Password must contain at least one digit." })
        .regex(/[!@#$%^&*()]/, { message: "Password must contain at least one special character" }),
    phone: z
        .string({ invalid_type_error: "phone must be string" })
        .regex(/^(?:\+8801|8801|01)[0-9]{9}$/, { message: "Invalid Bangladeshi phone number." })
        .optional(),

    address: z
        .string({ invalid_type_error: "address must be string" })
        .max(200, { message: "Address can not exceed 200 characters" })
        .optional()

})

export const updateUserZodSchema = z.object({
    name: z
        .string({ invalid_type_error: "name must be string" })
        .min(2, { message: "Name must be at least 2 characters long" })
        .max(50, { message: "Name cant not exceed 50 characters" })
        .optional(),

    email: z
        .string({ invalid_type_error: "name must be string" })
        .email({ message: "Invalid email address format" })
        .min(5, { message: "email must be at least 2 characters long" })
        .max(100, { message: "email cant not exceed 100 characters" })
        .optional(),

    password: z
        .string({ invalid_type_error: "name must be string" })
        .min(8, { message: "password must be at least 8 characters long" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
        .regex(/\d/, { message: "Password must contain at least one digit." })
        .regex(/[!@#$%^&*()]/, { message: "Password must contain at least one special character" })
        .optional(),

    phone: z
        .string({ invalid_type_error: "phone must be string" })
        .regex(/^(?:\+8801|8801|01)[0-9]{9}$/, { message: "Invalid Bangladeshi phone number." })
        .optional(),

    address: z
        .string({ invalid_type_error: "address must be string" })
        .max(200, { message: "Address can not exceed 200 characters" })
        .optional(),
    role: z
        .enum(Object.values(Role) as [string])
        .optional(),
    isActive: z
        .enum(Object.values(IsActive) as [string])
        .optional(),
    isVerified: z
        .boolean({ invalid_type_error: "isVerified must be true or false" })
        .optional(),
    isDeleted: z
        .boolean({ invalid_type_error: "isDeleted must be true or false" })
        .optional()



})



