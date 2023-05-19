import { Request } from "express";

export const getPayload = (req: Request, key: string): string => {
    // @ts-ignore
    const payload = req.payload;
    return key ? payload[key] : payload;
}