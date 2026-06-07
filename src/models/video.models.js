import mongoose from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

const videoSchema=new mongoose.Schema(
    {
        videoFile:{
            type:String,required:true
        },
        streamingUrl: {
        type: String, // Store the .m3u8 url
        },
        thumbnail:{
            type:String
        },
        title:{
            type:String,required:true
        },
        description:{
            type:String
        },
        duration:{
            type:Number,required:true
        },
        views:{
            type:Number,required:true, default:0
        },
        isPublished:{
            type:Boolean, required:true,default:true
        },
        owner:{
            type:mongoose.Schema.Types.ObjectId,ref:'User',required:true
        }
    },
    {timestamps:true}
)
videoSchema.plugin(mongooseAggregatePaginate)
export const Video=mongoose.model('Video',videoSchema);