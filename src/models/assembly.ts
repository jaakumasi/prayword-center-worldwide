import mongoose from "mongoose";

const assemblySchema = new mongoose.Schema({
    name: { type: String, required: true },
    leaders: {type: [String]},
    assembly_no: { type: String, required: true },
    members: { type: [String] }
})

export const Assembly = mongoose.model('Assembly', assemblySchema);
