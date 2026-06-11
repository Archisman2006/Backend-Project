import mongoose from "mongoose";
import { asynchandler } from "../utils/asyncHandler.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";

const toggleSubscription=asynchandler(async (req,res)=>{
    const {channelId}=req.params
    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "Invalid channel id");
    }
    const channelExists = await User.exists({ _id: channelId });
    if (!channelExists) {
        throw new ApiError(404, "Channel not found");
    }
    if (channelId === req.user._id.toString()) {
        throw new ApiError(400, "You cannot subscribe to your own channel");
    }
    const subscription=await Subscription.findOne({
        channel:new mongoose.Types.ObjectId(channelId),
        subscriber:new mongoose.Types.ObjectId(req.user._id)
    });
    let newSubscription=null;
    if(!subscription) newSubscription= await Subscription.create({
        channel:new mongoose.Types.ObjectId(channelId),
        subscriber:new mongoose.Types.ObjectId(req.user._id)
    });
    else await Subscription.findByIdAndDelete(subscription._id);
    if(subscription^newSubscription===0) throw new ApiError(401,'Error while toggling subscription');
    return res
    .status(200)
    .json(
        new ApiResponse(200,(subscription)?null:newSubscription,(subscription)?"subscription removed":"subscription added")
    )
})
const getChannelSubscribers=asynchandler(async (req,res)=>{
    const {channelId}=req.params;
    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "Invalid channel id");
    }
    const channelExists = await User.exists({ _id: channelId });
    if (!channelExists) {
        throw new ApiError(404, "Channel not found");
    }
    const pipeline=[
        {
            $match:{
                channel:new mongoose.Types.ObjectId(channelId)
            }
        },{
            $lookup:{
                from:'users',
                localField:'subscriber',
                foreignField:'_id',
                as:'subscriber',
                pipeline:[
                    {
                        $project:{
                            fullName:1,
                            username:1,
                            avatar:1,
                        }
                    }
                ]
            }
        },{
            $addFields:{
                subscriber:{
                    $first:'$subscriber'
                }
            }
        },{
            $project:{
                _id:0,
                subscriber:1
            }
        }
    ]
    const subscribers=await Subscription.aggregate(pipeline);
    return res.
    status(200)
    .json(
        new ApiResponse(200,subscribers,"Subscribers fetched successfully")
    )
})
const getSubscribedChannels=asynchandler(async (req,res)=>{
    const {page=1,limit=20}=req.query;
    const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
    const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);
    const subscriberId=new mongoose.Types.ObjectId(req.user._id);
    const pipeline=[
        {
            $match:{
                subscriber:subscriberId
            }
        },{
            $lookup:{
                from:'users',
                localField:'channel',
                foreignField:'_id',
                as:'channel',
                pipeline:[
                    {
                        $project:{
                            _id:1,
                            username:1,
                            fullName:1,
                            avatar:1,
                        }
                    }
                ]
            }
        },{
            $addFields:{
                channel:{
                    $first:'$channel'
                }
            }
        },{
            $replaceRoot:{
                newRoot:'$channel'
            }
        }
    ]
    const aggregate=Subscription.aggregate(pipeline);
    const channels=await Subscription.aggregatePaginate(aggregate,{
        page:parsedPage,limit:parsedLimit
    });
    return res.
    status(200)
    .json(
        new ApiResponse(200,channels,"Subscribed channels are successfully retrieved.")
    )
})
const getFeedVideos=asynchandler(async (req,res)=>{
    const userId=new mongoose.Types.ObjectId(req.user._id);
    const {page=1,limit=20}=req.query;
    const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
    const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);
    const pipeline=[
        {
            $match:{
                subscriber:userId
            }
        },{
            $lookup:{
                from:'users',
                localField:'channel',
                foreignField:'_id',
                as:'channels',
                pipeline:[
                    {
                        $lookup:{
                            from:'videos',
                            localField:'_id',
                            foreignField:'owner',
                            as:'videos',
                            pipeline:[
                                {
                                    $project:{
                                        _id:1,
                                        videoFile:1,
                                        thumbnail:1,
                                        title:1,
                                        views:1,
                                        createdAt:1
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        },{
            $unwind:'$channels'
        },{
            $unwind:'$channels.videos'
        },{
            $replaceRoot:{
                newRoot:{
                    $mergeObjects:[
                        '$channels.videos',{
                            owner:{
                                username:'$channels.username',
                                fullName:'$channels.fullName',
                                avatar:'$channels.avatar'
                            }
                        }
                    ]
                }
            }
        }
    ];
    const aggregate=Subscription.aggregate(pipeline);
    const videos=await Subscription.aggregatePaginate(aggregate,{
        page:parsedPage,limit:parsedLimit
    })
    return res.status(200).json(
        new ApiResponse(200,videos,"Feed Videos retrieved Successfully")
    );
})
export {toggleSubscription,getChannelSubscribers,getSubscribedChannels,getFeedVideos}