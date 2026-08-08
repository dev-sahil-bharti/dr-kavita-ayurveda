const Notification = require('../models/Notification');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// @desc    Get all notifications
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = catchAsync(async (req, res, next) => {
  const query = req.user.role === 'admin' ? { recipient: null } : { recipient: req.user.id };
  
  const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(50);
  const unreadCount = await Notification.countDocuments({ ...query, isRead: false });

  res.status(200).json({
    status: 'success',
    unreadCount,
    data: notifications
  });
});

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private/Admin
exports.markAsRead = catchAsync(async (req, res, next) => {
  const notification = await Notification.findByIdAndUpdate(
    req.params.id,
    { isRead: true },
    { new: true, runValidators: true }
  );

  if (!notification) {
    return next(new AppError('Notification not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: notification
  });
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
exports.markAllAsRead = catchAsync(async (req, res, next) => {
  const query = req.user.role === 'admin' ? { recipient: null } : { recipient: req.user.id };
  await Notification.updateMany({ ...query, isRead: false }, { isRead: true });

  res.status(200).json({
    status: 'success',
    message: 'All notifications marked as read'
  });
});
