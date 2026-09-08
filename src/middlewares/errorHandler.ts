import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { AppError } from "../utils/AppError";
import { env } from "../config/env";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // 1. Error Validasi Zod
  if (err instanceof ZodError) {
    return res.status(422).json({
      success: false,
      message: "Validation Error",
      errors: err.errors.map((e) => ({
        field: e.path.join(".").replace("body.", ""),
        message: e.message,
      })),
    });
  }

  // 2. Error Unique Constraint Prisma (Email duplikat dsb)
  if (
    err instanceof Prisma.PrismaClientKnownRequestError &&
    err.code === "P2002"
  ) {
    return res.status(409).json({
      success: false,
      message: "Data tersebut sudah terdaftar, silakan gunakan yang lain.",
    });
  }

  // 3. Custom AppError (400, 401, 403, 404)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // 4. Unexpected 500
  console.error("🔥 Server Error:", err);
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    ...(env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
