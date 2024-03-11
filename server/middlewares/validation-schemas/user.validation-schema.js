import {z} from 'zod';

export const userSearchSchema = z.object({
    query : z
        .string({required_error : 'search query is required'}),
});

export const userGetProfileSchema = z.object({
    userId : z
        .string({required_error : 'userId is required'}),
});