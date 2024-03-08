import express from 'express';
import validate from '../middlewares/zod.middleware.js';
import { blogSchema } from '../middlewares/validation-schemas/blog.validation-schema.js';
import { createBlog } from '../controllers/blog.controller.js';
const router = express.Router();

router.post('/create',validate(blogSchema),createBlog);
export default router;