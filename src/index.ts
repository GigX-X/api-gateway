import { config } from "dotenv";
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import cors from "cors";
import cookieParser from "cookie-parser";
import axios from "axios";
import { verifyRole } from "./middleware/verifyRole";
import { adminLogin, adminLogout } from "./controllers/UserController";

const app = express();
app.use(express.json());
config({ path: __dirname + "/../.env" });

app.use(
  cors({
    // origin: process.env.FRONT_END_URL,
    origin: process.env.FRONT_END_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

/**
 * Authentication routes for admin.
 */
app.post("/user-service/admin/login", adminLogin);
app.post("/user-service/admin/logout", adminLogout);

/**
 * Protected routes for clients, workers and admin.
 */

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

app.use(
  "/user-service/auth",
  createProxyMiddleware({
    target: process.env.USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/user-service/auth": "/auth"
    }
  })
)

app.listen(process.env.PORT, () =>
  console.log("api gateway is listening on port " + process.env.PORT)
);
