import mongoose from "mongoose";
import { asynchandler } from "../utils/asyncHandler.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

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
        channel:mongoose.Types.ObjectId(channelId),
        subscriber:mongoose.Types.ObjectId(req.user._id)
    });
    let newSubscription=null;
    if(!subscription) newSubscription= await Subscription.create({
        channel:mongoose.Types.ObjectId(channelId),
        subscriber:mongoose.Types.ObjectId(req.user._id)
    });
    else await Subscription.findByIdAndDelete(subscription._id);
    if(!subscription && !newSubscription) throw new ApiError(401,'Error while subscribing');
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
    if (channelId === req.user._id.toString()) {
        throw new ApiError(400, "You cannot subscribe to your own channel");
    }
    const pipeline=[
        {
            $match:{
                channel:mongoose.Types.ObjectId(channelId)
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
                            userName:1,
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
                            _id:0,
                            userName:1,
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
            $project:{
                _id:0,
                channel:1,
            }
        }
    ]
    const channels=await Subscription.aggregate(pipeline);
    return res.
    status(200)
    .json(
        new ApiResponse(200,channels,"Subscribed channels are successfully retrieved.")
    )
})
export {toggleSubscription,getChannelSubscribers,getSubscribedChannels}