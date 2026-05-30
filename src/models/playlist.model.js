import mongoose from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
const playlistSchema=mongoose.Schema(
    {
        name:{
            type:String, required:true 
        },
        description:{
            type:String, required: true
        },
        videos:[{
            type:mongoose.Schema.Types.ObjectId ,ref:'Video'
        }],
        owner:{
            type:mongoose.Schema.Types.ObjectId, ref:'User' ,required:true
        },
        visibility:{
            type:String,
            enum:['public','private','unlisted'],
            default:'private',
            lowercase:true,
        }
    },{
        timestamps:true
    }
)
playlistSchema.plugin(mongooseAggregatePaginate)
export const Playlist=mongoose.model('Playlist',playlistSchema);