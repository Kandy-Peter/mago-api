import { Router } from "express";
import v1 from "./v1";
import { handleValidationErrors } from "../middlewares/handleErrorValidation";

const router = Router();

router.use("/v1", v1);

router.use(handleValidationErrors);

export default router;
