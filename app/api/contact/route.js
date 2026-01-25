import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { personalData } from '@/utils/data/personal-data';

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for port 465, false for 587
  auth: {
    user: process.env.EMAIL_ADDRESS,     // your Gmail address
    pass: process.env.GMAIL_PASSKEY,     // your Gmail app password
  },
});

// Helper function to send email
async function sendEmail({ name, email, message: userMessage }) {
  const mailOptions = {
    from: 'Portfolio',
    to: personalData.email,                     // Your personal email
    subject: 'Message sent from portfolio',    // Email subject
    text: `${userMessage}\n\nFrom: ${name}\nEmail: ${email}`, // Message body
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully.');
    return true;
  } catch (error) {
    console.error('Error sending email:', error.message);
    return false;
  }
}

// Next.js API route handler
export async function POST(request) {
  try {
    const payload = await request.json();

    // Validate payload
    if (!payload.name || !payload.email || !payload.message) {
      return NextResponse.json(
        { success: false, message: 'All fields are required.' },
        { status: 400 }
      );
    }

    // Send the email
    const emailSuccess = await sendEmail(payload);

    if (emailSuccess) {
      return NextResponse.json(
        { success: true, message: 'Message sent successfully!' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: 'Failed to send email.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API Error:', error.message);
    return NextResponse.json(
      { success: false, message: 'Server error occurred.' },
      { status: 500 }
    );
  }
}
