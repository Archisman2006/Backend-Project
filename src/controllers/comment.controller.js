import mongoose from 'mongoose'
import { asynchandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js';
import { Video } from '../models/video.models.js';
import { Comment } from '../models/comment.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Tweet } from '../models/tweet.model.js';
const getVideoComments=asynchandler(async (req,res)=>{
    const { videoId } = req.params;
    const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc", userId } = req.query;
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video id");
    }
    const videoExists = await Video.exists({ _id: videoId });
    if (!videoExists) {
        throw new ApiError(404, "Video does not exist");
    }
    const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
    const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);

    const allowedSortFields = ["createdAt", "updatedAt", "likesCount"];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
    const safeSortOrder = String(sortType).toLowerCase() === "asc" ? 1 : -1;

    const matchStage = {
        video: new mongoose.Types.ObjectId(videoId)
    }
    if (query && String(query).trim()) {
        matchStage.content = { $regex: String(query).trim(), $options: "i" };
    }
    const pipeline=[
        { $match: matchStage },
        {
            $lookup:{
                from:'users',
                localField:'owner',
                foreignField:'_id',
                as:'owner',
                pipeline:[
                    {
                        $project:{
                            fullName:1,
                            userName:1,
                            avatar:1
                        }
                    }
                ]
            }
        },{
            $addFields:{
                owner:{
                    $first: "$owner"
                }
            }
        },{
            $lookup:{
                from:'likes',
                let:{commentId:'$_id'},
                pipeline:[
                    {
                        $match:{
                            $expr: {$eq:["$comment","$$commentId"]}
                        }
                    },{
                        $count:"count"
                    }
                ],
                as:"likesMeta"
            }
        },{
            $addFields:{
                likesCount:{
                    $ifNull:[{$first:"$likesMeta.count"},0]
                }
            }
        },{
            $sort:{
                [safeSortBy]:safeSortOrder
            }
        },{
            $project:{
                content:1,
                owner:1,
                isEdited:1,
                likesCount:1,
                createdAt:1,
                updatedAt:1
            }
        }
    ]
    const aggregate=mongoose.aggregate(pipeline);
    const comments= await Comment.aggregatePaginate(aggregate,{page:parsedPage,limit:parsedLimit})
    return res
    .status(200)
    .json(
        new ApiResponse(200,comments,"video comments fetched successfully")
    )
})  
const addVideoComment=asynchandler(async (req,res)=>{
    const {content}=req.body;
    const {videoId}=req.params;
    if(!content) throw new ApiError(400,"Comment body is required")
    if(!mongoose.Types.ObjectId.isValid(videoId)) 
        throw new ApiError(401,"video id is not valid")
    const videoExists=await Video.exists({_id:videoId});
    if(!videoExists) throw new ApiError(400,'video does not exists')
    const videoComment=await Comment.create({
        content,video:videoId,owner:req.user._id,isEdited:false
    })
    if(!videoComment) throw new ApiError(500,'Error while commenting on video.')
    return res
    .status(200)
    .json(
        new ApiResponse(200,videoComment,"Commented on video successfully")
    )
})
const updateVideoComment=asynchandler(async (req,res)=>{
    const {content}=req.body;
    const {commentId}=req.params;
    if(!content) throw new ApiError(400,"Comment body is required")
    if(!mongoose.Types.ObjectId.isValid(commentId)) 
        throw new ApiError(401,"comment id is not valid")
    const commentExists=await Comment.exists({_id:commentId});
    if(!commentExists) throw new ApiError(400,'comment does not exists')
    const videoComment=await Comment.findByIdAndUpdate(
        commentId,{
            $set:{
                content,isEdited:true
            }
        },{new:true}
    )
    if(!videoComment) throw new ApiError(500,"Error while updating comment on video")
    return res
    .status(200)
    .json(
        new ApiResponse(200,videoComment,"Comment updated successfully")
    )
})
const deleteVideoComment=asynchandler(async (req,res)=>{
    const {commentId}=req.params;
    if(!mongoose.Types.ObjectId.isValid(commentId)) 
        throw new ApiError(401,"comment id is not valid")
    const commentExists=await Comment.exists({_id:commentId});
    if(!commentExists) throw new ApiError(400,'comment does not exists')
    await Comment.findByIdAndDelete(commentId);
    return res
    .status(200)
    .json(
        new ApiResponse(200,{},"Comment deleted Successfully")
    )
})
const addTweetComment=asynchandler(async (req,res)=>{
    const {content}=req.body;
    const {tweetId}=req.params;
    if(!content) throw new ApiError(400,"Comment body is required")
    if(!mongoose.Types.ObjectId.isValid(tweetId)) 
        throw new ApiError(401,"tweet id is not valid")
    const tweetExists=await Tweet.exists({_id:tweetId});
    if(!tweetExists) throw new ApiError(400,'tweet does not exists')
    const tweetComment=await Comment.create({
        content,tweet:tweetId,owner:req.user._id,isEdited:false
    })
    if(!tweetComment) throw new ApiError(500,'Error while commenting on tweet.')
    return res
    .status(200)
    .json(
        new ApiResponse(200,tweetComment,"Commented on tweet successfully")
    )
})
const updateTweetComment=asynchandler(async (req,res)=>{
    const {content}=req.body;
    const {commentId}=req.params;
    if(!content) throw new ApiError(400,"Comment body is required")
    if(!mongoose.Types.ObjectId.isValid(commentId)) 
        throw new ApiError(401,"comment id is not valid")
    const commentExists=await Comment.exists({_id:commentId});
    if(!commentExists) throw new ApiError(400,'comment does not exists')
    const tweetComment=await Comment.findByIdAndUpdate(
        commentId,{
            $set:{
                content,isEdited:true
            }
        },{new:true}
    )
    if(!tweetComment) throw new ApiError(500,"Error while updating comment on tweet")
    return res
    .status(200)
    .json(
        new ApiResponse(200,tweetComment,"Comment updated successfully")
    )
})
const deleteTweetComment=asynchandler(async (req,res)=>{
    const {commentId}=req.params;
    if(!mongoose.Types.ObjectId.isValid(commentId)) 
        throw new ApiError(401,"comment id is not valid")
    const commentExists=await Comment.exists({_id:commentId});
    if(!commentExists) throw new ApiError(400,'comment does not exists')
    await Comment.findByIdAndDelete(commentId);
    return res
    .status(200)
    .json(
        new ApiResponse(200,{},"Comment deleted Successfully")
    )
})