import { Router } from "express";
import { registerValidation } from "./validations";

import authControllers from "./auth.controllers";

const router = Router();

router.post("/register", registerValidation, authControllers.register);

export default router;
