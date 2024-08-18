"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const express_1 = __importDefault(require("express"));
const http_proxy_middleware_1 = require("http-proxy-middleware");
const app = (0, express_1.default)();
app.use(express_1.default.json());
(0, dotenv_1.config)();
/**
 * * route registry for user routes.
 */
app.use("/api/user", (0, http_proxy_middleware_1.createProxyMiddleware)({
    target: process.env.USER_SERVICE,
    changeOrigin: true,
}));
app.listen(process.env.PORT, () => console.log("api gateway is listening on port " + process.env.PORT));
