import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { handlePostAssembly, handleGetAssembly, handlePostAdmin, handleGetAdmin } from "./handlers/routeHandlers";
import { Admin } from "./models/admins";
import { Member } from "./models/members";

export const login = async (req: Request, res: Response) => {
    const { phone, password } = req.body;
    const adminMatch = await Admin.findOne({ password });
    if (!adminMatch || !await bcrypt.compare(password, adminMatch?.password)) {
        return res.json({ message: "Invalid credentials! Please try again!" });
    }
    // @ts-ignore
    const { assembly_no, member_id } = await Member.findOne({ member_id: adminMatch.member_id });
    const payload = {
        assembly_no,
        member_id,
        phone,
        is_superadmin: adminMatch.is_superadmin,
    };
    const secret = new TextEncoder().encode(process.env["JWT_SECRET"]);
    const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("1d")
        .sign(secret);

    return res.json({ token });
}

export const admin = async (req: Request, res: Response) => {
    const method = req.method;
    if (method === "POST") {
        handlePostAdmin(req, res);
    }
    else if (method === "GET") {
        handleGetAdmin(req, res);
    }
}

export const assembly = async (req: Request, res: Response) => {
    const method = req.method;
    if (method === "POST") {
        handlePostAssembly(req, res);
    }
    else if (method === "GET") {
        handleGetAssembly(req, res);
    }

}
