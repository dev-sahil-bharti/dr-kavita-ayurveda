const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');

exports.getDashboardStats = async () => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const [
    totalPatients,
    totalAppointments,
    pendingAppointments,
    appointmentsToday,
    recentAppointments,
  ] = await Promise.all([
    Patient.countDocuments(),
    Appointment.countDocuments(),
    Appointment.countDocuments({ status: 'pending' }),
    Appointment.countDocuments({
      date: { $gte: todayStart, $lte: todayEnd },
    }),
    Appointment.find().sort({ createdAt: -1 }).limit(5).populate('patient', 'name mobile'),
  ]);

  return {
    totalPatients,
    totalAppointments,
    pendingAppointments,
    appointmentsToday,
    recentAppointments,
  };
};
