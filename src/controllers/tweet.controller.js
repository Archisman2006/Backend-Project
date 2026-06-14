import mongoose from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asyncHandler.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { Like } from "../models/like.model.js";

const createTweet=asynchandler(async (req,res)=>{
    const {content}=req.body;
    const image_localPath=req?.file.path;
    if(!content) throw new ApiError(401,"empty content provided");
    const image=(image_localPath==null)?null:await uploadOnCloudinary(image_localPath);
    const tweet=await Tweet.create({owner:req.user._id,content,image:image?.url});
    if(!tweet) throw new ApiError(402,"Tweet could not be posted");
    return res.status(200).json(
        new ApiResponse(200,tweet,"Tweet successfully published")
    );
})
const viewTweet=asynchandler(async (req,res)=>{
    const {tweetId}=req.params;
        const pipeline=[
            {
                $match:{
                    _id:new mongoose.Types.ObjectId(tweetId)
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
                                _id:1,
                                username:1,
                                fullName:1,
                                avatar:1
                            }
                        }
                    ]
                }
            },{
                $addFields:{
                    owner:{$first:'$owner'}
                }
            },{
                $project:{
                    _id:1,
                    content:1,
                    image:1,
                    owner:1,
                    createdAt:1,
                    updatedAt:1,
                }
            }
        ]
        const [tweet]=await Tweet.aggregate(pipeline);
        const likesCount=await Like.countDocuments({tweet:tweetId});
        const isLikedByMe=(req.user?
            await Like.exists({owner:req.user._id,tweet:tweetId}):false);
        return res.status(200).json(
            new ApiResponse(200,{tweet,likesCount,isLikedByMe},"Tweet retrieved successfully")
        );
})
const getAllTweets=asynchandler(async (req,res)=>{
    const {page=1,limit=10,query,sortType="desc",userId}=req.query;
    const parsedPage=Math.max(parseInt(page,10)|| 1,1)
    const parsedLimit=Math.min(Math.max(parseInt(limit,10) || 10,1),50)
    const safeSortBy="createdAt";
    const safeSortOrder=String(sortType)?.toLowerCase()==="asc"?1:-1;
    const matchStage={};
    if(userId){
        if(mongoose.Types.ObjectId.isValid(userId)) {
            matchStage.owner = new mongoose.Types.ObjectId(userId);
        }
    }
    if(query && String(query).trim()){
        matchStage.content={$regex: String(query).trim(),$options:"i"};
    }
    const pipeline=[
        {$match:matchStage},
        {$sort:
            {[safeSortBy]:safeSortOrder}
        },{
            $lookup:{
                from:'users',
                localField:'owner',
                foreignField:'_id',
                as:'owner',
                pipeline:[
                    {
                        $project:{
                            username:1,
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
                content:1,
                image:1,
                owner:1,
            }
        }
    ]
    const aggregate=Tweet.aggregate(pipeline);
    const tweets=await Tweet.aggregatePaginate(
        aggregate,
        {page:parsedPage,limit:parsedLimit}
    );
    return res.status(200).json(
        new ApiResponse(200,tweets,"Tweets fetched successfully")
    )
})
const updateTweet=asynchandler(async (req,res)=>{
    const {tweetId}=req.params;
    if(!mongoose.Types.ObjectId.isValid(tweetId))
        throw new ApiError(400,"invalid tweet Id")
    const {content}=req.body;
    const updateData={content}
    if(req.file){
        const image=uploadOnCloudinary(req.file.path);
        if(!image) throw new ApiError(400,"New Image could not be uploaded to cloudinary");
        updateData.image=image.url;
    }
    else if(content==null) throw new ApiError(400,"Empty content and image provided");
    const tweet=await Tweet.findById(tweetId);
    if(!tweet) throw new ApiError(404,"tweet not found")
    const newTweet=await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set: updateData
        },{
            new:true
        }
    )
    if(req.file && tweet.image){
        await deleteFromCloudinary(tweet.image,'image')
    }
    return res.status(200).json(
        new ApiResponse(200,newTweet,"tweet updated successfully")
    )
})
const deleteTweet=asynchandler(async (req,res)=>{
    const {tweetId}=req.params;
    if(!mongoose.Types.ObjectId.isValid(tweetId))
        throw new ApiError(400,"invalid tweet Id")
    const tweet=await Tweet.findById(tweetId);
    if(!tweet) throw new ApiError(404,"tweet not found")
    if(req.user._id.toString() !== tweet.owner.toString())
        throw new ApiError(401,"UnAuthorised access")
    if(tweet.image)
        deleteFromCloudinary(tweet.image,'image')
    await Tweet.findByIdAndDelete(tweetId);
    return res.status(200).json(
        new ApiResponse(200,{},'Tweet successfully deleted')
    )
}) 
// TODO: add getTweetById controller
export {createTweet,getAllTweets,viewTweet,updateTweet,deleteTweet}