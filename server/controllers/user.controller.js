import { asyncWrapper } from '../utils/index.util.js';
import User from '../Schema/User.js';
import dotenv from 'dotenv';
import ApiResponse from '../utils/api.util.js';
dotenv.config();

export const searchUser = asyncWrapper(async (req,res,next) => {

    let {query} = req.body;

    const users = await User.find({"personal_info.username": {$regex: query, $options: "i"}})
    .limit(process.env.SHOW_USER_PER_PAGE)
    .select("personal_info.username personal_info.profile_img personal_info.fullname -_id");

    res.status(200).json(new ApiResponse(true, `Search Results For ${query}`, users));
});

export const getProfile = asyncWrapper(async (req,res,next) => {
    let {userId} = req.body;

    const user = await User.findOne({"personal_info.username": userId})
    .select("-personal_info.password -google_auth -updatedAt");

    return res.status(200).json(new ApiResponse(true, `Profile of ${userId}`, user));
});