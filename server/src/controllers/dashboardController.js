const dashboardService = require('../services/dashboardService');
const catchAsync = require('../utils/catchAsync');

exports.getDashboardStats = catchAsync(async (req, res) => {
  const stats = await dashboardService.getDashboardStats();
  res.status(200).json({
    success: true,
    data: stats,
  });
});
