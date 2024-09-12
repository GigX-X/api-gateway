import { config } from "dotenv";
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import { verifyRole } from "./middleware/verifyRole";
import { adminLogin, adminLogout } from "./controllers/UserController";
import { loggerX } from "./middleware/logger";

const app = express();
config({ path: __dirname + "/../.env" });

// Enable CORS.
const corsOptions = {
  origin: process.env.FRONT_END_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));

app.use(helmet()); // Add Security Headers.
app.use(morgan("combined")); //Log HTTP Headers.
app.disable("x-powered-by"); // Hide Express server information
app.use(cookieParser());

/**
 * Protected routes for clients, workers and admin.
 */

app.use(
  "/user-service/auth",
  loggerX(),
  createProxyMiddleware({
    target: process.env.USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/user-service/auth": "/auth",
    },
  })
);

app.use(
  "/user-service/admin",
  verifyRole("admin"),
  createProxyMiddleware({
    target: process.env.USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/user-service/admin": "/admin",
    },
  })
);

/**
 * Authentication routes for admin.
 */
app.post("/user-service/admin/login", adminLogin);
app.post("/user-service/admin/logout", adminLogout);

app.listen(process.env.PORT, () =>
  console.log("api gateway is listening on port " + process.env.PORT)
);
