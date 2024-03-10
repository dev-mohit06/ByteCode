import {Router} from 'express';
const router = Router();
import authRoutes from './auth.route.js';
import storageRoutes from './s3.route.js';
import blogRoutes from './blog.route.js';
import verifyJwtToken from '../middlewares/jwt.middleware.js';

router.use('/auth',authRoutes);
router.use('/storage',verifyJwtToken,storageRoutes);
router.use('/blog',blogRoutes);
export default router;