import { PutObjectCommand } from '@aws-sdk/client-s3';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner'
import s3 from '../config/s3.config.js';
import { nanoid } from 'nanoid';

export const generateUploadUrl = async (folderName = "blog_banners") => {
    try{
        const imageName = `${nanoid()}-${Date.now()}.jpeg`

        const command = new PutObjectCommand({
            Bucket : process.env.AWS_BUCKET_NAME,
            Key : `${folderName}/${imageName}`,
            ContentType: "image/jpeg",
        });

        return getSignedUrl(s3,command,{expiresIn : 60});
    }catch(error){
        throw error;
    }
}