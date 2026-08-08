const nodemailer = require('nodemailer');

// Initialize Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

exports.sendEmail = async (to, subject, text) => {
  try {
    if (!process.env.SMTP_USER) {
      console.warn('⚠️ SMTP_USER not configured. Skipping real email sent to:', to);
      console.log(`📧 Email Body: ${text}`);
      return;
    }
    await transporter.sendMail({
      from: `"Dr. Kavita Ayurveda" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
    });
    console.log('✅ Email sent to', to);
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
  }
};

exports.sendSMS = async (mobile, message) => {
  try {
    const msg91AuthKey = process.env.MSG91_AUTH_KEY;
    if (!msg91AuthKey) {
       console.warn('⚠️ MSG91_AUTH_KEY not configured. Skipping real SMS to:', mobile);
       console.log(`📱 SMS Body: ${message}`);
       return;
    }
    
    // Format mobile
    let formattedMobile = mobile.replace(/\D/g, '');
    if (formattedMobile.length === 10) {
      formattedMobile = '91' + formattedMobile;
    }

    // In India, sending custom text via MSG91 requires DLT template ID. 
    // For development, we log it to console so you can see exactly what would be sent.
    console.log(`\n========================================`);
    console.log(`📱 MOCK MSG91 SMS SENT`);
    console.log(`To: ${formattedMobile}`);
    console.log(`Message: ${message}`);
    console.log(`========================================\n`);

  } catch (error) {
    console.error('❌ Failed to send SMS:', error.message);
  }
};

exports.notifyPatient = async (appointment, type) => {
  try {
    let subject = '';
    let message = '';
    
    const dateStr = new Date(appointment.date).toLocaleDateString('en-IN');
    
    switch (type) {
      case 'confirmed':
        subject = 'Appointment Confirmed - Dr. Kavita Ayurveda';
        message = `Aapka appointment Dr. Kavita ke saath ${dateStr} ${appointment.timeSlot} pe confirm ho gaya hai.`;
        if (appointment.paymentLink) {
          message += ` Payment ke liye click karein: ${appointment.paymentLink}`;
        }
        break;
      case 'cancelled':
        subject = 'Appointment Cancelled - Dr. Kavita Ayurveda';
        message = `Aapka appointment jo ${dateStr} ko tha, wo cancel kar diya gaya hai. Assuvidha ke liye khed hai.`;
        break;
      case 'reminder':
        subject = 'Appointment Reminder - Dr. Kavita Ayurveda';
        message = `Reminder: Kal ${dateStr} ${appointment.timeSlot} pe Dr. Kavita ke saath aapka appointment hai.`;
        break;
      case 'followup':
        subject = 'Follow-up Session Scheduled - Dr. Kavita Ayurveda';
        const followUpDateStr = new Date(appointment.followUpDate).toLocaleDateString('en-IN');
        message = `Aapka agla session ${followUpDateStr} ko hai.`;
        break;
      default:
        return;
    }
    
    // Send SMS
    if (appointment.mobile) {
      await exports.sendSMS(appointment.mobile, message);
    }
    
    // Send Email
    if (appointment.email) {
      await exports.sendEmail(appointment.email, subject, message);
    }
  } catch (error) {
    console.error('❌ Notification failed (but execution continues):', error.message);
  }
};
