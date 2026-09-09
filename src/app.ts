import express from "express";
import cors from "cors";
import helmet from "helmet";
import { authRoutes } from "./modules/auth/auth.route";
import { boardRoutes } from "./modules/board/board.route"; 
import { errorHandler } from "./middlewares/errorHandler";
import { AppError } from "./utils/AppError";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/boards", boardRoutes); 

app.all("*", (req, res, next) => {
  next(
    new AppError(`Endpoint ${req.originalUrl} tidak ditemukan di server`, 404),
  );
});

app.use(errorHandler);

export default app;
