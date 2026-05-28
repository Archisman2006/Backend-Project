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
