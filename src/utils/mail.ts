import nodemailer from "nodemailer";
import { generateTemplate } from "#/mail/template";
import {
  MAILTRAP_USER,
  MAILTRAP_PASS,
  VERIFICATION_EMAIL,
} from "#/utils/variables";
import path from "path";
import emailVerificationToken from "#/models/emailVerificationToken";

const generateMailTransporter = () => {
  // send verification email
  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: MAILTRAP_USER,
      pass: MAILTRAP_PASS,
    },
  });
  return transport;
};

interface Profile {
  name: string;
  email: string;
  id: string;
}

export const sendVerificationEmail = async (user: Profile, token: string) => {
  const transport = generateMailTransporter();

  const welcomeMessage = `Hi ${user.name}, welcome to Podverse! There are so much things that we do for verified
    users. Please verify your email by using the OTP token.`;

  await transport.sendMail({
    to: user.email,
    from: VERIFICATION_EMAIL,
    subject: "Welcome to Podverse",
    html: generateTemplate({
      title: "Welcome to Podverse",
      message: welcomeMessage,
      logo: "cid:logo",
      banner: "cid:welcome",
      link: "#",
      btnTitle: token,
    }),

    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "../mail/logo.png"),
        cid: "logo",
      },
      {
        filename: "welcome.png",
        path: path.join(__dirname, "../mail/welcome.png"),
        cid: "welcome",
      },
    ],
  });
};

interface Options {
  email: string;
  link: string;
}

export const sendPasswordLink = async (options: Options) => {
  const transport = generateMailTransporter();

  const { email, link } = options;

  const message = `Hi ${email}, we received a request that you forgot your password. No problem
  you can use the link below and create brand new password.`;

  await transport.sendMail({
    to: email,
    from: VERIFICATION_EMAIL,
    subject: "Password Reset Link",
    html: generateTemplate({
      title: "Password Reset",
      message,
      logo: "cid:logo",
      banner: "cid:forget_password",
      link,
      btnTitle: "Reset Password",
    }),

    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "../mail/logo.png"),
        cid: "logo",
      },
      {
        filename: "forget_password.png",
        path: path.join(__dirname, "../mail/forget_password.png"),
        cid: "forget_password",
      },
    ],
  });
};
