import { nanoid } from "nanoid";
import Blog from "../Schema/Blog.js";
import User from "../Schema/User.js";
import ApiResponse from "../utils/api.util.js";
import dotenv from 'dotenv';
import { asyncWrapper } from "../utils/index.util.js";
dotenv.config();

export const createBlog = asyncWrapper(async (req, res, next) => {

    let { blog_id,title, content, banner, des, tags, draft } = req.body;

    let blogId = blog_id || title.replace(/[^a-zA-Z0-9]/g, ' ').replace(/\s+/g, "-").trim() + nanoid();

    if(blog_id){
        await Blog.findOneAndUpdate({blog_id},{$set:{title, content, banner, des, tags, draft}});
        res.status(200).json(new ApiResponse(true, "Blog Updated Successfully", null));
    }else{
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
    let { tag, query, author, page,limit,eleminate_blog_id } = req.body;

    let findQuery;

    if (tag) {
        if (eleminate_blog_id) {
            findQuery = { tags: tag, draft: false, blog_id: { $ne: eleminate_blog_id } }
        }else{
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

export const getBlog = asyncWrapper(async (req,res,next) => {
    let {blog_id} = req.body;

    await Blog.updateOne({blog_id},{$inc:{"activity.total_reads":1}});

    let blog = await Blog.findOne({
        blog_id
    }).populate("author","personal_info.profile_img personal_info.username personal_info.fullname")
    .select("blog_id title des content banner activity tags publishedAt -_id");

    if(blog){     
        await User.findOneAndUpdate({"personal_info.username" : blog.author.personal_info.username},{$inc:{"account_info.total_reads":1}});
    }

    res.status(200).json(new ApiResponse(true,"Blog",blog));
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