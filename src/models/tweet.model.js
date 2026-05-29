import mongoose from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
const tweetSchema=mongoose.Schema(
    {
        owner:{
            type:mongoose.Schema.Types.ObjectId,ref:'User',required:true
        },
        content:{
            type:String, required:true
        },
        image:{
            type:String
        }
    },{
        timestamps:true
    }
)
tweetSchema.plugin(mongooseAggregatePaginate)
export const Tweet=mongoose.model('Tweet',tweetSchema);