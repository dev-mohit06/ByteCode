import express from 'express';
import validate from '../middlewares/zod.middleware.js';
import {userGetProfileSchema, userSearchSchema} from '../middlewares/validation-schemas/user.validation-schema.js'
import {getProfile, searchUser} from '../controllers/user.controller.js';
const router = express.Router();

router.post('/search',validate(userSearchSchema),searchUser);
router.post('/get-profile',validate(userGetProfileSchema),getProfile);

export default router;