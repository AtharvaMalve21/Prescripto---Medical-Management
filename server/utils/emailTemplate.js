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
      body {
        margin: 0;
        padding: 0;
        background-color: #f9fafb;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }

      .email-wrapper {
        width: 100%;
        padding: 40px 20px;
        box-sizing: border-box;
        background-color: #f9fafb;
      }

      .email-container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 10px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        padding: 40px;
      }

      .header {
        text-align: center;
        padding-bottom: 30px;
        border-bottom: 1px solid #e5e7eb;
      }

      .header h1 {
        margin: 0;
        color: #10b981;
        font-size: 28px;
      }

      .header p {
        color: #6b7280;
        font-size: 16px;
        margin-top: 8px;
      }

      .content {
        padding: 30px 0;
      }

      .content p {
        font-size: 16px;
        color: #374151;
        line-height: 1.6;
        margin-bottom: 20px;
      }

      .content strong {
        color: #111827;
      }

      .appointment-details {
        background-color: #f3f4f6;
        padding: 20px;
        border-radius: 8px;
        margin-top: 20px;
      }

      .appointment-details p {
        margin: 8px 0;
        color: #1f2937;
      }

      .footer {
        text-align: center;
        font-size: 13px;
        color: #9ca3af;
        border-top: 1px solid #e5e7eb;
        padding-top: 20px;
        margin-top: 40px;
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
            We’re pleased to confirm your appointment with
            <strong>${doctorName}</strong>.
          </p>

          <div class="appointment-details">
            <p><strong>Date:</strong> ${slotDate}</p>
            <p><strong>Time:</strong> ${slotTime}</p>
            <p><strong>Location:</strong> ${address}</p>
          </div>

          <p>
            If you need to make any changes or have questions, feel free to contact us anytime.
          </p>
        </div>

        <div class="footer">
          <p>
            Need help? Contact us at
            <a href="mailto:support@yourapp.com">support@yourapp.com</a>
          </p>
          <p>&copy; 2025 YourApp. All rights reserved.</p>
        </div>
      </div>
    </div>
  </body>
</html>`;
};
