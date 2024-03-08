import {z} from 'zod';

export const blogSchema = z.object({
    title : z
        .string({required_error : 'Title is required'}),
    banner : z
        .string({required_error : 'Banner is required'}),
    content : z
        .any({required_error : 'Content are required'}),
});