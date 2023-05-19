import mongoose from "mongoose";

const assemblySchema = new mongoose.Schema({
    name: { type: String, required: true },
    assembly_no: { type: Number, required: true },
    members: { type: [String] }
})

export const Assembly = mongoose.model('Assembly', assemblySchema);
