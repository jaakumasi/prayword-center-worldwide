import { Request } from "express";
import crypto from "crypto";
import Joi from "joi";
import { Assembly } from "../models/assembly";
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

export const generateAssemblyCode = async (name: string, annex_of: string | null) => {
    let code = "";
    if (!annex_of) {
        const assembliesStartingWith_ = await Assembly.find({ name: { $regex: /^${name[0]}/i } });
        const matchCount = assembliesStartingWith_.length;
        if (matchCount === 0) {  // no assemblies start with name[0]
            code += name[0] + "1";
        }
        else {
            code += name[0] + matchCount + 1;
        }
    }
    else {
        /* code is in format P101 */
        const assemblyCodeSplit = annex_of.split("");
        let assemblyNumber: number | string = parseInt(assemblyCodeSplit[2] + assemblyCodeSplit[3]) + 1;
        if (assemblyNumber < 10)
            assemblyNumber = assemblyNumber.toString().padStart(2, "0");
        code += assemblyCodeSplit[0] + assemblyCodeSplit[1] + assemblyNumber;
    }

    return code;
}

export const generateMemberId = async () => {
    let member_id: number | string;
    const numberOfMembers = await Member.count();
    member_id = numberOfMembers + 1;
    if (member_id < 100) member_id = member_id.toString().padStart(3, "0");
    return member_id;
}

export const generateShortRandomPassword = () => {
    const randomBytes = crypto.randomBytes(3);
    return randomBytes.readUintBE(0, 2).toString();
}


export const verifyMemberObject = (memberObj: Object) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        gender: Joi.string().allow(['M', 'F']).required(),
        phone: Joi.string().required(),
        address: Joi.string().required(),
        assembly_no: Joi.string().required(),
        nok_name: Joi.string(),
        nok_phone: Joi.string(),
    })
    return schema.validate(memberObj);
}

