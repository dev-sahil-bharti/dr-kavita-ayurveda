const Inquiry = require('../models/Inquiry');
const Notification = require('../models/Notification');
const AppError = require('../utils/AppError');

// @desc    Create a new inquiry
// @route   POST /api/inquiries
// @access  Public
exports.createInquiry = async (req, res, next) => {
  try {
    const { name, email, mobile, subject, message } = req.body;

    // The Mongoose model handles the required validation
    const inquiry = await Inquiry.create({
      name,
      email,
      mobile,
      subject,
      message
    });

    // Create Notification
    await Notification.create({
      title: 'New Inquiry Received',
      message: `${name} submitted a new inquiry: ${subject}`,
      type: 'inquiry',
      relatedId: inquiry._id,
      onModel: 'Inquiry'
    });

    res.status(201).json({
      success: true,
      data: inquiry
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all inquiries
// @route   GET /api/inquiries
// @access  Private/Admin
exports.getInquiries = async (req, res, next) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update inquiry status
// @route   PATCH /api/inquiries/:id/status
// @access  Private/Admin
exports.updateInquiryStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'resolved'].includes(status)) {
      return next(new AppError('Invalid status', 400));
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!inquiry) {
      return next(new AppError('Inquiry not found', 404));
    }

    res.status(200).json({
      success: true,
      data: inquiry
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an inquiry
// @route   DELETE /api/inquiries/:id
// @access  Private/Admin
exports.deleteInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return next(new AppError('Inquiry not found', 404));
    }

    await inquiry.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
