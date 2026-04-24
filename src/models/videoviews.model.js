import mongoose,{Schema} from "mongoose";

const videoViewSchema=mongoose.Schema({
    viewer:{
        type:Schema.Types.ObjectId,ref:'User', required:true
    },
    video:{
        type:Schema.Types.ObjectId,ref:'Video', required:true
    }
},{
    timestamps:true
})
videoViewSchema.index({ viewer: 1, video: 1 }, { unique: true });
export const VideoView= mongoose.model('VideoView',videoViewSchema)