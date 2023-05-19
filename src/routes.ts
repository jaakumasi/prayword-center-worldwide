import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { handlePostAssembly, handleGetAssembly } from "./handlers/routeHandlers";
import { Admin } from "./models/admins";

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const adminMatch = await Admin.findOne({ username, password });
    if (!adminMatch || !await bcrypt.compare(password, adminMatch?.password)) {
        return res.json({ message: "Invalid credentials! Please try again!" });
    }

    const { assembly_no, is_superadmin } = adminMatch;
    const secret = new TextEncoder().encode(process.env["JWT_SECRET"]);
    const token = await new SignJWT({ username, assembly_no, is_superadmin })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("1d")
        .sign(secret);

    return res.json({ token });
}

export const assembly = async (req: Request, res: Response) => {
    const method = req.method;
    if (method === "POST") handlePostAssembly(req, res);
    else if (method === "GET") handleGetAssembly(req, res);

}
