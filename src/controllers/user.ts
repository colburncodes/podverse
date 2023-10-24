import { RequestHandler } from "express";
import { CreateUser, VerifyEmailRequest } from "#/@types/user";
import User from "#/models/user";
import { generateToken } from "#/utils/helper";
import {sendPasswordLink, sendVerificationEmail} from "#/utils/mail";
import emailVerificationToken from "#/models/emailVerificationToken";
import { isValidObjectId } from "mongoose";
import PasswordResetToken from "#/models/passwordResetToken";
import crypto from 'crypto'
import {PASSWORD_RESET_LINK} from "#/utils/variables";

export const create: RequestHandler = async (req: CreateUser, res) => {
  const { email, password, name } = req.body;

  const user = await User.create({ email, password, name });
  const token = generateToken();

  await emailVerificationToken.create({ owner: user._id, token });

  await sendVerificationEmail({ name, email, id: user._id.toString() }, token);

  res.status(201).json({ user: { id: user._id, name, email } });
};

export const verifyEmail: RequestHandler = async (
  req: VerifyEmailRequest,
  res
) => {
  const { userId, token } = req.body;
  const verificationToken = await emailVerificationToken.findOne({ userId });

  if (!verificationToken)
    return res.status(400).json({ message: "Invalid token" });

  const matched = await verificationToken?.compareToken(token);
  if (!matched) return res.status(400).json({ message: "Invalid token" });

  await User.findByIdAndUpdate(userId, { verified: true });
  // remove token from db once verified
  await emailVerificationToken.findByIdAndDelete(verificationToken._id);

  res.status(200).json({ message: "Email verified" });
};

export const sendVerificationToken: RequestHandler = async (req, res) => {
  const { userId } = req.body;

  const user = await User.findById(userId);
  if (!isValidObjectId(user))
    return res.status(403).json({ message: "Invalid request" });

  // remove previous token if exists
  await emailVerificationToken.findOneAndDelete({ owner: userId });

  const token = generateToken();
  await emailVerificationToken.create({ owner: userId, token });

  await sendVerificationEmail(
    { name: user?.name, email: user?.email, id: user?._id.toString() },
    token
  );

  res.json({ message: "Please check your email for verification." });
}

export const generateForgetPasswordLink: RequestHandler = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email });

  if(!user) return res.status(404).json({ error: "Account not found!"})
  await PasswordResetToken.findOneAndDelete({owner: user._id});

  // generate the link
  const token = crypto.randomBytes(36).toString('hex')
  await PasswordResetToken.create({
    owner: user._id,
    token
  })

  const resetLink = `${PASSWORD_RESET_LINK}?token=${token}&userId=${user._id}`;

  await sendPasswordLink({ email, link: resetLink})
  res.json({message: "Check your email."})
};
