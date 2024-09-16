import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config()

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const configureTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com', 
    port: 587, // SMTP port (Gmail uses 587)
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

export const sendOTPEmail = async (email, otp) => {
  try {

    const transporter = configureTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Forgot Password Verification Code',
      text: `Dear User,

We have received a request to reset your password. To proceed with the password reset, please use the One-Time Password (OTP) provided below:

Your OTP code is: ${otp}

This code is valid for the next 10 minutes. If you did not request a password reset, please ignore this email or contact our support team immediately.

Thank you,
CareerHub Team

Please do not reply to this email. This mailbox is not monitored and you will not receive a response.`
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${email}`);
  } catch (error) {
    console.error(`Error sending OTP email to ${email}:`, error);
    throw new Error('Failed to send OTP email');
  }
};
