const nodemailer = require('nodemailer');
const https = require('https');
const Admin = require('../models/Admin');

const emailUser = process.env.SMTP_USER || process.env.EMAIL_USER;
const emailPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

// Initialize Nodemailer transporter with Gmail / custom SMTP support
const transporter = nodemailer.createTransport({
  service: (process.env.SMTP_HOST && process.env.SMTP_HOST.includes('gmail')) || (!process.env.SMTP_HOST && emailUser?.includes('gmail')) ? 'gmail' : undefined,
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

exports.sendEmail = async (to, subject, text, attachments = []) => {
  try {
    if (!emailUser || !emailPass || emailUser.includes('placeholder')) {
      console.warn('⚠️ SMTP/EMAIL_USER not fully configured in .env. Skipping real email sent to:', to);
      console.log(`📧 [MOCK EMAIL] To: ${to} | Subject: ${subject}\nBody: ${text}`);
      return;
    }

    await transporter.sendMail({
      from: `"Dr. Kavita Ayurveda" <${emailUser}>`,
      to,
      subject,
      text,
      attachments,
    });
    console.log(`✅ Real Email delivered to: ${to}`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error.message);
  }
};

exports.sendSMS = async (mobile, message) => {
  try {
    const msg91AuthKey = process.env.MSG91_AUTH_KEY;
    if (!msg91AuthKey || msg91AuthKey.includes('placeholder')) {
      console.warn('⚠️ MSG91_AUTH_KEY not configured in .env. Skipping real SMS to:', mobile);
      console.log(`📱 [MOCK SMS] To: ${mobile}\nBody: ${message}`);
      return;
    }

    // Format mobile with 91 country code
    let formattedMobile = mobile.replace(/\D/g, '');
    if (formattedMobile.length === 10) {
      formattedMobile = '91' + formattedMobile;
    }

    const templateId = process.env.MSG91_OTP_TEMPLATE_ID;

    // Use MSG91 v5 OTP or SMS Endpoint
    const url = `https://control.msg91.com/api/v5/otp?template_id=${encodeURIComponent(templateId || '')}&mobile=${encodeURIComponent(formattedMobile)}&authkey=${encodeURIComponent(msg91AuthKey)}`;

    await new Promise((resolve) => {
      const request = https.request(
        url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authkey: msg91AuthKey,
          },
        },
        (response) => {
          let data = '';
          response.on('data', (chunk) => (data += chunk));
          response.on('end', () => {
            console.log(`📱 MSG91 SMS Dispatch to ${formattedMobile}. Response status: ${response.statusCode}, Body: ${data}`);
            resolve();
          });
        }
      );

      request.on('error', (err) => {
        console.error('❌ MSG91 SMS Request Error:', err.message);
        resolve();
      });

      request.end();
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
        message = `Aapka appointment jo ${dateStr} ko tha, wo cancel kar diya gaya hai.`;
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

    const mobileNumber = appointment.mobile || (appointment.patient && appointment.patient.mobile);
    const emailAddress = appointment.email || (appointment.patient && appointment.patient.email);

    if (mobileNumber) {
      await exports.sendSMS(mobileNumber, message);
    }

    if (emailAddress) {
      await exports.sendEmail(emailAddress, subject, message);
    }
  } catch (error) {
    console.error('❌ Notification failed (execution continues):', error.message);
  }
};

exports.notifyAdmin = async (appointment, type) => {
  try {
    const dateStr = new Date(appointment.date).toLocaleDateString('en-IN');
    const subject = 'New Appointment Request - Dr. Kavita Ayurveda';
    const message = `New appointment requested by ${appointment.patientName} for ${appointment.preferredService} on ${dateStr} at ${appointment.timeSlot}.`;

    const admins = await Admin.find();

    for (const admin of admins) {
      if (admin.mobileNo) {
        await exports.sendSMS(admin.mobileNo, message);
      }
      if (admin.email) {
        await exports.sendEmail(admin.email, subject, message);
      }
    }
  } catch (error) {
    console.error('❌ Admin Notification failed:', error.message);
  }
};
