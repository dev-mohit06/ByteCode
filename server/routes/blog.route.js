import express from 'express';
import validate from '../middlewares/zod.middleware.js';
import { blogSchema, commentSchema, deleteCommentOrReplySchema, getBlogCommentsSchema, getBlogRepliesSchema, getBlogSchema, likeBlogSchema } from '../middlewares/validation-schemas/blog.validation-schema.js';
import { createBlog, getBlog, getLatestBlogs, getLatestBlogsCount, getSearchBlogs, getSearchBlogsCount, getTrendingBlogs, isLikedByUser, likeBlog, verifyBlog, addComment, getBlogComments, getBlogCommentsReplies, deleteBlogCommentOrReply } from '../controllers/blog.controller.js';
import verifyJwtToken from '../middlewares/jwt.middleware.js';
const router = express.Router();

router.post("/create", verifyJwtToken, validate(blogSchema), createBlog);
router.post("/latest", getLatestBlogs);
router.get("/trending", getTrendingBlogs);
router.post("/search-blogs", getSearchBlogs);
router.post("/all-latest-blog-count", getLatestBlogsCount);
router.post("/serach-blog-count",getSearchBlogsCount);
router.post("/get-blog",validate(getBlogSchema),getBlog);
router.post("/verify-blog",verifyJwtToken,validate(getBlogSchema),verifyBlog);
router.post("/like-blog",verifyJwtToken,validate(likeBlogSchema),likeBlog);
router.post("/is-liked-by-user",verifyJwtToken,validate(getBlogSchema),isLikedByUser);
router.post("/add-comment",verifyJwtToken,validate(commentSchema),addComment);
router.post("/fetch-comment",validate(getBlogCommentsSchema),getBlogComments);
router.post("/fetch-replies",validate(getBlogRepliesSchema),getBlogCommentsReplies)
router.post("/delete-comment-or-reply",verifyJwtToken,validate(deleteCommentOrReplySchema),deleteBlogCommentOrReply)

export default router;