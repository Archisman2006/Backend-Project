import mongoose, { Schema } from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
const SubscriptionSchema=new Schema(
    {
        subscriber:{
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        channel:{
            type:Schema.Types.ObjectId,
            ref:"User"
        }

    },{
        timestamps:true
    }
)
SubscriptionSchema.plugin(mongooseAggregatePaginate)
export const Subscription=mongoose.model("Subscription",SubscriptionSchema);