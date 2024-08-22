import { config } from "dotenv";
import { NextFunction, Request, Response } from 'express';
import jwt, {VerifyErrors} from "jsonwebtoken";

config({ path: __dirname + "/../../.env" });

interface DecodedToken {
    userId?: string;
    role: 'client' | 'worker' | 'admin'
}

// ! fix request error !!!

export const verifyRole = (requiredRole: 'client' | 'worker' | 'admin') => {
    return (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies.token;

        if (!token) {
            return res.status(403).json({ message: 'No token provided' });
        }

        jwt.verify(token, process.env.JWT_SECRET as string, (err:any, decoded: DecodedToken | any) => {
            if(err) {
                return res.status(401).json({ message: 'Failed to authenticate token' });
            }

            if(decoded.role !== requiredRole) {
                return res.status(403).json({ message: 'Access denied' });
            }
            req.user = decoded;
            next();
        });
    }
}