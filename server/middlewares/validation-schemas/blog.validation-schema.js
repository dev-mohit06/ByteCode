import { z } from 'zod';

export const blogSchema = z.object({
    title: z
        .string({ required_error: 'Title is required' }),
    banner: z
        .string({ required_error: 'Banner is required' }),
    content: z
        .any({ required_error: 'Content are required' }),
});

export const getBlogSchema = z.object({
    blog_id: z
        .string({ required_error: 'Blog id is required' })
});

export const likeBlogSchema = z.object({
    blog_id: z
        .string({ required_error: 'Blog id is required' }),
    is_liked_by_user: z
        .any({ required_error: 'is_liked_by_user is required' })
});

export const commentSchema = z.object({
    _id: z.string({ required_error: 'id is required' }),
    comment: z.string({ required_error: 'comment is required' }),
    blog_author: z.string({ required_error: 'blog_author is required' }),
});

export const getBlogCommentsSchema = z.object({
    blog_id: z.string({ required_error: 'blog_id is required' }),
    skip: z.number({ required_error: 'skip is required' }),
});

export const getBlogRepliesSchema = z.object({
    comment_id: z.string({ required_error: 'comment_id is required' }),
    skip: z.number({ required_error: 'skip is required' }),
});

export const deleteCommentOrReplySchema = z.object({
    comment_id: z.string({ required_error: 'comment_id is required' })
});