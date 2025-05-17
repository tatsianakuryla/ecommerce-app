import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(
      1,
      'Email address must contain a domain name (e.g., example.com) and an "@" symbol separating local part and domain name',
    )
    .refine(
      (val) => val.trim() === val,
      'Email must not contain leading or trailing spaces',
    )
    .refine(
      (val) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val.trim()),
      'Email address must contain a domain name (e.g., example.com) and an "@" symbol separating local part and domain name',
    ),
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
});

export type LoginFormData = z.infer<typeof loginSchema>;
