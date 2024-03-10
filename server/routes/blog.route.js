import express from 'express';
import validate from '../middlewares/zod.middleware.js';
import { blogSchema } from '../middlewares/validation-schemas/blog.validation-schema.js';
import { createBlog, getLatestBlogs, getSearchBlogs, getTrendingBlogs } from '../controllers/blog.controller.js';
import verifyJwtToken from '../middlewares/jwt.middleware.js';
const router = express.Router();

router.post('/create', verifyJwtToken, validate(blogSchema), createBlog);
router.get('/latest', getLatestBlogs);
router.get('/trending', getTrendingBlogs);
router.post('/search-blogs', getSearchBlogs);
export default router;