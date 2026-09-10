import express from "express";
import cors from "cors";
import helmet from "helmet";
import { authRoutes } from "./modules/auth/auth.route";
import { boardRoutes } from "./modules/board/board.route";
import { errorHandler } from "./middlewares/errorHandler";
// import { AppError } from "./utils/AppError";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/boards", boardRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorHandler);

export default app;
