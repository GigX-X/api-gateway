import { config } from "dotenv";
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import cors from "cors";
import cookieParser from "cookie-parser";
import axios from "axios";
import { verifyRole } from "./middleware/verifyRole";

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
app.post("/user-service/admin/login", async (req, res) => {
  try {
    const response = await axios.post(
      `${process.env.USER_SERVICE_URL}/admin/login`,
      req.body
    );
    res.cookie("token", response.data.token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.json({ message: "Login successful", token: response.data.token });
  } catch (error) {
    console.error("Login failed:", error);
    res.status(401).json({ message: "Login failed" });
  }
});

app.post("/user-service/admin/logout", (req, res) => {
  console.log("inside logout fn in api gateway")
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    console.log("logging the server side cookie", req.cookies.token);
  } catch (error) {
    console.error("Error during logout", error);
    res.status(401).json({ message: "Logout failed !!" });
  }
});

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

app.listen(process.env.PORT, () =>
  console.log("api gateway is listening on port " + process.env.PORT)
);
