import { Request, Response, NextFunction } from "express";
import { jwtVerify } from "jose";
import mongoose from "mongoose";
import { MONGO_URL, NODE_ENV } from "./constants";

export const dbConnect = async (req: Request, res: Response, next: NextFunction) => {
    await mongoose.connect(process.env[MONGO_URL]!);
    process.env[NODE_ENV] === "development" ? console.log("connected to mongodb") : "";
    next();
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.path.endsWith("login")) {
        const token = req.headers['Authorization']![0].split(" ")[0];
        const secret = new TextEncoder().encode(process.env["JWT_SECRET"]);
        const { payload } = await jwtVerify(token, secret);
        //@ts-ignore
        req.payload = payload;
    }
    next();
}
