import { Router } from "express";
import {
  registerValidation,
  loginValidation,
  refreshTokenValidation,
  verifyAccountOTPValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} from "./validations";

import authControllers from "./auth.controllers";

const router = Router();

router.post("/register", registerValidation, authControllers.register);
router.post("/login", loginValidation, authControllers.login);
router.delete("/logout", authControllers.logout);
router.post("/refresh-token", refreshTokenValidation, authControllers.refreshToken);
router.post("/verify-email/:userId", verifyAccountOTPValidation, authControllers.verifyAccountOTP);
router.post("/forgot-password", forgotPasswordValidation, authControllers.forgotPassword);
router.post("/reset-password/:userId", resetPasswordValidation, authControllers.resetPassword);

export default router;
