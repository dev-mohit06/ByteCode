import { nanoid } from "nanoid";
import Blog from "../Schema/Blog.js";
import User from "../Schema/User.js";
import ApiResponse from "../utils/api.util.js";

export const createBlog = async(req,res,next) => {
    
    let {title,content,banner,des,tags,draft} = req.body;

    let blogId = title.replace(/[^a-zA-Z0-9]/g,' ').replace('/\s+/g',"-").trim() + nanoid();
    
    const blog = new Blog({
        blog_id : blogId,
        title,
        banner,
        des,
        content,
        tags,
        author : req.user.id,
        draft : Boolean(draft)
    });

    try {
        await blog.save();
        let incrementCount = draft ? 0 : 1;

        await User.findOneAndUpdate({_id : req.user.id},{$inc : {"account_info.total_posts" : incrementCount},$push : {blogs : blog._id}});

        res.status(201).json(new ApiResponse(true,"Blog Created Successfully",blog));

    } catch (error) {
        next(error);
    }
}