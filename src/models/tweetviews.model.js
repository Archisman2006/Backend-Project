import mongoose, { Schema } from "mongoose";
const tweetViewSchema=mongoose.Schema(
    {
        viewer:{
            type:Schema.Types.ObjectId,ref:'User',required:true
        },
        tweet:{
            type:Schema.Types.ObjectId,ref:'Tweet',required:true
        }
    },{
        timestamps:true
    }
)
tweetViewSchema.index({ viewer: 1, video: 1 }, { unique: true });
export const TweetView=mongoose.model('TweetView',tweetViewSchema);