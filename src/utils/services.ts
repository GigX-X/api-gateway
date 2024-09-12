import { config } from "dotenv"

config({ path: __dirname + "/../../.env" });

export const services = [
    {
        route: "/user-service",
        target: process.env.USER_SERVICE_URL
    },
]