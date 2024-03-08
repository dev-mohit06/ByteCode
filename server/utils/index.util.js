import ApiResponse from './api.util.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const corsOptions = {
    origin: '*', // You should set this to the actual origin you want to allow
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: '*',
};

export const asyncWrapper = (fn) => {
    return async (req, res, next) => {
        try{
            await fn(req, res, next)
        }catch(error){
            next(error);
        }
    }
};

export const errorHndler = (error, req, res, next) => {
    res.status(500).json(new ApiResponse(false, error.message, null));
}

export const getHasedPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

export const isValidPassword = async (password,hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
}

export const getJwtToken = (user) => {
    return jwt.sign({id : user._id}, process.env.JWT_SECRET, {expiresIn : '1h'});
}