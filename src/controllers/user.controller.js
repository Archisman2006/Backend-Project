import {asynchandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/user.models.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js'
const getAccessAndRefreshTokens=async (userid,user)=>{
    //const user=User.findById(userid);
    const accessToken=user.generateAccessToken();
    const refreshToken=user.generateRefreshToken();
    user.refreshToken=refreshToken;
    await user.save({validateBeforeSave:false});
    return {accessToken,refreshToken};
}
const registerUser=asynchandler(async (req,res)=>{
    console.log(req.body); console.log("Jadavpur");
    console.log(req.files);
    const body = req.body || {};
    // get user details from frontend
    const {userName,email,fullName,password}=body
    console.log("email: "+email);
    //validation
    if([userName,email,fullName].some((i)=>i?.trim()==="")) throw new ApiError(400,"All fields are Required");
    //check if user already exists
    const userExists=await User.findOne({
        $or:[{userName},{email}]
    })
    if(userExists) throw new ApiError(409,"User Already Exists");
    //check for images,avatar
    const avatar_localpath=req.files?.avatar?.[0]?.path; 
    //console.log(avatar_localpath);
    let coverImage_localpath=null;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
        coverImage_localpath=req.files.coverImage[0].path;
    }
    if(!avatar_localpath) throw new ApiError(400,"Avatar is required");
    //upload to cloudinary
    const avatar=await uploadOnCloudinary(avatar_localpath);
    const coverImage=(coverImage_localpath==null)?null:await uploadOnCloudinary(coverImage_localpath);
    if(!avatar) throw new ApiError(400,"Avatar is required. 111");
    //create user object
    const user=await User.create({fullName,avatar:avatar.url,coverImage:coverImage?.url||"",email,password,userName:userName.toLowerCase()});
    //remove password and refresh token field from response
    //console.log(User);
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
const loginUser=asynchandler(async (req,res)=>{
    // get data from req.body
    const {email,userName,password}=req.body;
    if(!email && !userName) throw new ApiError(400,"Either email or username is required");
    const user=await User.findOne({$or:[{email},{userName}]});
    //validate if user exists
    if(!user) throw new ApiError(404,"User Doesn't exist");
    //check if password is correct
    const valid=await user.isPasswordCorrect(password);
    if(!valid) throw new ApiError(401,"Password is Invalid");
    //generate access and refresh token
    const {accessToken,refreshToken}=await getAccessAndRefreshTokens(user._id,user);
    const loggedInUser=await User.findById(user._id)
    .select("-password -refreshToken");
    const options={
        httpOnly: true,secure:true
    };
    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user:loggedInUser
            },
            "User logged in Successfully"
        )
    )
});
const logoutUser=asynchandler(async (req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            },
        },
        {
            new:true
        }
    )
    const options={
        httpOnly:true,
        secure:true
    }
    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(
        200,{},"User Logged Out"
    ))
});
export {registerUser,loginUser,logoutUser}