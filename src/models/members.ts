import mongoose from "mongoose";
import { Assembly } from '@/app/_shared/typings'

export const memberSchema = new mongoose.Schema({
    member_id: { type: String, required: true },
    name: { type: String, required: true },
    gender: { type: String, required: true },
    phone: { type: Number, required: true },
    address: { type: String, required: true },
    assembly_no: { type: Number, required: true },
    nok_name: { type: String, required: true },
    nok_phone: { type: Number, required: true },
})

export const Member = mongoose.model('Member', memberSchema);
