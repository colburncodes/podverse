import * as yup from "yup";

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
