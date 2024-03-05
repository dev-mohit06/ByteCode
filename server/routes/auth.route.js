import {Router} from 'express';
const router = Router();

import validate from '../middlewares/zod.middleware.js';
import { signupSchema, signinSchema } from '../middlewares/validation-schemas/auth.validation-schema.js';
import { signup,signin } from '../controllers/auth.controller.js';

router.post('/signup',validate(signupSchema),signup);
router.post('/signin',validate(signinSchema),signin)

export default router;