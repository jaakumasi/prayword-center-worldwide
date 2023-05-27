import { Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { MEMBER_ID } from "../constants";
import { Admin } from "../models/admins";
import { Assembly } from "../models/assembly";
import {
    generateAssemblyCode,
    getAssemblyMembers,
    getPayload
} from "./utilities";

/* Admin Handlers */
export const handlePostAdmin = async (req: Request, res: Response) => {
    const { member_id, is_superadmin } = req.body;
    const randomBytes = crypto.randomBytes(3);
    const randomPassword = randomBytes.readUintBE(0, 2).toString();
    const hashedPassword = await bcrypt.hash(randomPassword, 10);
    const newAdmin = new Admin({
        password: hashedPassword,
        member_id: getPayload(req, MEMBER_ID),
        is_superadmin,
    });
    await newAdmin.save();

    // TODO: send password to as SMS to phone

    return res.sendStatus(200);
}

export const handleGetAdmin = async (req: Request, res: Response) => {
    const admins = await Admin.find();
    return res.status(200).json({ data: admins });
}

/* END */

/* Assembly Handlers */
export const handlePostAssembly = async (req: Request, res: Response) => {
    const { name, annex_of, leaders, members } = req.body;
    const assemblyNameAvailable = !(await Assembly.findOne({ name }));
    if (!assemblyNameAvailable)
        return res.status(401).json({ error: "Assembly name already exists!" });

    const assembly_no = await generateAssemblyCode(name, annex_of);
    const newAssembly = new Assembly({
        name,
        leaders,
        assembly_no,
        members
    });
    await newAssembly.save();

    return res.status(200).json({ success: true });
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
