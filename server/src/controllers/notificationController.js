const notificationService = require('../services/notificationService');
const catchAsync = require('../utils/catchAsync');

exports.getNotifications = catchAsync(async (req, res) => {
  const { notifications, unreadCount } = await notificationService.getNotifications(req.user);
  res.status(200).json({
    status: 'success',
    unreadCount,
    data: notifications,
  });
});

exports.markAsRead = catchAsync(async (req, res) => {
  const notification = await notificationService.markAsRead(req.params.id);
  res.status(200).json({
    status: 'success',
    data: notification,
  });
});

exports.markAllAsRead = catchAsync(async (req, res) => {
  const result = await notificationService.markAllAsRead(req.user);
  res.status(200).json({
    status: 'success',
    message: result.message,
  });
});
