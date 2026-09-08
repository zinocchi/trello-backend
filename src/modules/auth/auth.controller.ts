import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import * as authService from "./auth.service";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.registerUser(req.body);
  res.status(201).json({
    success: true,
    message: "Registrasi berhasil",
    data: user,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.loginUser(req.body);
  res.status(200).json({
    success: true,
    message: "Login berhasil",
    data: result,
  });
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  // req.user diisi otomatis oleh middleware auth
  const user = await authService.getCurrentUser(req.user!.id);
  res.status(200).json({
    success: true,
    data: user,
  });
});
