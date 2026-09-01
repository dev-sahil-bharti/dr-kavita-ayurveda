const Inquiry = require('../models/Inquiry');
const Notification = require('../models/Notification');
const AppError = require('../utils/AppError');

exports.createInquiry = async (data) => {
  const { name, email, mobile, subject, message } = data;

  const inquiry = await Inquiry.create({
    name,
    email,
    mobile,
    subject,
    message,
  });

  await Notification.create({
    title: 'New Inquiry Received',
    message: `${name} submitted a new inquiry: ${subject}`,
    type: 'inquiry',
    relatedId: inquiry._id,
    onModel: 'Inquiry',
  });

  return inquiry;
};

exports.getInquiries = async (query = {}) => {
  const { status, search } = query;
  const filter = {};
  if (status && status !== 'all') {
    filter.status = status;
  }
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { mobile: { $regex: search, $options: 'i' } },
      { subject: { $regex: search, $options: 'i' } },
    ];
  }

  return await Inquiry.find(filter).sort({ createdAt: -1 });
};

exports.updateInquiryStatus = async (id, status) => {
  if (!['pending', 'resolved'].includes(status)) {
    throw new AppError('Invalid status', 400);
  }

  const inquiry = await Inquiry.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  );

  if (!inquiry) {
    throw new AppError('Inquiry not found', 404);
  }

  return inquiry;
};

exports.deleteInquiry = async (id) => {
  const inquiry = await Inquiry.findById(id);
  if (!inquiry) {
    throw new AppError('Inquiry not found', 404);
  }
  await inquiry.deleteOne();
  return {};
};
