const settingService = require('../services/settingService');
const catchAsync = require('../utils/catchAsync');

exports.getSettings = catchAsync(async (req, res) => {
  const settings = await settingService.getSettings();
  res.status(200).json({
    status: 'success',
    data: settings,
  });
});

exports.updateSettings = catchAsync(async (req, res) => {
  const settings = await settingService.updateSettings(req.body);
  res.status(200).json({
    status: 'success',
    data: settings,
  });
});
