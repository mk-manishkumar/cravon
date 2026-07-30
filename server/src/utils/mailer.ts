import nodemailer from "nodemailer";

export const sendOtpEmail = async (email: string, otpCode: string) => {
  if (!process.env.MAIL_HOST || !process.env.MAIL_USERNAME || !process.env.MAIL_PASSWORD) {
    throw new Error("Mailer is not configured. Please add Mailtrap credentials to your .env file.");
  }
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Cravon Partners" <${process.env.MAIL_FROM || "no-reply@cravon.com"}>`,
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
  } catch (error) {
    console.error("Error sending OTP email: ", error);
  }
};
