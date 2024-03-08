import ApiResponse from "../utils/api.util.js";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

const verifyJwtToken = (req,res,next) => {
    const token = req.headers['authorization'];
    if(!token) return res.status(401).json(new ApiResponse(false, 'Unauthorized', null));
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch(error){
        return res.status(401).json(new ApiResponse(false, 'Token Expired or Invalid', null));
    }
}

export default verifyJwtToken;