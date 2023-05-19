import mongoose from "mongoose";

export const memberSchema = new mongoose.Schema({
    member_id: { type: String, required: true },
    name: { type: String, required: true },
    gender: { type: String, required: true },
    phone: { type: Number, required: true },
    address: { type: String, required: true },
    assembly_no: { type: Number, required: true },
    nok_name: { type: String, required: false },
    nok_phone: { type: Number, required: false },
})

export const Member = mongoose.model('Member', memberSchema);
