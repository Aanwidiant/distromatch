export type ChangeEmailProps = {
    name: string;
    verifyLink: string;
    oldEmail: string;
    newEmail: string;
};

const EMAIL_LOGO_URL =
    process.env.EMAIL_LOGO_URL ??
    'https://cdn.distromatch.tech/logos/distromatch-logo.png';

const CURRENT_YEAR = new Date().getFullYear();

export const changeEmailTemplate = (props: ChangeEmailProps) => ({
    subject: 'Confirm Your Email Change',

    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
  <title>Email Change Verification</title>

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
      width: 260px;
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
      DistroMatch Email Change Verification
    </div>

    <div class="logo">
      <img src="${EMAIL_LOGO_URL}" alt="DistroMatch Logo" style="max-height: 80px;" />
    </div>

    <div class="content">

      <p>Hello <strong>${props.name}</strong>,</p>

      <p>
        We received a request to change your email address on
        <strong>DistroMatch</strong>.
      </p>

      <p>
        <b>Current email:</b> ${props.oldEmail}<br/>
        <b>New email:</b> ${props.newEmail}
      </p>

      <p>
        To confirm this change, please click the button below.
      </p>

      <a href="${props.verifyLink}" class="button">
        Confirm Email Change
      </a>

      <p>
        If you did not request this change, you can safely ignore this email.
        Your current email will remain unchanged.
      </p>

      <p>
        This link will expire in <b>1 hour</b>.
      </p>

      <p>
        Regards,<br/>
        <strong>DistroMatch Team</strong>
      </p>

    </div>

    <div class="footer">
      &copy; ${CURRENT_YEAR} <strong>DistroMatch</strong><br/>
      DSS for Linux Distribution Selection
    </div>

  </div>
</body>
</html>
`,
});
