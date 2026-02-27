import {asynchandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/user.models.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js'
const registerUser=asynchandler(async (req,res)=>{
    // get user details from frontend
    const {userName,email,fullName,password}=req.body
    console.log("email: "+email);
    //validation
    if([userName,email,fullName].some((i)=>i?.trim()==="")) throw new ApiError(400,"All fields are Required");
    //check if user already exists
    const userExists=User.findOne({
        $or:[{userName},{email}]
    })
    if(userExists) throw new ApiError(409,"User Already Exists");
    //check for images,avatar
    const avatar_localpath=req.files?.avatar[0]?.path;
    const coverImage_localpath=req.files?.coverImage[0]?.path;
    if(!avatar_localpath) throw new ApiError(400,"Avatar is required");
    //upload to cloudinary
    const avatar=await uploadOnCloudinary(avatar_localpath);
    const coverImage=await uploadOnCloudinary(coverImage_localpath);
    if(!avatar) throw new ApiError(400,"Avatar is required");
    //create user object
    const user=User.create({fullName,avatar:avatar.url,coverImage:coverImage?.url||"",email,password,userName:userName.toLowerCase()});
    //remove password and refresh token field from response
    const createdUser=await User.findById(user._id).select("-password -refreshToken");
    //check for user creation
    if(!createdUser){
        throw new ApiError(500,"User Registration failed");
    }
    //return res
    return res.status(201).json(
        new ApiResponse(200,createdUser,"User created Successfully")
    )
});
export {registerUser}