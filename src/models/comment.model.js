import mongoose from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { ApiError } from '../utils/ApiError.js';
const commentSchema=new mongoose.Schema(
    {
        content:{
            type: String,required:true
        },
        video:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'Video'
        },
        tweet:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'Tweet'
        },
        owner:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'User',required:true        
        },
        isEdited:{
            type:Boolean, required:true
        }
    },{
        timestamps:true
    }
)
commentSchema.pre("validate", function () {
    if (this.video && this.tweet) {
        throw new ApiError(400, "Comment must belong to either a video or a tweet, not both.");
    }
});
commentSchema.plugin(mongooseAggregatePaginate)
export const Comment=mongoose.model('Comment',commentSchema);