import {create, generateForgetPasswordLink, sendVerificationToken, verifyEmail} from "#/controllers/user";
import { validate } from "#/middleware/validator";

import {
  CreateUserSchema,
  EmailVerificationBody,
} from "#/utils/validationSchema";
import { Router } from "express";

const router = Router();

router.post("/create", validate(CreateUserSchema), create);
router.post("/verify-email", validate(EmailVerificationBody), verifyEmail);
router.post("/send-verify-email", sendVerificationToken);
router.post("/forget-password", generateForgetPasswordLink);

export default router;
