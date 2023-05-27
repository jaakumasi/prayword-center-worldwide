import { Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { MEMBER_ID } from "../constants";
import { getAssemblyMembers, getPayload } from "./utilities";
import { Admin } from "../models/admins";
import { Assembly } from "../models/assembly";

/* Admin Handlers */
export const handlePostAdmin = async (req: Request, res: Response) => {
    const { member_id, is_superadmin } = req.body;
    const randomPassword = crypto.randomBytes(2).toString("hex");
    const hashedPassword = await bcrypt.hash(randomPassword, 10);
    const newAdmin = new Admin({
        password: hashedPassword,
        member_id: getPayload(req, MEMBER_ID),
        is_superadmin,
    });
    await newAdmin.save();
    return res.status(200).json({ randomPassword });
}

export const handleGetAdmin = async (req: Request, res: Response) => {
    const admins = await Admin.find();
    return res.json({ data: admins });
}
/* END */


/* Assembly Handlers */
export const handlePostAssembly = async (req: Request, res: Response) => {
    const { name, leaders, members } = req.body;
    const assemblyLength = (await Assembly.find()).length;
    const newAssembly = new Assembly({
        name,
        leaders,
        members,
        assembly_no: assemblyLength.toString().padStart(2, "0")
    })
}

export const handleGetAssembly = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    // if admin is null or password is wrong, ...
    if (!admin || !await bcrypt.compare(password, admin.password)) {
        return res.status(200).json({ message: "Invalid credentials. Please try again!" });
    }
    // fetch all assemblies for superadmins
    if (admin.is_superadmin) {
        const allAssemblies = await Assembly.find();        
        const data = [];
        for (let i = 0; i < allAssemblies.length; i++) {
            data.push(getAssemblyMembers(allAssemblies[i]));
        }
        return res.status(200).json({ data });
    }
    else {
        // @ts-ignore
        const assembly = await Assembly.findOne({ assembly_no: admin.assembly_no });
        return res.status(200).json({ data: getAssemblyMembers(assembly) });
    }
}
/* END */
