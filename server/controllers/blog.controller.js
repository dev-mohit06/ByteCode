import { nanoid } from "nanoid";
import Blog from "../Schema/Blog.js";
import User from "../Schema/User.js";
import Comment from "../Schema/Comment.js";
import Notification from '../Schema/Notification.js'
import ApiResponse from "../utils/api.util.js";
import dotenv from 'dotenv';
import { asyncWrapper } from "../utils/index.util.js";
dotenv.config();

export const createBlog = asyncWrapper(async (req, res, next) => {

    let { blog_id, title, content, banner, des, tags, draft } = req.body;

    let blogId = blog_id || title.replace(/[^a-zA-Z0-9]/g, ' ').replace(/\s+/g, "-").trim() + nanoid();

    if (blog_id) {
        await Blog.findOneAndUpdate({ blog_id }, { $set: { title, content, banner, des, tags, draft } });
        res.status(200).json(new ApiResponse(true, "Blog Updated Successfully", null));
    } else {
        const blog = new Blog({
            blog_id: blogId,
            title,
            banner,
            des,
            content,
            tags,
            author: req.user.id,
            draft: Boolean(draft)
        });

        await blog.save();
        let incrementCount = draft ? 0 : 1;

        await User.findOneAndUpdate({ _id: req.user.id }, { $inc: { "account_info.total_posts": incrementCount }, $push: { blogs: blog._id } });

        res.status(201).json(new ApiResponse(true, "Blog Created Successfully", blog));
    }
});

export const getLatestBlogs = asyncWrapper(async (req, res, next) => {
    let blogs = await Blog.find({ draft: false })
        .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
        .sort({ publishedAt: -1 })
        .skip((req.body.page - 1) * process.env.BLOGS_PER_PAGE)
        .select("blog_id title des banner activity tags publishedAt -_id")
        .limit(process.env.BLOGS_PER_PAGE)

    res.status(200).json(new ApiResponse(true, "Latest Blogs", blogs));
});

export const getTrendingBlogs = asyncWrapper(async (req, res, next) => {
    let blogs = await Blog.find({ draft: false })
        .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
        .sort({ "activity.total_read": -1, "activity.total_likes": -1, "publishedAt": -1 })
        .select("blog_id title des banner activity tags publishedAt -_id")
        .limit(process.env.BLOGS_PER_PAGE)

    res.status(200).json(new ApiResponse(true, "Latest Blogs", blogs));
});

export const getSearchBlogs = asyncWrapper(async (req, res, next) => {
    let { tag, query, author, page, limit, eleminate_blog_id } = req.body;

    let findQuery;

    if (tag) {
        if (eleminate_blog_id) {
            findQuery = { tags: tag, draft: false, blog_id: { $ne: eleminate_blog_id } }
        } else {
            findQuery = { tags: tag, draft: false }
        }
    } else if (query) {
        findQuery = { title: { $regex: query, $options: 'i' }, draft: false }
    } else if (author) {
        findQuery = { author: author, draft: false }
    }

    let maxlimit = limit ? limit : process.env.BLOGS_PER_PAGE;
    const blogs = await Blog.find(findQuery)
        .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
        .sort({ publishedAt: -1 })
        .select("blog_id title des banner activity tags publishedAt -_id")
        .skip((page - 1) * maxlimit)
        .limit(maxlimit);

    res.status(200).json(new ApiResponse(true, "Blogs", blogs));
});

export const getLatestBlogsCount = asyncWrapper(async (req, res, next) => {
    let count = await Blog.countDocuments({ draft: false });
    res.status(200).json(new ApiResponse(true, "Total Blogs", count));
});

export const getSearchBlogsCount = asyncWrapper(async (req, res, next) => {
    let { tag, query, author } = req.body;

    let findQuery;

    if (tag) {
        findQuery = { tags: tag, draft: false }
    }
    else if (query) {
        findQuery = { title: { $regex: query, $options: 'i' }, draft: false }
    }
    else if (author) {
        findQuery = { author: author, draft: false }
    }

    let count = await Blog.countDocuments(findQuery);
    res.status(200).json(new ApiResponse(true, "Total Blogs", count));
});

export const getBlog = asyncWrapper(async (req, res, next) => {
    let { blog_id } = req.body;

    await Blog.updateOne({ blog_id }, { $inc: { "activity.total_reads": 1 } });

    let blog = await Blog.findOne({
        blog_id
    }).populate("author", "personal_info.profile_img personal_info.username personal_info.fullname")
        .select("blog_id title des content banner activity tags publishedAt");

    if (blog) {
        await User.findOneAndUpdate({ "personal_info.username": blog.author.personal_info.username }, { $inc: { "account_info.total_reads": 1 } });
    }

    res.status(200).json(new ApiResponse(true, "Blog", blog));
});

export const verifyBlog = asyncWrapper(async (req, res, next) => {
    const { blog_id } = req.body;
    const user_id = req.user.id;

    const user = await User.findById(user_id)
        .select("blogs -_id") // Only select the 'blogs' field
        .populate({
            path: "blogs",
            select: "blog_id title des content author banner tags", // Only select the 'blog_id' and 'draft' fields
        });

    const isBlogExist = user.blogs.some(blog => blog.blog_id === blog_id && !blog.draft);

    let blog = null;
    if (isBlogExist) {
        blog = user.blogs.find(blog => blog.blog_id === blog_id && !blog.draft);
    }

    res.status(isBlogExist ? 200 : 401).json(new ApiResponse(isBlogExist, isBlogExist ? "Blog Verified" : "Blog Not Verified", blog));
});

export const likeBlog = asyncWrapper(async (req, res, next) => {
    let { blog_id, is_liked_by_user } = req.body;
    let user_id = req.user.id;

    let incVal = is_liked_by_user ? -1 : 1;

    let blog = await Blog.findOneAndUpdate({ blog_id }, { $inc: { "activity.total_likes": incVal } });

    if (!is_liked_by_user) {
        let like = new Notification({
            type: "like",
            blog: blog._id,
            notification_for: blog.author,
            user: user_id,
        });

        let notification = await like.save();
        res.status(200).json(new ApiResponse(true, "Blog Liked Successfully", {
            liked_by_user: true
        }));
    } else {
        await Notification.findOneAndDelete({
            user: user_id,
            type: "like",
            blog: blog._id,
        });

        res.status(200).json(new ApiResponse(true, "Blog Unliked Successfully", {
            liked_by_user: false
        }));
    }

});

export const isLikedByUser = asyncWrapper(async (req, res, next) => {
    let user_id = req.user.id;
    let { blog_id: _id } = req.body;

    let isExsist = await Notification.exists({
        user: user_id,
        type: "like",
        blog: _id,
    });

    if (isExsist) {
        res.status(200).json(new ApiResponse(true, "Blog Liked By User", {
            liked_by_user: true
        }));
        return;
    } else {
        res.status(200).json(new ApiResponse(true, "Blog Not Liked By User", {
            liked_by_user: false
        }));
    }
});

export const addComment = asyncWrapper(async (req, res, next) => {
    let { _id, comment, blog_author, replying_to } = req.body;
    let user_id = req.user.id;

    let comment_ds = {
        blog_id: _id,
        blog_author,
        comment,
        commented_by: user_id,
    }

    if (replying_to) {
        comment_ds.parent = replying_to;
        comment_ds.isReply = true;
    }

    let comment_obj = new Comment(comment_ds);

    let data = await comment_obj.save();
    let { commentedAt, children } = data;

    await Blog.findOneAndUpdate(
        { _id },
        {
            $push: { comments: data._id },
            $inc: {
                "activity.total_comments": 1,
                "activity.total_parent_comments": replying_to ? 0 : 1,
            }
        }
    );

    let notification = {
        "type": replying_to ? "reply" : "comment",
        blog: _id,
        notification_for: blog_author,
        user: user_id,
        comment: data._id,
    }

    if (replying_to) {
        notification.replied_on_comment = replying_to;

        let replying_to_comment = await Comment.findOneAndUpdate({
            _id: replying_to
        }, {
            $push: { children: data._id }
        });

        notification.notification_for = replying_to_comment.commented_by;
    }

    await new Notification(notification).save();

    return res.status(200).json(new ApiResponse(true, "Comment added successfully", {
        comment,
        commentedAt,
        _id: data._id,
        user_id,
        children
    }));
})

export const getBlogComments = asyncWrapper(async (req, res, next) => {
    let { blog_id, skip } = req.body;

    let maxlimit = process.env.COMMENTS_PER_PAGE;

    let comments = await Comment.find({
        blog_id,
        isReply: false,
    }).populate("commented_by", "personal_info.profile_img personal_info.username personal_info.fullname")
        .skip(skip)
        .sort({
            'commentedAt': -1
        })
        .limit(maxlimit);

    res.status(200).json(new ApiResponse(true, "Comments", comments));
});

export const getBlogCommentsReplies = asyncWrapper(async (req, res, next) => {
    let { comment_id, skip } = req.body;

    let maxlimit = process.env.COMMETS_REPLY_PER_PAGE;

    let replies = await Comment.findOne({
        _id: comment_id
    }).populate({
        path: "children",
        options: {
            limit: maxlimit,
            skip: skip,
            sort: { 'commentedAt': -1 }
        },
        populate: {
            path: "commented_by",
            select: "personal_info.profile_img personal_info.username personal_info.fullname"
        },
        select: "-blog_id -updatedAt"
    })
        .select("children");

    res.status(200).json(new ApiResponse(true, "Replies", replies));
});

export const deleteBlogCommentOrReply = asyncWrapper(async (req, res, next) => {
    let { comment_id } = req.body;
    let user_id = req.user.id;

    let comment = await Comment.findOne({ _id: comment_id });

    const deleteComment = async (_id) => {
        let comment = await Comment.findOneAndDelete({ _id });

        if (comment.parent) {
            await Comment.findOneAndUpdate({
                _id: comment.parent
            }, {
                $pull: { children: _id }
            });
        }

        await Notification.deleteMany({
            $or: [{ comment: _id }, { reply: _id }]
        });

        await Blog.findOneAndUpdate({
            _id: comment.blog_id
        }, {
            $pull: { comments: _id },
            $inc: { "activity.total_parent_comments": comment.parent ? 0 : -1, "activity.total_comments": -1 }
        });

        if (comment.children.length) {
            await Promise.all(comment.children.map(async child => {
                await deleteComment(child);
            }));
        }
    }

    if (comment) {
        if (user_id == comment.commented_by || user_id == comment.blog_author) {
            await deleteComment(comment_id);
            return res.status(200).json(new ApiResponse(true, "Comment deleted successfully", null));
        }
        else {
            res.status(403).json(new ApiResponse(false, "You are not authorized to delete this comment", null));
        }
    }
});