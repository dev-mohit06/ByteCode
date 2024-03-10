import { nanoid } from "nanoid";
import Blog from "../Schema/Blog.js";
import User from "../Schema/User.js";
import ApiResponse from "../utils/api.util.js";
import dotenv from 'dotenv';
dotenv.config();

export const createBlog = async (req, res, next) => {

    let { title, content, banner, des, tags, draft } = req.body;

    let blogId = title.replace(/[^a-zA-Z0-9]/g, ' ').replace('/\s+/g', "-").trim() + nanoid();

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

    try {
        await blog.save();
        let incrementCount = draft ? 0 : 1;

        await User.findOneAndUpdate({ _id: req.user.id }, { $inc: { "account_info.total_posts": incrementCount }, $push: { blogs: blog._id } });

        res.status(201).json(new ApiResponse(true, "Blog Created Successfully", blog));

    } catch (error) {
        next(error);
    }
}

export const getLatestBlogs = async (req, res, next) => {
    try {
        let blogs = await Blog.find({ draft: false })
            .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
            .sort({ publishedAt: -1 })
            .skip((req.body.page - 1) * process.env.BLOGS_PER_PAGE)
            .select("blog_id title des banner activity tags publishedAt -_id")
            .limit(process.env.BLOGS_PER_PAGE)

        res.status(200).json(new ApiResponse(true, "Latest Blogs", blogs));
    } catch (error) {
        next(error);
    }
}

export const getTrendingBlogs = async (req, res, next) => {
    try {
        let blogs = await Blog.find({ draft: false })
            .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
            .sort({ "activity.total_read": -1, "activity.total_likes": -1, "publishedAt": -1 })
            .select("blog_id title des banner activity tags publishedAt -_id")
            .limit(process.env.BLOGS_PER_PAGE)

        res.status(200).json(new ApiResponse(true, "Latest Blogs", blogs));
    } catch (error) {
        next(error);
    }
}

export const getSearchBlogs = async (req, res, next) => {
    try {
        let { tag } = req.body;
        let findQuery = { tags: tag, draft: false }
        let maxlimit = process.env.BLOGS_PER_PAGES;
        const blogs = await Blog.find(findQuery)
            .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
            .sort({ publishedAt: -1 })
            .select("blog_id title des banner activity tags publishedAt -_id")
            .limit(maxlimit)

        res.status(200).json(new ApiResponse(true, "Blogs", blogs));
    }
    catch (error) {
        next(error)
    }

}

export const getLatestBlogsCount = async (req, res, next) => {
    try {
        let count = await Blog.countDocuments({ draft: false });
        res.status(200).json(new ApiResponse(true, "Total Blogs", count));
    } catch (error) {
        next(error);
    }
}

export const getSearchBlogsCount = async (req, res, next) => {
    let { tag } = req.body;
    try {
        let count = await Blog.countDocuments({ draft: false , tags: tag});
        res.status(200).json(new ApiResponse(true, "Total Blogs", count));
    } catch (error) {
        next(error);
    }
}