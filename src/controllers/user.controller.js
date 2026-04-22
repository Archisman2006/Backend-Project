import {asynchandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/user.models.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import jwt from 'jsonwebtoken'
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
})
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
})
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
})
const refreshAccessToken=asynchandler((req,res)=>{
    const incomingRefreshToken=req.cookies.refreshToken || req.body.refreshToken;
    if(!incomingRefreshToken){
        throw new ApiError(401,"Unauthorized Access Denied");
    }
    const decodedToken=jwt.verify(incomingRefreshToken,REFRESH_TOKEN_SECRET);
    const user=await User.findById(decodedToken?._id);
    if(!user){
        throw new ApiError(400,"Invalid refresh token");
    }
    if(incomingRefreshToken !==user?.refreshToken){
        throw new ApiError(401,"Refresh token expired");
    }
    const {accessToken,refreshToken}=await getAccessAndRefreshTokens(user._id,user);
    const options={
        httpOnly:true,
        secure:true
    }
    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {accessToken,refreshToken},
            "Session restored successfully."
        )
    )
})
const changeCurrentPassword=asynchandler((req,res)=>{
    const {oldPassword,newPassword}=req.body;
    const user=await User.findById(req.user._id);
    const isPasswordCorrect=user.isPasswordCorrect(oldPassword)
    if(!isPasswordCorrect){
        throw new ApiError(400,"Password is wrong");
    }
    user.password=newPassword;
    user.save({validateBeforeSave:false});
    return res.status(200)
    .json(new ApiResponse(
        200,{},"Password Changed successfully."
    ));
})
const getCurrentUser=asynchandler(async (req,res)=>{
    return res.status(200)
    .json(
        new ApiResponse(
            200,{   
                user:req.user
            },"Current user retrieved"
        )
    )
})
const updateAccountDetails=asynchandler(async (req,res)=>{
    const {userName,email,fullName}=req.body;
    if([userName,email,fullName].some((i)=>i?.trim()==="")) 
        throw new ApiError(400,"All fields are Required");
    const user=await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{userName,email,fullName}
        },
        {new:true}
    ).select("-password -refreshToken")
    return res.status(200)
    .json(
        new ApiResponse(
            200,{user},"details updated successfully."
        )
    )
})
const updateAvatar=asynchandler(async (req,res)=>{
    const localpath=req.file?.path;
    if(!localpath) throw new ApiError(400,"File path is required");
    const avatar=await uploadOnCloudinary(localpath);
    if(!avatar) throw new ApiError(400,"avatar is invalid");
    const user=await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{avatar:avatar.url}
        },
        {new:true}
    ).select("-password -refreshToken")

    return res.status(200)
    .json(
        new ApiResponse(200,{user},"Avatar updated successfully")
    )
})
const updateCoverImage=asynchandler(async (req,res)=>{
    const localpath=req.file?.path;
    if(!localpath) throw new ApiError(400,"file path is required")
    const coverImage=await uploadOnCloudinary(localpath);
    if(!coverImage) throw new ApiError(400,"cover image is invalid");
    const user=await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{coverImage}
        },
        {new:true}
    ).select("-password -refreshToken")
    return res.status(200)
    .json(
        new ApiResponse(200,{user},"Cover image updated Successfully")
    )
})
const getChannelProfile=asynchandler(async (req,res)=>{
    const {userName}=req.params
    if(!userName) throw new ApiError(401,"Username not provided");
    const channel=await User.aggregate({
        $match:{userName:userName}
    },{
        $lookup:{
            from:'subscriptions',
            localField:'_id',
            foreignField:'channel',
            as:'subscribers'
        }
    },{
        $lookup:{
            from:'subscriptions',
            localField:'_id',
            foreignField:'subscriber',
            as:'subscribedTo'
        }
    },{
        $addFields:{
            subscribersCount:{
                $size: "$subscribers"
            },
            subscribedToCount:{
                $size:"$subscribedTo"
            },
            isSubscribed:{
                $cond: {
                    if:{$in:[req.user._id,'$subscribers.subscriber']},
                    then:true,else:false
                }
            }
        }
    },{
        $project:{
            userName:1,
            fullName:1,
            avatar:1,
            coverImage:1,
            subscribersCount:1,
            subscribedToCount:1,
            isSubscribed:1
        }
    }
);
})

export {registerUser,loginUser,logoutUser,refreshAccessToken,
    changeCurrentPassword,getCurrentUser,updateAccountDetails,updateAvatar,
    updateCoverImage,getChannelProfile
}