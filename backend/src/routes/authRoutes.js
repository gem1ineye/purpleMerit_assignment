import { Router } from "express";
import { login, register } from "../controllers/authController.js";
import { authLoginValidation, authRegisterValidation } from "../middleware/validateInput.js";

const router = Router();

router.post("/login", authLoginValidation, login);
router.post("/register", authRegisterValidation, register);

export default router;
