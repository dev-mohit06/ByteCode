import ApiResponse from "../utils/api.util.js";
import { asyncWrapper, getHasedPassword, getJwtToken, isValidPassword } from "../utils/index.util.js";
import User from '../Schema/User.js';
import { v4 as uuidv4 } from 'uuid';
import admin from 'firebase-admin';
import {getAuth} from 'firebase-admin/auth'
import serviceAccount from '../config/firebase-admin-config.js';


// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const generateUsername = async (email) => {
    let username = email.split('@')[0].replace(/[.-]/g, '');

    let isUserExsist = await User.findOne({ "personal_info.username": username });
    if (isUserExsist) {
        return username + uuidv4().split('-')[0];
    }

    return username;
}

const getResponseData = (user) => {
    return {
        access_token : getJwtToken(user),
        profile_img : user.personal_info.profile_img,
        username: user.personal_info.username,
        fullname: user.personal_info.fullname,
    }
}

export const signup = asyncWrapper(async (req, res, next) => {
    let { fullname, email, password } = req.body;

    let hashedPassword = await getHasedPassword(password);
    let username = await generateUsername(email);

    let user = new User({
        personal_info: {
            fullname,
            email,
            password: hashedPassword,
            username
        }
    });

    await user.save();
    res.status(201).json(new ApiResponse(true, "Account created successfully", getResponseData(user)));
});

export const signin = asyncWrapper(async (req, res, next) => {
    let { email, password } = req.body;

    let user = await User.findOne({ "personal_info.email": email });
    if (!user) {
        return res.status(404).json(new ApiResponse(false, "User not found", null));
    }

    if(user.google_auth){
        return res.status(403).json(
            new ApiResponse(false,'This email was signed up with google. Please log in with google to access the account',null)
        )
    }

    let isPasswordValid = await isValidPassword(password, user.personal_info.password);
    if (!isPasswordValid) {
        return res.status(401).json(new ApiResponse(false, "Invalid password", null));
    }

    res.status(200).json(new ApiResponse(true, "Logged in successfully", getResponseData(user)));
});

export const googleAuth = asyncWrapper(async (req, res, next) => {
    
    let {access_token} = req.body;

    let decodedToken = await getAuth().verifyIdToken(access_token);

    if(!decodedToken){
        next(new Error('Invalid access token'));
    }

    let {email,name} = decodedToken;

    let user = await User.findOne({"personal_info.email": email}).select('personal_info.username personal_info.fullname personal_info.profile_img google_auth');

    if(user){
        if(!user.google_auth){
            res.status(403).json(
                new ApiResponse(false,'This email was signed up without google. Please log in with password to access the account',null)
            )
        }else{
            res.status(200).json(new ApiResponse(true,'Logged in successfully',getResponseData(user)));
        }
    }else{
        user = new User({
            personal_info: {
                email,
                fullname: name,
                username: await generateUsername(email)
            },
            google_auth: true
        });

        await user.save();
        res.status(201).json(new ApiResponse(true,'Account created successfully',getResponseData(user)));
    }
});