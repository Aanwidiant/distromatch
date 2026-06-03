export type ContactMessageProps = {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
};

const EMAIL_LOGO_URL =
    process.env.EMAIL_LOGO_URL ?? 'https://cdn.distromatch.tech/logos/distromatch-logo.png';

const CURRENT_YEAR = new Date().getFullYear();

export const contactMessageTemplate = (props: ContactMessageProps) => ({
    subject: `[Contact] ${props.subject}`,

    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />
  <meta
    http-equiv="Content-Type"
    content="text/html charset=UTF-8"
  />

  <title>New Contact Message</title>

  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 20px;
    }

    .container {
      max-width: 600px;
      background-color: #ffffff;
      margin: auto;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .header {
      background-color: #1E3A8A;
      color: #ffffff;
      padding: 18px;
      text-align: center;
      font-size: 20px;
      font-weight: bold;
    }

    .logo {
      text-align: center;
      margin-top: 20px;
    }

    .content {
      padding: 24px;
      font-size: 16px;
      color: #333333;
      line-height: 1.6;
    }

    .info-box {
      background-color: #f8fafc;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 16px;
      margin-top: 20px;
    }

    .message-box {
      margin-top: 20px;
      padding: 16px;
      background-color: #f9fafb;
      border-left: 4px solid #1E3A8A;
      border-radius: 6px;
      white-space: pre-line;
    }

    .footer {
      text-align: center;
      padding: 16px;
      font-size: 13px;
      color: #777777;
      background-color: #fafafa;
    }
  </style>
</head>

<body>
  <div class="container">

    <div class="header">
      New Contact Message
    </div>

    <div class="logo">
      <img
        src="${EMAIL_LOGO_URL}"
        alt="DistroMatch Logo"
        style="max-height: 80px;"
      />
    </div>

    <div class="content">

      <p>
        You have received a new contact message from the DistroMatch website.
      </p>

      <div class="info-box">

        <p>
          <strong>Name:</strong><br />
          ${props.name}
        </p>

        <p>
          <strong>Email:</strong><br />
          ${props.email}
        </p>

        <p>
          <strong>Phone:</strong><br />
          ${props.phone || '-'}
        </p>

        <p>
          <strong>Subject:</strong><br />
          ${props.subject}
        </p>

      </div>

      <div class="message-box">
        <strong>Message:</strong><br /><br />
        ${props.message}
      </div>

      <p style="margin-top: 24px;">
        You can reply directly to this email to respond to the sender.
      </p>

    </div>

    <div class="footer">
      &copy; ${CURRENT_YEAR} <strong>DistroMatch</strong><br/>
      Contact Message Notification System
    </div>

  </div>
</body>
</html>
`,
});
