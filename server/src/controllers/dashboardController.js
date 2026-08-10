const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');

exports.getDashboardStats = async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [
      totalPatients,
      totalAppointments,
      pendingAppointments,
      appointmentsToday,
      recentAppointments
    ] = await Promise.all([
      Patient.countDocuments(),
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: 'pending' }),
      Appointment.countDocuments({
        date: { $gte: todayStart, $lte: todayEnd }
      }),
      Appointment.find().sort({ createdAt: -1 }).limit(3).populate('patient', 'name')
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalPatients,
        totalAppointments,
        pendingAppointments,
        appointmentsToday,
        recentAppointments
      }
    });
  } catch (error) {
    console.error('Error in getDashboardStats:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
