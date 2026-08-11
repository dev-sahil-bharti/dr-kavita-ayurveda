const nodemailer = require('nodemailer');
const https = require('https');
const Admin = require('../models/Admin');

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
    // If not strict, this basic API sends the SMS.
    const url = `https://api.msg91.com/api/sendhttp.php?authkey=${msg91AuthKey}&mobiles=${formattedMobile}&message=${encodeURIComponent(message)}&sender=DRKAVI&route=4`;

    await new Promise((resolve, reject) => {
      https.get(url, (response) => {
        let data = '';
        response.on('data', chunk => data += chunk);
        response.on('end', () => {
          console.log(`📱 REAL SMS SENT to ${formattedMobile} via MSG91. Response: ${data}`);
          resolve();
        });
      }).on('error', (err) => {
        console.error('MSG91 Request Error:', err);
        resolve(); // Don't throw to avoid breaking the execution flow
      });
    });

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
      case 'requested':
        subject = 'Appointment Requested - Dr. Kavita Ayurveda';
        message = `Aapka appointment request ${dateStr} ${appointment.timeSlot} ke liye receive ho gaya hai. Hum jaldi hi confirm karenge.`;
        break;
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
      case 'rescheduled':
        subject = 'Appointment Rescheduled - Dr. Kavita Ayurveda';
        message = `Aapka appointment Dr. Kavita ke saath reschedule ho gaya hai. Naya samay: ${dateStr} ${appointment.timeSlot}.`;
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

exports.notifyAdmin = async (appointment, type) => {
  try {
    let subject = '';
    let message = '';
    
    const dateStr = new Date(appointment.date).toLocaleDateString('en-IN');
    
    switch (type) {
      case 'requested':
        subject = 'New Appointment Request - Dr. Kavita Ayurveda';
        message = `New appointment requested by ${appointment.patientName} for ${appointment.preferredService} on ${dateStr} at ${appointment.timeSlot}.`;
        break;
      default:
        return;
    }
    
    // Fetch all admins
    const admins = await Admin.find();
    
    for (const admin of admins) {
      // Send SMS
      if (admin.mobileNo) {
        await exports.sendSMS(admin.mobileNo, message);
      }
      
      // Send Email
      if (admin.email) {
        await exports.sendEmail(admin.email, subject, message);
      }
    }
  } catch (error) {
    console.error('❌ Admin Notification failed:', error.message);
  }
};
