const Notification = require('../models/Notification');
const AppError = require('../utils/AppError');

exports.getNotifications = async (user) => {
  const query = user.role === 'admin' ? { recipient: null } : { recipient: user.id };

  const [notifications, unreadCount] = await Promise.all([
    Notification.find(query).sort({ createdAt: -1 }).limit(50),
    Notification.countDocuments({ ...query, isRead: false }),
  ]);

  return { notifications, unreadCount };
};

exports.markAsRead = async (id) => {
  const notification = await Notification.findByIdAndUpdate(
    id,
    { isRead: true },
    { new: true, runValidators: true }
  );

  if (!notification) {
    throw new AppError('Notification not found', 404);
  }

  return notification;
};

exports.markAllAsRead = async (user) => {
  const query = user.role === 'admin' ? { recipient: null } : { recipient: user.id };
  await Notification.updateMany({ ...query, isRead: false }, { isRead: true });
  return { message: 'All notifications marked as read' };
};
