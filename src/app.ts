import express from "express";
import cors from "cors";
import helmet from "helmet";
import { authRoutes } from "./modules/auth/auth.route";
import { errorHandler } from "./middlewares/errorHandler";
import { AppError } from "./utils/AppError";

const app = express();

// Global Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1/auth", authRoutes);

// Catch 404
app.all("*", (req, res, next) => {
  next(
    new AppError(`Endpoint ${req.originalUrl} tidak ditemukan di server`, 404),
  );
});

// Global Error Handler (Wajib paling akhir)
app.use(errorHandler);

export default app;
