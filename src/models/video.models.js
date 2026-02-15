import mongoose from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

const videoSchema=new mongoose.Schema(
    {
        videoFile:{
            type:String,required
        },
        thumbnail:{
            type:String,required
        },
        title:{
            type:String,required
        },
        description:{
            type:String,required
        },
        duration:{
            type:String,required
        },
        views:{
            type:Number,required, default:0
        },
        isPublished:{
            type:Boolean, required,default:1
        },
        owner:{
            type:mongoose.Schema.Types.ObjectId,ref:'User',required
        }
    },
    {timestamps}
)
videoSchema.plugin(mongooseAggregatePaginate)
export const Video=mongoose.model('Video',videoSchema);