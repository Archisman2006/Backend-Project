import { User } from "../models/user.models";
import { ApiError } from "../utils/ApiError";
import { asynchandler } from "../utils/asyncHandler";
import jwt from 'jsonwebtoken'
export const VerifyJWT=asynchandler(async (req,res,next)=>{
    try{
        const token=
    req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
    console.log(token);
    if(!token){
        throw new ApiError(401,"UnAuthorised Error");
    }
    const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    const user= await User.findById(decodedToken).select("-password -RefreshToken")
    if(!user){
        throw new ApiError(401,"Invalid Access Token");
    }
    req.user=user;
    next();
    }
    catch(error){
        throw new ApiError(401,error?.message || "Access Token invalid");
    }
});
