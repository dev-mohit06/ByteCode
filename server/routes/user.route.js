import express from 'express';
import validate from '../middlewares/zod.middleware.js';
import { userChangePasswordSchema, userGetProfileSchema, userSearchSchema } from '../middlewares/validation-schemas/user.validation-schema.js'
import { changePassword, getProfile, searchUser } from '../controllers/user.controller.js';
import verifyJwtToken from '../middlewares/jwt.middleware.js';
const router = express.Router();

router.post('/search', validate(userSearchSchema), searchUser);
router.post('/get-profile', validate(userGetProfileSchema), getProfile);
router.post('/change-password', verifyJwtToken, validate(userChangePasswordSchema), changePassword)

export default router;