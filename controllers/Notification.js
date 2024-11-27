const { Sequelize } = require('sequelize');
const Notification = require('../models/Notification');
// const Call = require('../models/callModel');
const asyncHandler = require('express-async-handler');

exports.userNotification = asyncHandler(async (req, res, next) => {
    
    console.log(req.user)
    const notifications = await Notification.findAll({ where: { userId: req.user.id } });
    
    if (notifications && notifications.length > 0) {
        return res.status(200).json({ notifications: notifications });
    }
    return res.status(404).json({ notifications: "current user doesn't have notifcation yet ." });
});
// exports.markRead = asyncHandler(async (req, res, next) => {
//    const notification =  await Notification.findAll({ where: { id: req.params.id } });
//    res.status(200).json({ message: 'Notification marked as read' });
// });
exports.markRead = asyncHandler(async (req, res, next) => {
    console.log(req.params.id )
    console.log(req.user.id )
    const notification = await Notification.findOne({
        where: {
            id: req.params.id,
            userId: req.user.id // Ensure the notification belongs to the specific user
        }
    });
console.log(notification)
    // If notification not found, return 404
    if (!notification) {
        return res.status(404).json({ message: 'Notification not found for the user' });
    }

    // Mark the notification as read (assuming you update `isRead` column)
    await notification.update({ isRead: true });

    res.status(200).json({ message: 'Notification marked as read' });
});
// exports.userLogs = asyncHandler(async (req, res, next) => {
    
//     console.log(req.user)
//     const callLogs = await Call.findAll({
//         where: {
//             [Sequelize.Op.or]: [
//                 { callerID: req.user.id },
//                 { lawyerID: req.user.id }
//             ]
//         },
//         order: [['startTime', 'DESC']]
//     });
    
//     if (callLogs && callLogs.length > 0) {
//         return res.status(200).json({ callLogs: callLogs });
//     }
//     return res.status(404).json({ callLogs: "current user doesn't have call logs yet ." });

// });

