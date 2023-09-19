import { Router } from "express";
import {
  registerValidation,
  loginValidation,
  refreshTokenValidation,
} from "./validations";

import authControllers from "./auth.controllers";

const router = Router();

router.post("/register", registerValidation, authControllers.register);
router.post("/login", loginValidation, authControllers.login);
router.delete("/logout", authControllers.logout);
router.post("/refresh-token", refreshTokenValidation, authControllers.refreshToken);

export default router;
