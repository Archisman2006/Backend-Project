import mongoose from "mongoose";
import { asynchandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { Video } from "../models/video.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getChannelVideos=asynchandler(async (req,res)=>{
    const {channelId}=req.params;
    const {page,limit}=req.query;
    const parsedPage=Math.max(parseInt(page,10)|| 1,1)
    const parsedLimit=Math.min(Math.max(parseInt(limit,10) || 10,1),50)
    if(!mongoose.Types.ObjectId.isValid(channelId))
        throw new ApiError(400,"channel id is invalid")
    const channel=await User.findById(channelId);
    if(!channel) throw new ApiError(404,"Channel not found")
    const pipeline=[
        {
            $match:{
                owner:new mongoose.Types.ObjectId(channelId)
            }
        },{
            $lookup:{
                from:'users',
                localField:'owner',
                foreignField:'_id',
                as:'owner',
                pipeline:[
                    {
                        $project:{
                            userName:1,
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
                thumbnail:1,
                title:1,
                duration:1,
                views:1,
                owner:1
            }
        }
    ]
    const isOwner=(req.user?._id.toString()===channelId.toString());
    if(!isOwner) pipeline.push({$match:{isPublished:true}})
    const aggregate=Video.aggregate(pipeline);
    const videos=await Video.aggregatePaginate(aggregate,{
        page:parsedPage,limit:parsedLimit
    })
    return res.status(200).json(
        new ApiResponse(200,videos,"All videos are fetched")
    )
})
const getChannelStats=asynchandler(async (req,res)=>{
    const {channelId}=req.params;
    if(!mongoose.Types.ObjectId.isValid(channelId))
        throw new ApiError(400,"invalid channel id")
    // get channel total subscribers, total views, total likes, total videos posted
    const channel=await User.findById(channelId);
    if(!channel) throw new ApiError(404,"Channel not found")
    const pipeline=[
        {
            $match:{
                _id:new mongoose.Types.ObjectId(channelId)
            }
        },{
            $lookup:{
                from:'subscriptions',
                localField:'_id',
                foreignField:'channel',
                as:'subscribers',
            }
        },{
            $lookup:{
                from:'videos',
                localField:'_id',
                foreignField:'owner',
                as:'videos',
                pipeline:[
                    {
                        $lookup:{
                            from:'likes',
                            localField:'_id',
                            foreignField:'video',
                            as:'likes'
                        }
                    },{
                        $addFields:{
                            likes:{
                                $size:'$likes'
                            }
                        }
                    }
                ]
            }
        },{
            $addFields:{
                totalSubscribers:{
                    $size:'$subscribers'
                },
                totalViews:{
                    $sum:'$videos.views'
                },
                totalVideos:{
                    $size:'$videos'
                },
                totalLikes:{
                    $sum:'$videos.likes'
                }
            }
        },{
            $project:{
                userName:1,
                fullName:1,
                avatar:1,
                coverImage:1,
                totalSubscribers:1,
                totalLikes:1,
                totalViews:1,
                totalVideos:1
            }
        }
    ]
    const stats=await User.aggregate(pipeline);
    return res.status(200).json(
        new ApiResponse(200,stats,"channel statistics successfully retrieved")
    )
})
export {getChannelVideos,getChannelStats}
