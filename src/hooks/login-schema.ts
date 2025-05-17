import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address (e.g., user@example.com)')
    .refine((value) => value.trim() === value, {
      message: 'Email must not contain leading or trailing whitespace',
    }),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least 1 uppercase letter')
    .regex(/[a-z]/, 'Must contain at least 1 lowercase letter')
    .regex(/[0-9]/, 'Must contain at least 1 number')
    .regex(/[!@#$%^&*]/, 'Must contain at least 1 special character (!@#$%^&*)')
    .refine((value) => value.trim() === value, {
      message: 'Password must not contain leading or trailing whitespace',
    }),
})

export type LoginFormData = z.infer<typeof loginSchema>
