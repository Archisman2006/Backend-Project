import mongoose from 'mongoose'
import {Video} from '../models/video.models.js'
import {User} from '../models/user.models.js'
import { asynchandler } from '../utils/asyncHandler.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import {ApiError} from '../utils/ApiError.js'
import { deleteFromCloudinary, uploadOnCloudinary } from '../utils/cloudinary.js'
const getAllVideos=asynchandler(async (req,res)=>{
    const {page=1,limit=10,query,sortBy="createdAt",sortType="desc",userId}=req.query;
    const parsedPage=Math.max(parseInt(page,10)|| 1,1)
    const parsedLimit=Math.min(Math.max(parseInt(limit,10) || 10,1),50)
    
    const allowedSortFields = ["createdAt", "views", "title", "duration"];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
    const safeSortOrder = String(sortType).toLowerCase() === "asc" ? 1 : -1;

    const matchStage = { isPublished: true };
    if (query && String(query).trim()) {
    matchStage.$or = [
        { title: { $regex: String(query).trim(), $options: "i" } },
        { description: { $regex: String(query).trim(), $options: "i" } },
    ];
    }
    if (userId) {
    if(mongoose.Types.ObjectId.isValid(userId)) {
        matchStage.owner = new mongoose.Types.ObjectId(userId);
        }
    }

    const pipeline=[
        {$match:matchStage},
        {$sort:{
            [safeSortBy]:safeSortOrder
        }},{
            $lookup:{
                from:'users',
                localField:'owner',
                foreignField:'_id',
                as:'owner',
                pipeline:[
                    {
                        $project:{
                            _id:1,
                            fullName:1,
                            userName:1,
                            avatar:1,
                        }
                    }
                ]
            }
        },
        {
            $addFields:{
                owner:{
                    $first:'$owner'
                }
            }
        },
        {
            $project:{
                videoFile:1,
                thumbnail:1,
                title:1,
                description:1,
                duration:1,
                views:1,
                isPublished:1,
                owner:1,
                createdAt:1,
            }
        }
    ]
    const aggregate = Video.aggregate(pipeline);
    const videos = await Video.aggregatePaginate(aggregate, {
    page: parsedPage,
    limit: parsedLimit,
    });
    return res
    .status(200)
    .json(
        new ApiResponse(200,videos,'Videos fetched successfully')
    )
})
const publishVideo=asynchandler(async (req,res)=>{
    const {title,description}=req.body;
    if(!title) throw new ApiError(400,"Title is required");
    const videoFile_localpath=req.files?.videoFile?.[0]?.path
    if(!videoFile_localpath) throw new ApiError(401,"Video File is Missing");
    const videoFile=await uploadOnCloudinary(videoFile_localpath);
    if(!videoFile) throw new ApiError(401,'video file could not be uploaded.');
    const thumbnail_localpath=null;
    if(req.files && Array.isArray(req.files.thumbnail) && req.files.thumbnail.length>0)
        thumbnail_localpath=req.files?.thumbnail?.[0]?.path;
    const thumbnail=(thumbnail_localpath==null)?null:await uploadOnCloudinary(thumbnail_localpath);
    const video= await Video.create({videoFile:videoFile.url,thumbnail,title,description,duration:videoFile.duration,owner:new mongoose.Types.ObjectId(req.user._id)});
    if(!video) throw new ApiError(400,'Video Upload Failed.');
    return res.
    status(200)
    .json(
        new ApiResponse(200,video,"video uploaded successfully")
    )
})
const getVideoByID=asynchandler(async (req,res)=>{
    const {videoId}=req.params;
    if(!mongoose.Types.ObjectId.isValid(videoId))
        throw new ApiError(400, "Invalid video ID");
    const video=await Video.findById(videoId);
    if(!video) throw new ApiError(400,"This Video Isn't Available");
    return res
    .status(200)
    .json(
        new ApiResponse(200,video,"Video fetched successfully")
    )
})
const updateVideo=asynchandler(async (req,res)=>{
    const {videoId}=req.params;
    const {title,description,isPublished}=req.body;
    const updateData = { title, description, isPublished };
    if(req.file){
        const thumbnail=await uploadOnCloudinary(req.file.path)
        if(!thumbnail) throw new ApiError(401,"Thumbnail upload failed")
        updateData.thumbnail=thumbnail.url
    }
    if(!title) throw new ApiError(401,"title is required")
    const video=await Video.findByIdAndUpdate(
        {
            videoId
        },{
            $set:updateData
        },{
            new:true
        }
    )
    return res
    .status(200)
    .json(
        new ApiResponse(200,video,"Video details updated successfully")
    )
})
const deleteVideo=asynchandler(async (req,res)=>{
    const {videoId}=req.params;
    if(!mongoose.Types.ObjectId.isValid(videoId))
        throw new ApiError(400, "Invalid video ID");
    const video=await Video.findById(videoId)
    if(!video) throw new ApiError(404,"video not found");
    if(video.owner.toString() !== req.user._id.toString())
        throw new ApiError(403,'UnAuthorised to Proceed')
    await deleteFromCloudinary(video.videoFile,"video");
    if(video.thumbnail){
        await deleteFromCloudinary(video.thumbnail,"image")
    }
    await Video.findByIdAndDelete(videoId);
    return res
    .status(200)
    .json(
        new ApiResponse(200,{},"Video Deleted Successfully")
    )
})

export {getAllVideos,publishVideo,getVideoByID,updateVideo};