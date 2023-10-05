import nodemailer from "nodemailer";
import { RequestHandler } from "express";
import { CreateUser } from "#/@types/user";
import User from "#/models/user";
import { MAILTRAP_USER, MAILTRAP_PASS } from "#/utils/variables";

export const create: RequestHandler = async (req: CreateUser, res) => {
  const { email, password, name } = req.body;

  const user = await User.create({ email, password, name });

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
    html: "<h1>Welcome Test Email</h1>",
  });
  res.status(201).json({ user });
};
