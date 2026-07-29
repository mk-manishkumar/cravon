import nodemailer from 'nodemailer';

// Since the user is setting up Mailchimp SMTP later, we will use a fallback or simply log to console.
// We configure Nodemailer, but if credentials are missing, we mock the behavior.

export const sendOtpEmail = async (email: string, otpCode: string) => {
  if (!process.env.MAIL_HOST || !process.env.MAIL_USER) {
    console.log(`\n=================================================`);
    console.log(`✉️  MOCK EMAIL SENT TO: ${email}`);
    console.log(`🔑 OTP CODE: ${otpCode}`);
    console.log(`=================================================\n`);
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"Cravon Partners" <${process.env.MAIL_FROM || 'no-reply@cravon.com'}>`,
      to: email,
      subject: "Your Cravon Partner Verification Code",
      text: `Welcome to Cravon! Your verification code is: ${otpCode}. It expires in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #FF3D57;">Welcome to Cravon!</h2>
          <p>Thank you for registering as a partner. Please use the verification code below to verify your email address.</p>
          <div style="font-size: 24px; font-weight: bold; margin: 20px 0; padding: 10px; background: #FFF3EA; border-radius: 8px; display: inline-block;">
            ${otpCode}
          </div>
          <p>This code will expire in 10 minutes.</p>
        </div>
      `,
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending OTP email: ", error);
  }
};
