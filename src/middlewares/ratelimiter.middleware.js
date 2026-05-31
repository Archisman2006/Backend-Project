import rateLimit from "express-rate-limit";
import { ApiError } from "../utils/ApiError.js";

export const VerificationResendLimiter=rateLimit({
    windowMs:15*60*1000,
    max:3,
    standardHeaders:true,
    legacyHeaders: false,
    handler: (req, res, next) => {
        throw new ApiError(429, "Too many resend attempts. Please try again after 15 minutes.");
    }
})