import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { MEMBER_ID } from "../constants";
import { Admin } from "../models/admins";
import { Assembly } from "../models/assembly";
import {
    generateAssemblyCode,
    generateMemberId,
    generateShortRandomPassword,
    getAssemblyMembers,
    getPayload,
    verifyMemberObject
} from "./utilities";
import { Member } from "../models/members";

/* Admin Handlers */
export const handlePostAdmin = async (req: Request, res: Response) => {
    const { member_id, is_superadmin } = req.body;
    const randomPassword = generateShortRandomPassword();
    const hashedPassword = await bcrypt.hash(randomPassword, 10);
    const newAdmin = new Admin({
        password: hashedPassword,
        member_id: getPayload(req, MEMBER_ID),
        is_superadmin,
    });
    await newAdmin.save();

    // TODO: send password as SMS to phone

    return res.sendStatus(200);
}

export const handleGetAdmin = async (req: Request, res: Response) => {
    const admins = await Admin.find();
    return res.status(200).json({ data: admins });
}

export const handleDeleteAdmin = async (req: Request, res: Response) => {
    await Admin.findByIdAndDelete(req.body._id);
    return res.status(200).json({ success: true });
}

export const handlePutAdmin = async (req: Request, res: Response) => {
    const { _id, password, is_superadmin } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await Admin.findByIdAndUpdate(_id, {
        $set: {
            is_superadmin,
            password: hashedPassword,
        }
    });
    return res.status(200).json({ success: true });
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
        return res.status(200).json({ message: "Invalid credential(s). Please try again!" });
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

/* Member Handlers */
export const handlePostMember = async (req: Request, res: Response) => {
    const { error } = verifyMemberObject(req.body);
    if (error) return res.status(403).json({ error: error.details[0].message });
    const member_id = await generateMemberId();
    const newMember = new Member({
        member_id, ...req.body
    });
    await newMember.save();

    return res.status(201).json({ data: newMember });
}

export const handleUpdateMember = async (req: Request, res: Response) => {
    const updateList = req.body;
    for (let i = 0; i < updateList.length; i++) {
        delete updateList[0]._id;
        await Member.findByIdAndUpdate(updateList[0]._id, { $set: updateList[0] })
    }

    return res.status(200).json({ success: true })
}

/* END */
