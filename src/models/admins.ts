import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    password: { type: String, required: true },
    member_id: { type: String, required: true },
    is_superadmin: { type: Boolean, required: true, default: false }
})

export const Admin = mongoose.model('Admin', adminSchema);
