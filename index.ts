import { config } from "dotenv";
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();
app.use(express.json());

config();

/**
 * * route registry for user routes.
 */

app.use(
  "/api/user",
  createProxyMiddleware({
    target: process.env.USER_SERVICE,
    changeOrigin: true,
  })
);

app.listen(process.env.PORT, () =>
  console.log("api gateway is listening on port " + process.env.PORT)
);
