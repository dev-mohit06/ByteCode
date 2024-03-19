import express from 'express';
import validate from '../middlewares/zod.middleware.js';
import { userChangePasswordSchema, userGetProfileSchema, userSearchSchema, userUpdateProfileImgSchema, userUpdateProfileSchema } from '../middlewares/validation-schemas/user.validation-schema.js'
import { changePassword, getProfile, searchUser, updateProfile, updateProfileImg } from '../controllers/user.controller.js';
import verifyJwtToken from '../middlewares/jwt.middleware.js';
const router = express.Router();

router.post('/search', validate(userSearchSchema), searchUser);
router.post('/get-profile', validate(userGetProfileSchema), getProfile);
router.post('/change-password', verifyJwtToken, validate(userChangePasswordSchema), changePassword)
router.post('/update-profile-img',verifyJwtToken, validate(userUpdateProfileImgSchema),updateProfileImg);
router.post('/update-profile',verifyJwtToken,validate(userUpdateProfileSchema),updateProfile)
export default router;