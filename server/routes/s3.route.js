import express from 'express';
import { generateUploadUrl } from '../utils/s3.util.js';
import ApiResponse from '../utils/api.util.js';
const router = express.Router();

router.get('/get-upload-url', async (req, res, next) => {
    try {
        const url = await generateUploadUrl();
        res.status(200).json(new ApiResponse(
            true,
            "url generated successfully!!",
            url
        ));
    } catch (error) {
        next(error);
    }
});
export default router;