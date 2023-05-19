import mongoose from "mongoose";
import { MONGO_URL, NODE_ENV } from "./constants";

export const dbConnect = async () => {
    await mongoose.connect(process.env[MONGO_URL]!);
    process.env[NODE_ENV] === "development" ? console.log("connected to mongoodb"): ""
}
