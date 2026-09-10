import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(5000),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string().min(10, "JWT_SECRET minimal 10 karakter"),
  GOOGLE_CLIENT_ID: z.string().min(10, "GOOGLE_CLIENT_ID wajib diisi"),
});

export const env = envSchema.parse(process.env);
