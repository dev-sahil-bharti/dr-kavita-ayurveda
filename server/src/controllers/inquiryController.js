const inquiryService = require('../services/inquiryService');
const catchAsync = require('../utils/catchAsync');

exports.createInquiry = catchAsync(async (req, res) => {
  const inquiry = await inquiryService.createInquiry(req.body);
  res.status(201).json({
    success: true,
    data: inquiry,
  });
});

exports.getInquiries = catchAsync(async (req, res) => {
  const inquiries = await inquiryService.getInquiries(req.query);
  res.status(200).json({
    success: true,
    count: inquiries.length,
    data: inquiries,
  });
});

exports.updateInquiryStatus = catchAsync(async (req, res) => {
  const inquiry = await inquiryService.updateInquiryStatus(req.params.id, req.body.status);
  res.status(200).json({
    success: true,
    data: inquiry,
  });
});

exports.deleteInquiry = catchAsync(async (req, res) => {
  const result = await inquiryService.deleteInquiry(req.params.id);
  res.status(200).json({
    success: true,
    data: result,
  });
});
