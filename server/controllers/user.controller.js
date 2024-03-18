import { asyncWrapper, getHasedPassword, isValidPassword } from '../utils/index.util.js';
import User from '../Schema/User.js';
import dotenv from 'dotenv';
import ApiResponse from '../utils/api.util.js';
dotenv.config();

export const searchUser = asyncWrapper(async (req, res, next) => {

    let { query } = req.body;

    const users = await User.find({ "personal_info.username": { $regex: query, $options: "i" } })
        .limit(process.env.SHOW_USER_PER_PAGE)
        .select("personal_info.username personal_info.profile_img personal_info.fullname -_id");

    res.status(200).json(new ApiResponse(true, `Search Results For ${query}`, users));
});

export const getProfile = asyncWrapper(async (req, res, next) => {
    let { userId } = req.body;

    const user = await User.findOne({ "personal_info.username": userId })
        .select("-personal_info.password -google_auth -updatedAt");

    return res.status(200).json(new ApiResponse(true, `Profile of ${userId}`, user));
});

export const changePassword = asyncWrapper(async (req, res, next) => {
    let { currentPassword, newPassword } = req.body;
    let user_id = req.user.id;

    const user = await User.findOne({ _id: user_id });
    if (!user) {
        return res.status(404).json(new ApiResponse(false, "User Not Found"));
    }

    if(user.google_auth){
        return res.status(400).json(new ApiResponse(false, "You are using google authentication, you can't change password", null));
    }

    let isPasswordValid = await isValidPassword(currentPassword, user.personal_info.password);

    if (!isPasswordValid) {
        return res.status(400).json(new ApiResponse(false, "Current Password Invalid!!", null));
    }

    if(currentPassword === newPassword){
        return res.status(400).json(new ApiResponse(false, "New Password can't be same as Current Password", null));
    }

    user.personal_info.password = await getHasedPassword(newPassword);
    user.updatedAt = Date.now();
    await user.save();

    return res.status(200).json(new ApiResponse(true, "Password Changed Successfully", null));
});