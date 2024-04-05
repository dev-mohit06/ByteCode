import express from 'express';
const router = express.Router();
import verifyJwtToken from '../middlewares/jwt.middleware.js';
import { getAllNotificationsCount, getNewNotifications, getNotifications } from '../controllers/notification.controller.js';
import validate from '../middlewares/zod.middleware.js';
import {getNotificationsSchema} from '../middlewares/validation-schemas/notifications.validation-schema.js';

router.post('/',verifyJwtToken,validate(getNotificationsSchema),getNotifications);
router.get('/new-notifications',verifyJwtToken,getNewNotifications);
router.post("/all-notifications-count",verifyJwtToken,validate(getNotificationsSchema),getAllNotificationsCount);

export default router;