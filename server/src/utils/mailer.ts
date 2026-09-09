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

export const sendInviteEmail = async (email: string, inviteUrl: string, restaurantName: string) => {
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
      subject: `You have been invited to join ${restaurantName} on Cravon!`,
      text: `You have been invited to join the staff for ${restaurantName}. Click here to accept your invite: ${inviteUrl}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #FF3D57;">You're Invited!</h2>
          <p>You have been invited to join the staff for <strong>${restaurantName}</strong> on the Cravon platform.</p>
          <a href="${inviteUrl}" style="display: inline-block; padding: 12px 24px; background: #FF7A30; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0;">Accept Invite</a>
          <p>This invite link will expire in 7 days.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Error sending invite email: ", error);
  }
};

export const sendRefundEmail = async (email: string, amount: number, paymentMethod: string, orderId: string) => {
  if (!process.env.MAIL_HOST || !process.env.MAIL_USERNAME || !process.env.MAIL_PASSWORD) {
    console.error("Mailer is not configured.");
    return;
  }
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Cravon Food Delivery" <${process.env.MAIL_FROM || "no-reply@cravon.com"}>`,
      to: email,
      subject: `Order Cancelled - Refund Initiated (Order #${orderId.toString().slice(-6)})`,
      text: `Your order #${orderId.toString().slice(-6)} was cancelled by the restaurant. A refund of ₹${amount} will be processed to your original ${paymentMethod} payment method.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #FF3D57;">Order Cancelled</h2>
          <p>We are sorry, but your order <strong>#${orderId.toString().slice(-6)}</strong> was cancelled by the restaurant.</p>
          <p>Since you paid via <strong>${paymentMethod.toUpperCase()}</strong>, a refund of <strong>₹${amount}</strong> has been initiated and will reflect in your account within 5-7 business days.</p>
          <p>We apologize for the inconvenience.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Error sending refund email: ", error);
  }
};
