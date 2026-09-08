import { Router } from "express";
import { validate } from "../../middlewares/validate";
import { authenticate } from "../../middlewares/auth";
import { registerSchema, loginSchema } from "./auth.schema";
import { register, login, getMe } from "./auth.controller";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

// Endpoint terproteksi token JWT
router.get("/me", authenticate, getMe);

export const authRoutes = router;
