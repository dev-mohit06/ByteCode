import {z} from 'zod';

export const getNotificationsSchema = z.object({
    page : z.any().optional(),
    filter : z.any({required_error : "Filter is required"}),
    deleteDocCount : z.any({required_error : "Delete Doc Count is required"}),
});

export const getAllNotificationsCountSchema = z.object({
    filter : z.string({required_error : "Filter is required"})
});