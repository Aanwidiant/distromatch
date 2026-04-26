export type VerifyEmailProps = {
    name: string;
    verifyLink: string;
};

const EMAIL_LOGO_URL =
    process.env.EMAIL_LOGO_URL ??
    'https://rnogbzxoyfknjpdfhbjw.supabase.co/storage/v1/object/public/media/distro-match-logo.png';

const CURRENT_YEAR = new Date().getFullYear();

export const verifyEmailTemplate = (props: VerifyEmailProps) => ({
    subject: 'Verify Your DistroMatch Account Email',

    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
  <title>Email Verification</title>

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
    .button {
      display: block;
      width: 240px;
      margin: 24px auto;
      padding: 12px;
      text-align: center;
      background-color: #1E3A8A;
      color: #ffffff !important;
      text-decoration: none !important;
      font-size: 16px;
      font-weight: 600;
      border-radius: 6px;
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
      DistroMatch Email Verification
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
        Hello <strong>${props.name}</strong>,
      </p>

      <p>
        Thank you for registering on <strong>DistroMatch</strong>, a Decision Support System (DSS)
        platform designed to help you discover and compare Linux distributions based on your preferences.
      </p>

      <p>
        To complete your registration and activate your account, please verify your email address by clicking the button below.
      </p>

      <a href="${props.verifyLink}" class="button">
        Verify Email Address
      </a>

      <p>
        This verification link is valid for <strong>1 hour</strong>.
        If you did not create this account, you can safely ignore this email.
      </p>

      <p>
        Once verified, you will be able to access personalized distro recommendations powered by our DSS engine.
      </p>

      <p>
        Regards,<br/>
        <strong>DistroMatch Team</strong>
      </p>

    </div>

    <div class="footer">
      &copy; ${CURRENT_YEAR} <strong>DistroMatch</strong><br/>
      Decision Support System for Linux Distribution Selection
    </div>

  </div>
</body>
</html>
`,
});
