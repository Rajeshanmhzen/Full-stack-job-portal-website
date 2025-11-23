import Notification from "../../models/notification.model.js"

export const createNotification= async(userId, message)=> {
    await Notification.create({user:userId, message})
};
export const getNotifications = async(req,res)=> {
    try {
        const notifications = await Notification.find({user:req.id}).sort({createdAt:-1})
        res.json({success:true, notifications});
    } catch (err) {
        console.log( "Error from Notification",err.message)
        res.status(500).json({success:false, message:err.message})
    }
};
export const markAsRead = async(req,res)=> {
    try {
        await Notification.updateMany({user:req.id}, {isRead:true})
        res.json({success:true, message:"All notifications marked as read"});
    } catch (err) {
        console.log( "Error marking notifications as read",err.message)
        res.status(500).json({success:false, message:err.message})
    }
};

export const markSingleAsRead = async(req,res)=> {
    try {
        const {id} = req.params;
        await Notification.findByIdAndUpdate(id, {isRead:true})
        res.json({success:true, message:"Notification marked as read"});
    } catch (err) {
        console.log( "Error marking notification as read",err.message)
        res.status(500).json({success:false, message:err.message})
    }
};