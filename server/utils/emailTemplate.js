export const appointmentBookedEmailTemplate = (
  userName,
  doctorName,
  slotDate,
  slotTime,
  address
) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Appointment Confirmation</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

      body {
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
        font-family: 'Inter', sans-serif;
      }

      .email-wrapper {
        padding: 40px 16px;
        background-color: #f4f4f4;
      }

      .email-container {
        max-width: 600px;
        margin: auto;
        background: #ffffff;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
        overflow: hidden;
        animation: fadeIn 0.7s ease-in-out;
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .header {
        background-color: #10b981;
        padding: 30px 20px;
        text-align: center;
      }

      .header h1 {
        margin: 0;
        font-size: 28px;
        color: #ffffff;
      }

      .header p {
        margin: 5px 0 0;
        color: #d1fae5;
        font-size: 16px;
      }

      .content {
        padding: 30px 20px;
        color: #374151;
        font-size: 16px;
      }

      .content p {
        margin-bottom: 20px;
        line-height: 1.6;
      }

      .content strong {
        color: #111827;
      }

      .appointment-details {
        background-color: #f9fafb;
        padding: 20px;
        border-radius: 8px;
        border: 1px solid #e5e7eb;
        margin-bottom: 20px;
      }

      .appointment-details p {
        margin: 8px 0;
        color: #1f2937;
      }

      .footer {
        text-align: center;
        padding: 20px;
        font-size: 14px;
        color: #9ca3af;
        border-top: 1px solid #e5e7eb;
        background-color: #f9fafb;
      }

      a {
        color: #10b981;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="email-wrapper">
      <div class="email-container">
        <div class="header">
          <h1>Appointment Confirmed</h1>
          <p>Your appointment has been successfully scheduled.</p>
        </div>
        <div class="content">
          <p>Hi <strong>${userName}</strong>,</p>
          <p>
            We're excited to confirm your appointment with
            <strong>${doctorName}</strong>. Below are the details of your appointment.
          </p>

          <div class="appointment-details">
            <p><strong>Date:</strong> ${slotDate}</p>
            <p><strong>Time:</strong> ${slotTime}</p>
            <p><strong>Location:</strong> ${address}</p>
          </div>

          <p>
            If you have any questions or need to reschedule, please reach out to us at any time.
          </p>
        </div>

        <div class="footer">
          <p>
            Need help? Email us at
            <a href="mailto:support@yourapp.com">support@yourapp.com</a>
          </p>
          <p>&copy; 2025 YourApp. All rights reserved.</p>
        </div>
      </div>
    </div>
  </body>
</html>`;
};

export const appointmentCancelledEmailTemplate = (
  userName,
  doctorName,
  slotDate,
  slotTime
) => {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Appointment Cancelled</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&display=swap');

      body {
        margin: 0;
        padding: 0;
        font-family: 'Outfit', 'Nunito', sans-serif;
        background-color: #f3f4f6;
      }

      .wrapper {
        width: 100%;
        padding: 30px 20px;
        box-sizing: border-box;
      }

      .container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
        overflow: hidden;
        animation: fadeIn 1s ease-in-out;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .header {
        background-color: #f87171;
        color: white;
        text-align: center;
        padding: 30px 20px;
      }

      .header h2 {
        margin: 0;
        font-size: 26px;
        font-weight: 700;
      }

      .body {
        padding: 30px 25px;
        color: #374151;
      }

      .body p {
        font-size: 16px;
        line-height: 1.6;
        margin-bottom: 16px;
      }

      .body strong {
        color: #111827;
      }

      .details {
        background-color: #f9fafb;
        padding: 15px 20px;
        border-left: 4px solid #ef4444;
        border-radius: 8px;
        margin-top: 20px;
      }

      .details p {
        margin: 6px 0;
        font-weight: 500;
      }

      .footer {
        text-align: center;
        padding: 20px;
        font-size: 13px;
        color: #9ca3af;
        border-top: 1px solid #e5e7eb;
      }

      .footer a {
        color: #ef4444;
        text-decoration: none;
        font-weight: 500;
      }

      @media screen and (max-width: 600px) {
        .container {
          border-radius: 0;
        }

        .body, .header, .footer {
          padding: 20px;
        }
      }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <div class="container">
        <div class="header">
          <h2>Appointment Cancelled</h2>
        </div>
        <div class="body">
          <p>Dear <strong>${userName}</strong>,</p>
          <p>
            We regret to inform you that your appointment with
            <strong>${doctorName}</strong> scheduled on
            <strong>${slotDate}</strong> at <strong>${slotTime}</strong> has been
            <span style="color: #dc2626; font-weight: 600;">cancelled</span>.
          </p>
          <div class="details">
            <p><strong>Doctor:</strong> ${doctorName}</p>
            <p><strong>Date:</strong> ${slotDate}</p>
            <p><strong>Time:</strong> ${slotTime}</p>
          </div>
          <p>
            If this was unintentional or you'd like to reschedule, please log
            into your account and book a new appointment.
          </p>
          <p>
            If you need any assistance, feel free to reach out to our support
            team anytime.
          </p>
        </div>
        <div class="footer">
          <p>
            Need help? <a href="mailto:support@prescripto.com">Contact Support</a>
          </p>
          <p>&copy; 2025 Prescripto. All rights reserved.</p>
        </div>
      </div>
    </div>
  </body>
</html>
`;
};

export const appointmentPaymentEmailTemplate = (
  patientName,
  doctorName,
  slotDate,
  slotTime,
  doctorAddress,
  amount,
  transactionId
) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #2d89ef;">Payment Confirmation - Appointment Booked</h2>
      
      <p>Dear <strong>${patientName}</strong>,</p>

      <p>Thank you for your payment. Your appointment with <strong>Dr. ${doctorName}</strong> has been confirmed.</p>
      
      <h3 style="margin-top: 30px;">🩺 Appointment Details</h3>
      <ul style="line-height: 1.6;">
        <li><strong>Date:</strong> ${new Date(
          slotDate
        ).toLocaleDateString()}</li>
        <li><strong>Time:</strong> ${slotTime}</li>
        <li><strong>Location:</strong> ${doctorAddress}</li>
      </ul>

      <h3 style="margin-top: 30px;">💳 Payment Details</h3>
      <ul style="line-height: 1.6;">
        <li><strong>Amount Paid:</strong> ₹${amount}</li>
        <li><strong>Transaction ID:</strong> ${transactionId}</li>
        <li><strong>Payment Method:</strong>Razorpay</li>
      </ul>

      <p style="margin-top: 30px;">
        Please make sure to arrive 10 minutes before your scheduled time. 
        If you have any questions or need to reschedule, feel free to contact us.
      </p>

      <p style="margin-top: 30px;">Wishing you good health,<br /><strong>Prescripto Team</strong></p>

      <hr style="margin-top: 40px;" />
      <p style="font-size: 12px; color: #888;">
        This is a confirmation of your payment and appointment. If you did not make this booking, please contact support immediately.
      </p>
    </div>
  `;
};
