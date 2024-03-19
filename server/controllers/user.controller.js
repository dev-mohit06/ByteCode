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

    if (user.google_auth) {
        return res.status(400).json(new ApiResponse(false, "You are using google authentication, you can't change password", null));
    }

    let isPasswordValid = await isValidPassword(currentPassword, user.personal_info.password);

    if (!isPasswordValid) {
        return res.status(400).json(new ApiResponse(false, "Current Password Invalid!!", null));
    }

    if (currentPassword === newPassword) {
        return res.status(400).json(new ApiResponse(false, "New Password can't be same as Current Password", null));
    }

    user.personal_info.password = await getHasedPassword(newPassword);
    user.updatedAt = Date.now();
    await user.save();

    return res.status(200).json(new ApiResponse(true, "Password Changed Successfully", null));
});

export const updateProfileImg = asyncWrapper(async (req, res, next) => {
    let user_id = req.user.id;
    let { profile_img } = req.body;

    const user = await User.findOneAndUpdate({ _id: user_id }, { "personal_info.profile_img": profile_img, updatedAt: Date.now() });

    return res.status(200).json(new ApiResponse(true, "Profile Image Updated Successfully", null));
});

export const updateProfile = asyncWrapper(async (req, res, next) => {
    let user_id = req.user.id;
    let { username, bio, facebook, github, instagram, twitter, website, youtube } = req.body;

    let social_links = {
        facebook,
        github,
        instagram,
        twitter,
        website,
        youtube
    }

    let socialArr = Object.keys(social_links);
    for (let i = 0; i < socialArr.length; i++) {
        if (social_links[socialArr[i]].length) {
            try {
                let hostname = new URL(social_links[socialArr[i]]).hostname;
                if (!hostname.includes(`${socialArr[i]}.com`) && !social_links.website) {
                    return res.status(400).json(new ApiResponse(false, `Invalid ${socialArr[i]} link. You must enter the full link.`, null));
                }
            } catch (error) {
                return res.status(400).json(new ApiResponse(false, `Invalid ${socialArr[i]} link.`, null));
            }
        }
    }

    let updateObj = {
        "personal_info.username": username,
        "personal_info.bio": bio,
        social_links,
        updatedAt: Date.now()
    }

    try {
        const user = await User.findOneAndUpdate({ _id: user_id }, updateObj, {
            runValidators: true,
        });
        return res.status(200).json(new ApiResponse(true, "Profile Updated Successfully", username));
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json(new ApiResponse(false, "Username already taken", null));
        }
    }
});