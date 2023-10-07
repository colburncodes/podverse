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

  await emailVerificationToken.create({ owner: user.id, token });

  const welcomeMessage = `Hi ${user.name}, welcome to Podverse! There are so much things that we do for verified
    users. Please verify your email by using the OTP token.`;

  transport.sendMail({
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
