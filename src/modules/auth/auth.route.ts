import { Router } from "express";
import { validate } from "../../middlewares/validate";
import { authenticate } from "../../middlewares/auth";
import { registerSchema, loginSchema, googleAuthSchema } from "./auth.schema";
import { register, login, getMe, googleLogin } from "./auth.controller";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post('/google', validate(googleAuthSchema), googleLogin);

router.get("/me", authenticate, getMe);

export const authRoutes = router;
