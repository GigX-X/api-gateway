import { NextFunction, Request, Response } from "express";

export const loggerX = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        console.log("Request received:", req.method, req.url);
        console.log("Request headers:", req.headers);
        console.log("bdy:", req.body);
        res.on('finish', () => {
            console.log("Response status:", res.statusCode);
            console.log("Response headers:", res.getHeaders());
        });
        next();
    }
}