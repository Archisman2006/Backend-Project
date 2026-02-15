import mongoose from "mongoose";
import { db_name } from "../constants.js";
export const connectDB=async ()=>{
    try {
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${db_name}`);
        console.log("\nMONGODB Connected Successfully DB-HOST: "+connectionInstance.connection.host);
    } catch (error) {
        console.log("\nMONGODB connection error."); process.exit(1);
    }
}