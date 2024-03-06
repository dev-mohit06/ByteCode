import {z} from 'zod';
import User from '../../Schema/User.js';

export const signupSchema = z.object({
    fullname : z
        .string({required_error : 'Fullname is required'})
        .min(1, {message : 'Fullname must be at least 3 letter long'})
        .max(255, {message : 'Fullname must not exceed 255 characters'}),
    email : z
        .string({required_error : 'Email is required'})
        .email({message : 'Invalid email format'})
        .min(1, {message : 'Email is required'})
        .refine(async (email) => {
            let user = await User.findOne({"personal_info.email" : email});
            return !user;
        }, {message : 'Email already exists'}),
    password : z
        .string({required_error : 'Password is required'})
        .min(8, {message : 'Password must be at least 8 characters long'})
});

export const signinSchema = z.object({
    email : z.string({required_error : 'Email is required'}).email({message : 'Invalid email format'}).min(1, {message : 'Email is required'}),
    password : z.string({required_error : 'Password is required'}).min(8, {message : 'Password must be at least 8 characters long'})
});

export const googleAuthSchema = z.object({
    access_token : z.string({required_error : 'Access token is required'})
});