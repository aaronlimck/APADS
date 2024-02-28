import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

interface requestBody {
  email: string;
  subject: string;
}

export async function POST(request: { json: () => Promise<requestBody> }) {
  try {
    const { email, subject } = await request.json();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: "ticketeer101@gmail.com",
      to: email,
      subject: subject,
      html: "Form URL: www.google.com",
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    );
    
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
