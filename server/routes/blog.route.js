import express from 'express';
import validate from '../middlewares/zod.middleware.js';
import { blogSchema } from '../middlewares/validation-schemas/blog.validation-schema.js';
import { createBlog, getLatestBlogs, getLatestBlogsCount, getSearchBlogs, getSearchBlogsCount, getTrendingBlogs } from '../controllers/blog.controller.js';
import verifyJwtToken from '../middlewares/jwt.middleware.js';
const router = express.Router();

router.post('/create', verifyJwtToken, validate(blogSchema), createBlog);
router.post('/latest', getLatestBlogs);
router.get('/trending', getTrendingBlogs);
router.post('/search-blogs', getSearchBlogs);
router.post('/all-latest-blog-count', getLatestBlogsCount);
router.post('/serach-blog-count',getSearchBlogsCount);

export default router;