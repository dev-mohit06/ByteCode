import { z } from 'zod';

export const userSearchSchema = z.object({
    query: z
        .string({ required_error: 'search query is required' }),
});

export const userGetProfileSchema = z.object({
    userId: z
        .string({ required_error: 'userId is required' }),
});

export const userChangePasswordSchema = z.object({
    currentPassword: z
        .string({ required_error: 'current password is required' })
        .min(8, { message: 'Password must be at least 8 characters long' }),
    newPassword: z
        .string({ required_error: 'new password is required' })
        .min(8, { message: 'Password must be at least 8 characters long' })
});