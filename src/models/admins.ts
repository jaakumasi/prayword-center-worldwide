import { Assembly } from "@/app/_shared/typings";
import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    assembly_no: { type: Number, required: true },
    is_superadmin:{type: Boolean, required: true, default: 0}
})

export const Admin = mongoose.model('Admin', adminSchema);
