import { RequestHandler } from "express";
import { CreateUser, VerifyEmailRequest } from "#/@types/user";
import User from "#/models/user";
import { generateToken } from "#/utils/helper";
import { sendVerificationEmail } from "#/utils/mail";
import emailVerificationToken from "#/models/emailVerificationToken";

export const create: RequestHandler = async (req: CreateUser, res) => {
  const { email, password, name } = req.body;

  const user = await User.create({ email, password, name });
  const token = generateToken();

  sendVerificationEmail({ name, email, id: user._id.toString() }, token);

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
