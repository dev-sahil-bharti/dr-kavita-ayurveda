const nodemailer = require('nodemailer');
const https = require('https');
const Admin = require('../models/Admin');

const emailUser = process.env.SMTP_USER || process.env.EMAIL_USER;
const emailPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

// Initialize Nodemailer transporter with Gmail / custom SMTP support and strict timeouts
const transporter = nodemailer.createTransport({
  service: (process.env.SMTP_HOST && process.env.SMTP_HOST.includes('gmail')) || (!process.env.SMTP_HOST && emailUser?.includes('gmail')) ? 'gmail' : undefined,
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  connectionTimeout: 6000,
  greetingTimeout: 6000,
  socketTimeout: 8000,
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

/**
 * Send Email with optional HTML template and attachments
 */
exports.sendEmail = async (to, subject, text, attachments = [], html = null) => {
  try {
    if (!emailUser || !emailPass || emailUser.includes('placeholder')) {
      console.warn('⚠️ SMTP/EMAIL_USER not fully configured in .env. Skipping real email to:', to);
      console.log(`📧 [MOCK EMAIL] To: ${to} | Subject: ${subject}\nBody: ${text}`);
      return;
    }

    await transporter.sendMail({
      from: `"Dr. Kavita Ayurveda" <${emailUser}>`,
      to,
      subject,
      text,
      html: html || undefined,
      attachments,
    });
    console.log(`✅ Real Email delivered to: ${to}`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error.message);
  }
};

/**
 * Send SMS via MSG91 v5 Endpoint
 */
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
          timeout: 6000,
        },
        (response) => {
          let data = '';
          response.on('data', (chunk) => (data += chunk));
          response.on('end', () => {
            console.log(`📱 MSG91 SMS Dispatch to ${formattedMobile}. Response status: ${response.statusCode}`);
            resolve();
          });
        }
      );

      request.on('timeout', () => {
        request.destroy();
        console.warn(`⚠️ MSG91 SMS dispatch timed out for ${formattedMobile}`);
        resolve();
      });

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

/**
 * Generate Branded Responsive HTML Template for Patient Emails
 */
const generateAppointmentEmailHtml = (appointment, type) => {
  const patientName = appointment.patientName || appointment.patient?.name || 'Valued Patient';
  const dateStr = new Date(appointment.date).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const timeSlot = appointment.timeSlot || 'Scheduled Time';
  const service = appointment.preferredService || appointment.therapy || 'Ayurvedic Consultation';
  const consultationType = appointment.consultationType || 'In-person';

  let statusBadgeColor = '#0f3c35';
  let statusTitle = 'Appointment Update';
  let messageBody = '';

  switch (type) {
    case 'requested':
      statusTitle = 'Appointment Request Received';
      statusBadgeColor = '#b48608';
      messageBody = `Thank you for booking with Dr. Kavita Ayurveda. Your appointment request has been received and is currently under review. We will notify you once confirmed.`;
      break;
    case 'confirmed':
      statusTitle = 'Appointment Confirmed';
      statusBadgeColor = '#15803d';
      messageBody = `Great news! Your appointment has been confirmed. Dr. Kavita looks forward to seeing you.`;
      break;
    case 'rescheduled':
      statusTitle = 'Appointment Rescheduled';
      statusBadgeColor = '#0284c7';
      messageBody = `Your appointment has been rescheduled. Please review the updated date and time below.`;
      break;
    case 'cancelled':
      statusTitle = 'Appointment Cancelled';
      statusBadgeColor = '#e11d48';
      messageBody = `Your appointment for <strong>${dateStr}</strong> has been cancelled. If you wish to re-book or have any queries, please reach out to us.`;
      break;
    case 'reminder':
      statusTitle = 'Appointment Reminder';
      statusBadgeColor = '#0f3c35';
      messageBody = `This is a friendly reminder for your scheduled appointment with Dr. Kavita Ayurveda tomorrow.`;
      break;
    case 'followup':
      statusTitle = 'Follow-up Session Scheduled';
      statusBadgeColor = '#7c3aed';
      const followUpDateStr = appointment.followUpDate ? new Date(appointment.followUpDate).toLocaleDateString('en-IN') : 'Upcoming';
      messageBody = `Your follow-up therapy session has been scheduled for <strong>${followUpDateStr}</strong>.`;
      break;
    default:
      messageBody = `Your appointment status has been updated.`;
  }

  return `
    <div style="font-family: Arial, sans-serif; background-color: #f9f6f0; padding: 24px; color: #1a2421; margin: 0;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        
        <!-- Header -->
        <div style="background-color: #0f3c35; padding: 24px; text-align: center; border-bottom: 4px solid #b48608;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: bold; letter-spacing: 0.5px;">Dr. Kavita Ayurveda</h1>
          <p style="color: #cbd5e1; margin: 4px 0 0 0; font-size: 13px;">Holistic Healing & Personalized Healthcare</p>
        </div>

        <!-- Body Content -->
        <div style="padding: 28px 24px;">
          <div style="display: inline-block; background-color: ${statusBadgeColor}; color: #ffffff; font-size: 11px; font-weight: bold; padding: 4px 12px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px;">
            ${statusTitle}
          </div>

          <h2 style="font-size: 18px; color: #0f3c35; margin: 0 0 10px 0;">Hello ${patientName},</h2>
          <p style="font-size: 14px; line-height: 1.6; color: #4a5568; margin: 0 0 20px 0;">${messageBody}</p>

          <!-- Appointment Summary Table -->
          <table style="width: 100%; border-collapse: collapse; background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 24px;">
            <tr>
              <td style="padding: 10px 14px; font-size: 13px; color: #64748b; font-weight: bold; width: 35%; border-bottom: 1px solid #e2e8f0;">Service / Therapy:</td>
              <td style="padding: 10px 14px; font-size: 13px; color: #0f3c35; font-weight: bold; border-bottom: 1px solid #e2e8f0;">${service}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; font-size: 13px; color: #64748b; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Date:</td>
              <td style="padding: 10px 14px; font-size: 13px; color: #1e293b; border-bottom: 1px solid #e2e8f0;">${dateStr}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; font-size: 13px; color: #64748b; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Time Slot:</td>
              <td style="padding: 10px 14px; font-size: 13px; color: #1e293b; border-bottom: 1px solid #e2e8f0;">${timeSlot}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; font-size: 13px; color: #64748b; font-weight: bold;">Consultation:</td>
              <td style="padding: 10px 14px; font-size: 13px; color: #1e293b;">${consultationType}</td>
            </tr>
          </table>

          ${appointment.paymentLink ? `
            <div style="text-align: center; margin: 24px 0;">
              <a href="${appointment.paymentLink}" style="background-color: #b48608; color: #ffffff; padding: 12px 28px; border-radius: 8px; font-size: 14px; font-weight: bold; text-decoration: none; display: inline-block;">
                Complete Payment Online
              </a>
            </div>
          ` : ''}

          <!-- Footer Contact Info -->
          <div style="font-size: 12px; color: #94a3b8; line-height: 1.5; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
            <p style="margin: 0 0 4px 0;">Need assistance or have questions?</p>
            <p style="margin: 0;">Call: <a href="tel:+919370466953" style="color: #0f3c35; font-weight: bold; text-decoration: none;">+91-9370466953</a> | Email: <a href="mailto:info@drkavitaayurveda.com" style="color: #0f3c35; font-weight: bold; text-decoration: none;">info@drkavitaayurveda.com</a></p>
          </div>
        </div>
      </div>
    </div>
  `;
};

/**
 * Main Notification Dispatcher for Patients
 */
exports.notifyPatient = async (appointment, type) => {
  try {
    let subject = '';
    let smsMessage = '';

    const dateStr = new Date(appointment.date).toLocaleDateString('en-IN');
    const service = appointment.preferredService || appointment.therapy || 'Consultation';

    switch (type) {
      case 'requested':
        subject = 'Appointment Request Received - Dr. Kavita Ayurveda';
        smsMessage = `Aapka appointment request ${dateStr} ${appointment.timeSlot} (${service}) ke liye receive ho gaya hai. Dr. Kavita Ayurveda`;
        break;
      case 'confirmed':
        subject = 'Appointment Confirmed - Dr. Kavita Ayurveda';
        smsMessage = `Aapka appointment Dr. Kavita ke saath ${dateStr} ${appointment.timeSlot} pe confirm ho gaya hai.`;
        if (appointment.paymentLink) {
          smsMessage += ` Payment link: ${appointment.paymentLink}`;
        }
        break;
      case 'cancelled':
        subject = 'Appointment Cancelled - Dr. Kavita Ayurveda';
        smsMessage = `Aapka appointment jo ${dateStr} ko tha, wo cancel ho gaya hai. Info: +91-9370466953 - Dr. Kavita Ayurveda`;
        break;
      case 'rescheduled':
        subject = 'Appointment Rescheduled - Dr. Kavita Ayurveda';
        smsMessage = `Aapka appointment reschedule ho gaya hai. Naya samay: ${dateStr} ${appointment.timeSlot}. - Dr. Kavita Ayurveda`;
        break;
      case 'reminder':
        subject = 'Appointment Reminder - Dr. Kavita Ayurveda';
        smsMessage = `Reminder: Kal ${dateStr} ${appointment.timeSlot} pe Dr. Kavita ke saath aapka appointment hai.`;
        break;
      case 'followup':
        subject = 'Follow-up Session Scheduled - Dr. Kavita Ayurveda';
        const followUpDateStr = new Date(appointment.followUpDate).toLocaleDateString('en-IN');
        smsMessage = `Aapka agla therapy session ${followUpDateStr} ko schedule kiya gaya hai. - Dr. Kavita Ayurveda`;
        break;
      default:
        return;
    }

    // Resolves contact from appointment or populated patient model
    const mobileNumber = appointment.mobile || (appointment.patient && appointment.patient.mobile);
    const emailAddress = appointment.email || (appointment.patient && appointment.patient.email);

    if (mobileNumber) {
      await exports.sendSMS(mobileNumber, smsMessage);
    }

    if (emailAddress) {
      const htmlContent = generateAppointmentEmailHtml(appointment, type);
      await exports.sendEmail(emailAddress, subject, smsMessage, [], htmlContent);
    }
  } catch (error) {
    console.error('❌ Patient Notification failed (execution continues):', error.message);
  }
};

/**
 * Main Notification Dispatcher for Admins
 */
exports.notifyAdmin = async (appointment, type) => {
  try {
    const dateStr = new Date(appointment.date).toLocaleDateString('en-IN');
    const subject = 'New Appointment Request - Dr. Kavita Ayurveda';
    const message = `New appointment requested by ${appointment.patientName} for ${appointment.preferredService} on ${dateStr} at ${appointment.timeSlot}.`;

    const admins = await Admin.find();

    for (const admin of admins) {
      if (admin.mobileNo) {
        exports.sendSMS(admin.mobileNo, message).catch((err) =>
          console.error(`Failed to send SMS to admin ${admin.mobileNo}:`, err.message)
        );
      }
      if (admin.email) {
        exports.sendEmail(admin.email, subject, message).catch((err) =>
          console.error(`Failed to send Email to admin ${admin.email}:`, err.message)
        );
      }
    }
  } catch (error) {
    console.error('❌ Admin Notification failed:', error.message);
  }
};

/**
 * Dedicated Admin Email Notification for Patient Cancellation
 */
exports.notifyAdminAppointmentCancelled = async (appointment) => {
  try {
    const patientName = appointment.patientName || appointment.patient?.name || 'Patient';
    const patientMobile = appointment.mobile || appointment.patient?.mobile || 'Not provided';
    const patientEmail = appointment.email || appointment.patient?.email || 'Not provided';
    const dateStr = new Date(appointment.date).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const timeSlot = appointment.timeSlot || 'Standard Timing';
    const consultationType = appointment.consultationType || 'In-person';
    const preferredService = appointment.preferredService || appointment.therapy || 'Ayurvedic Consultation';

    const reason = appointment.cancellation?.reason || appointment.cancelReason || 'Reason not specified';
    const note = appointment.cancellation?.note || 'None';
    const cancelledBy = appointment.cancellation?.cancelledBy || 'Patient';
    const cancelledAtStr = appointment.cancellation?.cancelledAt
      ? new Date(appointment.cancellation.cancelledAt).toLocaleString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      : new Date().toLocaleString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });

    const subject = 'Patient Appointment Cancelled - Dr. Kavita Ayurveda';

    const plainText = `
Patient Appointment Cancelled

Appointment Details:
Patient Name: ${patientName}
Patient Mobile: ${patientMobile}
Patient Email: ${patientEmail}
Appointment Date: ${dateStr}
Appointment Time: ${timeSlot}
Consultation Type: ${consultationType}
Preferred Service: ${preferredService}

Cancellation Details:
Cancellation Reason: ${reason}
Additional Note: ${note}
Cancelled By: ${cancelledBy}
Cancelled At: ${cancelledAtStr}
    `.trim();

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; background-color: #f9f6f0; padding: 24px; color: #1a2421; margin: 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          
          <div style="background-color: #0f3c35; padding: 20px 24px; border-bottom: 4px solid #e11d48; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: bold;">Dr. Kavita Ayurveda - Admin Alert</h1>
            <p style="color: #fecdd3; margin: 4px 0 0 0; font-size: 13px; font-weight: bold;">Patient Appointment Cancelled</p>
          </div>

          <div style="padding: 24px;">
            <div style="display: inline-block; background-color: #ffe4e6; color: #be123c; font-size: 11px; font-weight: bold; padding: 4px 12px; border-radius: 9999px; text-transform: uppercase; margin-bottom: 16px;">
              Cancelled by Patient
            </div>

            <h2 style="font-size: 16px; color: #0f3c35; margin: 0 0 12px 0;">Appointment Cancellation Report</h2>
            <p style="font-size: 13px; color: #475569; margin: 0 0 16px 0;">An existing appointment has been cancelled by the patient from their portal. The slot is now released.</p>

            <h3 style="font-size: 13px; font-weight: bold; color: #0f3c35; text-transform: uppercase; letter-spacing: 0.5px; margin: 16px 0 8px 0;">Appointment Details</h3>
            <table style="width: 100%; border-collapse: collapse; background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 16px;">
              <tr><td style="padding: 8px 12px; font-size: 12px; color: #64748b; font-weight: bold; width: 40%; border-bottom: 1px solid #e2e8f0;">Patient Name:</td><td style="padding: 8px 12px; font-size: 12px; color: #0f3c35; font-weight: bold; border-bottom: 1px solid #e2e8f0;">${patientName}</td></tr>
              <tr><td style="padding: 8px 12px; font-size: 12px; color: #64748b; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Patient Mobile:</td><td style="padding: 8px 12px; font-size: 12px; color: #1e293b; border-bottom: 1px solid #e2e8f0;">${patientMobile}</td></tr>
              <tr><td style="padding: 8px 12px; font-size: 12px; color: #64748b; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Patient Email:</td><td style="padding: 8px 12px; font-size: 12px; color: #1e293b; border-bottom: 1px solid #e2e8f0;">${patientEmail}</td></tr>
              <tr><td style="padding: 8px 12px; font-size: 12px; color: #64748b; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Appointment Date:</td><td style="padding: 8px 12px; font-size: 12px; color: #1e293b; border-bottom: 1px solid #e2e8f0;">${dateStr}</td></tr>
              <tr><td style="padding: 8px 12px; font-size: 12px; color: #64748b; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Appointment Time:</td><td style="padding: 8px 12px; font-size: 12px; color: #1e293b; border-bottom: 1px solid #e2e8f0;">${timeSlot}</td></tr>
              <tr><td style="padding: 8px 12px; font-size: 12px; color: #64748b; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Consultation Type:</td><td style="padding: 8px 12px; font-size: 12px; color: #1e293b; border-bottom: 1px solid #e2e8f0;">${consultationType}</td></tr>
              <tr><td style="padding: 8px 12px; font-size: 12px; color: #64748b; font-weight: bold;">Preferred Service:</td><td style="padding: 8px 12px; font-size: 12px; color: #0f3c35; font-weight: bold;">${preferredService}</td></tr>
            </table>

            <h3 style="font-size: 13px; font-weight: bold; color: #be123c; text-transform: uppercase; letter-spacing: 0.5px; margin: 16px 0 8px 0;">Cancellation Details</h3>
            <table style="width: 100%; border-collapse: collapse; background-color: #fff1f2; border-radius: 8px; border: 1px solid #fecdd3;">
              <tr><td style="padding: 8px 12px; font-size: 12px; color: #9f1239; font-weight: bold; width: 40%; border-bottom: 1px solid #fecdd3;">Cancellation Reason:</td><td style="padding: 8px 12px; font-size: 12px; color: #be123c; font-weight: bold; border-bottom: 1px solid #fecdd3;">${reason}</td></tr>
              <tr><td style="padding: 8px 12px; font-size: 12px; color: #9f1239; font-weight: bold; border-bottom: 1px solid #fecdd3;">Additional Note:</td><td style="padding: 8px 12px; font-size: 12px; color: #475569; border-bottom: 1px solid #fecdd3;">${note}</td></tr>
              <tr><td style="padding: 8px 12px; font-size: 12px; color: #9f1239; font-weight: bold; border-bottom: 1px solid #fecdd3;">Cancelled By:</td><td style="padding: 8px 12px; font-size: 12px; color: #1e293b; font-weight: bold; border-bottom: 1px solid #fecdd3;">${cancelledBy}</td></tr>
              <tr><td style="padding: 8px 12px; font-size: 12px; color: #9f1239; font-weight: bold;">Cancelled At:</td><td style="padding: 8px 12px; font-size: 12px; color: #1e293b;">${cancelledAtStr}</td></tr>
            </table>

            <div style="font-size: 11px; color: #94a3b8; margin-top: 20px; border-top: 1px solid #e2e8f0; padding-top: 12px; text-align: center;">
              Dr. Kavita Ayurveda Clinic Management System
            </div>
          </div>
        </div>
      </div>
    `;

    // Send to process.env.ADMIN_EMAIL if configured
    const adminEnvEmail = process.env.ADMIN_EMAIL;
    if (adminEnvEmail && adminEnvEmail !== emailUser) {
      exports.sendEmail(adminEnvEmail, subject, plainText, [], htmlContent).catch((err) =>
        console.error(`Failed to send cancellation email to ADMIN_EMAIL (${adminEnvEmail}):`, err.message)
      );
    }

    // Send to all registered Admin users in database
    const admins = await Admin.find();
    for (const admin of admins) {
      if (admin.email) {
        exports.sendEmail(admin.email, subject, plainText, [], htmlContent).catch((err) =>
          console.error(`Failed to send cancellation email to admin (${admin.email}):`, err.message)
        );
      }
    }
  } catch (error) {
    console.error('❌ Admin Cancellation Email notification failed (safe fallback):', error.message);
  }
};

