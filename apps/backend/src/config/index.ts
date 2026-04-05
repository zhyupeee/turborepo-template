import { registerAs } from "@nestjs/config";

export const appConfig = registerAs("app", () => ({
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "3001", 10),
  logLevel: process.env.LOG_LEVEL || "log",
}));

export const databaseConfig = registerAs("database", () => ({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306", 10),
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE || "turing_lab",
}));

export const corsConfig = registerAs("cors", () => ({
  origins: process.env.CORS_ORIGIN?.split(",").map((o) => o.trim()) || [
    "http://localhost:5173",
  ],
}));
