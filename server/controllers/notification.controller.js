import {asyncWrapper} from '../utils/index.util.js';
import Notification from '../Schema/Notification.js';
import ApiResponse from '../utils/api.util.js';

export const getNewNotifications = asyncWrapper(async (req,res,next) => {
    let user_id = req.user.id;

    const notification = await Notification.exists({
        notification_for: user_id,
        seen: false,
        user : { $ne: user_id }
    });

    if(!notification) {
        return res.status(200).json(new ApiResponse(false,"No New Notifications",{
            new_notifications_available: false
        }))
    }

    return res.status(200).json(new ApiResponse(true,"New Notifications",{
        new_notifications_available: true
    }))
});

export const getNotifications = asyncWrapper(async (req,res,next) => {
    let user_id = req.user.id;

    let {page,filter,deleteDocCount} = req.body;

    let maxLimit = process.env.NOTIFICATION_PER_PAGE;

    let findQuery = {notification_for: user_id, user: {$ne: user_id}};

    let skipDocs = (page - 1) * maxLimit;

    if(filter != "all"){
        findQuery.type = filter;
    }

    if(deleteDocCount){
        skipDocs -= deleteDocCount;
    }


    let notifications = await Notification.find(findQuery)
    .skip(skipDocs)
    .limit(maxLimit)
    .populate('blog',"title blog_id")
    .populate('user',"personal_info.fullname personal_info.username personal_info.profile_img")
    .populate("comment","comment")
    .populate("replied_on_comment","comment")
    .populate("reply","comment")
    .sort({createdAt: -1})
    .select("createdAt type seen reply");

    return res.status(200).json(new ApiResponse(true,"Notifications",notifications));
});

export const getAllNotificationsCount = asyncWrapper(async (req,res,next) => {
    let user_id = req.user.id;

    let {filter} = req.body;

    let findQuery = {notification_for: user_id,user: {$ne: user_id}};

    if(filter != "all"){
        findQuery.type = filter;
    }

    let notificationCount = await Notification.countDocuments(findQuery);

    return res.status(200).json(new ApiResponse(true,"Notifications Count",{
        notification_count: notificationCount
    }));
});