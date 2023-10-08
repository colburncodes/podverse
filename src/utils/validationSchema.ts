import * as yup from "yup";
import { isValidObjectId } from "mongoose";

export const CreateUserSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required("Name is required")
    .min(3, "Invalid name")
    .max(20, "Name too long"),
  email: yup
    .string()
    .trim()
    .email("Invalid email")
    .required("Email is required"),
  password: yup.string().trim().required("Password is required").min(8).max(20), // TODO: add Regex
});

export const EmailVerificationBody = yup.object().shape({
  userId: yup
    .string()
    .transform((value) => value.trim())
    .test("isValidObjectId", "Invalid userId", (value) =>
      isValidObjectId(value)
    )
    .required("Invalid userId!"),
  token: yup.string().trim().required("Invalid Token!"),
});
