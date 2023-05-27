import { Request } from "express";
import { Member } from "../models/members";

export const getPayload = (req: Request, key: string): string => {
    // @ts-ignore
    const payload = req.payload;
    return key ? payload[key] : payload;
}

export const getAssemblyMembers = async (assembly: any) => {
    const memberIds = assembly.members;
    const members = await Member.find({ member_id: memberIds })
    return {
        assembly, members
    }
}
