import nodemailer from "nodemailer";
import { RequestHandler } from "express";
import { CreateUser } from "#/@types/user";
import User from "#/models/user";
import { MAILTRAP_USER, MAILTRAP_PASS } from "#/utils/variables";
import { generateToken } from "#/utils/helper";
import emailVerificationToken from "#/models/emailVerificationToken";

export const create: RequestHandler = async (req: CreateUser, res) => {
  const { email, password, name } = req.body;

  const user = await User.create({ email, password, name });

  const token = generateToken();
  await emailVerificationToken.create({ owner: user._id, token });

  // send verification email
  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: MAILTRAP_USER,
      pass: MAILTRAP_PASS,
    },
  });

  transport.sendMail({
    to: user.email,
    from: "colburnsanders@gmail.com",
    html: `<h1>Your verification token is ${token}</h1>`,
  });
  res.status(201).json({ user });
};
