const cron = require('node-cron');
const Appointment = require('../models/Appointment');
const { notifyPatient } = require('../utils/notify');

// Run every day at 8:00 AM (0 8 * * *)
const startReminderCron = () => {
  cron.schedule('0 8 * * *', async () => {
    console.log('⏰ Running daily appointment reminder cron job...');
    try {
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      
      const startOfTomorrow = new Date(tomorrow);
      startOfTomorrow.setHours(0, 0, 0, 0);
      
      const endOfTomorrow = new Date(tomorrow);
      endOfTomorrow.setHours(23, 59, 59, 999);

      // Find all confirmed appointments for tomorrow where reminder has not been sent
      const appointments = await Appointment.find({
        status: 'confirmed',
        date: { $gte: startOfTomorrow, $lte: endOfTomorrow },
        reminderSent: false
      }).populate('patient', 'name email mobile');

      console.log(`Found ${appointments.length} appointments for tomorrow requiring reminders.`);

      for (const app of appointments) {
        await notifyPatient(app, 'reminder');
        app.reminderSent = true;
        await app.save();
      }

      console.log('✅ Daily reminders completed.');
    } catch (error) {
      console.error('❌ Error in reminder cron job:', error.message);
    }
  });
};

module.exports = { startReminderCron };
