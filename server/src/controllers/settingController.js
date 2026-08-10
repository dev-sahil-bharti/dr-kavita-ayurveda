const Setting = require('../models/Setting');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// Get Settings
exports.getSettings = catchAsync(async (req, res, next) => {
  let settings = await Setting.findOne();
  
  if (!settings) {
    // Create default settings if none exist
    settings = await Setting.create({});
  }

  res.status(200).json({
    status: 'success',
    data: settings
  });
});

// Update Settings
exports.updateSettings = catchAsync(async (req, res, next) => {
  let settings = await Setting.findOne();
  
  if (!settings) {
    settings = await Setting.create(req.body);
  } else {
    // Only update fields that are provided
    settings = await Setting.findOneAndUpdate({}, req.body, {
      new: true,
      runValidators: true
    });
  }

  res.status(200).json({
    status: 'success',
    data: settings
  });
});
