import mongoose from "mongoose";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asyncHandler.js";
import { Tweet } from "../models/tweet.model.js";
import { Comment } from "../models/comment.model.js";

const toggleVideoLike= asynchandler(async (req,res)=>{
    const {videoId}=req.params;
    if(!mongoose.Types.ObjectId.isValid(videoId))
        throw new ApiError(402,"invalid video id")
    const video=await Video.findById(videoId);
    if(!video) throw new ApiError(404,"video not found")
    const like=await Like.findOne({
        owner:req.user._id,
        video:videoId
    })
    if(like){
        await Like.findByIdAndDelete(like._id);
        return res.status(200).json(
            new ApiResponse(200,{},"like removed successfully")
        )
    }
    else{
        const newLike=await Like.create({owner:req.user._id,video:videoId});
        return res.status(200).json(
            new ApiResponse(200,newLike,"like added successfully")
        )
    }
})
const toggleTweetLike=asynchandler(async (req,res)=>{
    const {tweetId}=req.params
    if(!mongoose.Types.ObjectId.isValid(tweetId))
        throw new ApiError(402,"invalid tweet id")
    const tweet=await Tweet.findById(tweetId);
    if(!tweet) throw new ApiError(404,"tweet not found")
    const like=await Like.findOne({
        owner:req.user._id,
        tweet:tweetId
    })
    if(like){
        await Like.findByIdAndDelete(like._id);
        return res.status(200).json(
            new ApiResponse(200,{},"like removed successfully")
        )
    }
    else{
        const newLike=await Like.create({owner:req.user._id,tweet:tweetId});
        return res.status(200).json(
            new ApiResponse(200,newLike,"like added successfully")
        )
    }
})
const toggleCommentLike=asynchandler(async (req,res)=>{
    const {commentId}=req.params
    if(!mongoose.Types.ObjectId.isValid(commentId))
        throw new ApiError(402,"invalid comment id")
    const comment=await Comment.findById(commentId);
    if(!comment) throw new ApiError(404,"comment not found")
    const like=await Like.findOne({
        owner:req.user._id,
        comment:commentId
    })
    if(like){
        await Like.findByIdAndDelete(like._id);
        return res.status(200).json(
            new ApiResponse(200,{},"like removed successfully")
        )
    }
    else{
        const newLike=await Like.create({owner:req.user._id,comment:commentId});
        return res.status(200).json(
            new ApiResponse(200,newLike,"like added successfully")
        )
    }
})
const getLikedVideos=asynchandler(async (req,res)=>{
    const {page=1,limit=15}=req.query;
    const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
    const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);
    const pipeline= [
        {
            $match:{
                owner: req.user._id
            }
        },{
            $lookup:{
                from:'videos',
                localField:'video',
                foreignField:'_id',
                as:'video',
                pipeline:[
                    {
                        $lookup:{
                            from:'users',
                            localField:'owner',
                            foreignField:'_id',
                            as:'owner',
                            pipeline:[
                                {
                                    $project:{
                                        username:1,
                                        fullName:1,
                                        avatar:1
                                    }
                                }
                            ]
                        }
                    },{
                        $addFields:{
                            owner:{
                                $first:'$owner'
                            }
                        }
                    },{
                        $project:{
                            videoFile:1,
                            streamingUrl:1,
                            thumbnail:1,
                            title:1,
                            description:1,
                            views:1,
                            owner:1
                        }
                    }
                ]
            }
        },{
            $addFields:{
                video:{
                    $first:'$video'
                }
            }
        },{
            $project:{
                video:1
            }
        }
    ]
    const aggregate=Like.aggregate(pipeline);
    const likedVideos=await Like.aggregatePaginate(aggregate,{
        page:parsedPage,limit:parsedLimit
    });
    return res.status(200).json(
        new ApiResponse(200,likedVideos,"liked videos retrieved successfully")
    )
}) 
export {toggleVideoLike,toggleTweetLike,toggleCommentLike}