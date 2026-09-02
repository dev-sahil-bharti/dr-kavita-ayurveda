const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { sendEmail, sendSMS } = require('./notify');

exports.sendReceipt = async (appointment) => {
  try {
    const patientName = appointment.patientName || 'Patient';
    const amount = appointment.amount || 0;
    const paymentMethod = appointment.paymentMethod || 'cash';
    const dateStr = new Date(appointment.date).toLocaleDateString('en-IN');
    const service = appointment.preferredService || appointment.therapy || 'Consultation';

    const mobileNumber = appointment.mobile || (appointment.patient && appointment.patient.mobile);
    const emailAddress = appointment.email || (appointment.patient && appointment.patient.email);

    // 1. Send SMS
    if (mobileNumber) {
      const smsMessage = `Dr. Kavita Ayurveda: Payment of Rs. ${amount} received for ${service} on ${dateStr} via ${paymentMethod}. Thank you.`;
      await sendSMS(mobileNumber, smsMessage);
    }

    // 2. Generate PDF & Send Email
    if (emailAddress) {
      const pdfBuffer = await new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });
        let buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          let pdfData = Buffer.concat(buffers);
          resolve(pdfData);
        });

        // PDF Content
        doc.fontSize(20).text('Dr. Kavita Ayurveda', { align: 'center' });
        doc.fontSize(12).text('Payment Receipt', { align: 'center' });
        doc.moveDown();
        doc.moveDown();

        doc.fontSize(14).text(`Receipt No: ${appointment._id}`);
        doc.text(`Date: ${dateStr}`);
        doc.moveDown();

        doc.text(`Patient Name: ${patientName}`);
        doc.text(`Service: ${service}`);
        doc.text(`Payment Method: ${paymentMethod.toUpperCase()}`);
        doc.moveDown();

        doc.fontSize(16).text(`Amount Paid: Rs. ${amount}`, { underline: true });

        doc.end();
      });

      // We need to modify sendEmail in notify.js to support attachments or just write a specific mailer here.
      // Since we don't want to break existing notify.js without testing, let's use transporter directly if needed,
      // but notify.js already exports sendEmail. Let's send an email first.
      
      const emailSubject = `Payment Receipt - Dr. Kavita Ayurveda`;
      const emailText = `Dear ${patientName},\n\nThank you for your payment of Rs. ${amount} for ${service} on ${dateStr} via ${paymentMethod}.\n\nPlease find your receipt attached.\n\nRegards,\nDr. Kavita Ayurveda`;

      // We'll update notify.js to accept attachments shortly. For now, assume it takes an optional 4th argument for attachments.
      await sendEmail(appointment.email, emailSubject, emailText, [
        {
          filename: `Receipt-${appointment._id}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]);
    }

    appointment.receiptSent = true;
    await appointment.save();

  } catch (error) {
    console.error('Failed to send receipt:', error.message);
  }
};
