import {Router} from 'express';
const router = Router();

import validate from '../middlewares/zod.middleware.js';
import { signupSchema, signinSchema,googleAuthSchema } from '../middlewares/validation-schemas/auth.validation-schema.js';
import { signup,signin,googleAuth } from '../controllers/auth.controller.js';

router.post('/signup',validate(signupSchema),signup);
router.post('/signin',validate(signinSchema),signin)
router.post('/google-auth',validate(googleAuthSchema),googleAuth);

export default router;