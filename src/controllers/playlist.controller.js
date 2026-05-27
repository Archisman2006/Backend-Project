import mongoose from "mongoose";
import { asynchandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Video } from "../models/video.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Playlist } from "../models/playlist.model.js";

const createPlaylist=asynchandler(async (req,res)=>{
    const {name,description,visibility}=req.body;
    const videoId=req.params;
    if(!mongoose.Types.ObjectId.isValid(videoId))
        throw new ApiError(400,"Invalid video id");
    const video=Video.findById(videoId);
    if(!video)
        throw new ApiError(404,"Video not found");
    if(!name)
        throw new ApiError(400,"name is required");
    const playlist=await Playlist.create({owner:req.user._id,name,description,videos:[videoId],visibility})
    if(!playlist)
        throw new ApiError(400,"Playlist could not be created")
    return res.status(200).json(
        new ApiResponse(200,{video},"Playlist created Successfully")
    )
})
const getPlaylistById=asynchandler(async (req,res)=>{
    const {playlistId}=req.params;
    if(!mongoose.Types.ObjectId.isValid(playlistId))
        throw new ApiError(401,"playlist id is invalid")
    const playlist=await Playlist.findById(playlistId);
    if(!playlist)
        throw new ApiError(404,"playlist not found");
    return res.status(200).json(
        new ApiResponse(200,playlist,"playlist retrieved successfully")
    )
})
const getAllPlaylists=asynchandler(async (req,res)=>{
    const {page=1,limit=10,query,sortType="desc",userId}=req.query;
    const parsedPage=Math.max(parseInt(page,10)|| 1,1)
    const parsedLimit=Math.min(Math.max(parseInt(limit,10) || 10,1),50)
    const safeSortBy = "createdAt";
    const safeSortOrder = String(sortType).toLowerCase() === "asc" ? 1 : -1;
    const matchStage={};
    if (query && String(query).trim()) {
    matchStage.$or = [
        { name: { $regex: String(query).trim(), $options: "i" } },
        { description: { $regex: String(query).trim(), $options: "i" } },
    ];
    }
    if (userId) {
    if(mongoose.Types.ObjectId.isValid(userId)) {
        matchStage.owner = new mongoose.Types.ObjectId(userId);
        }
    }
    const pipeline=[
        {$match:matchStage},{
            $sort:{
                [safeSortBy]:safeSortOrder
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
                            userName:1,
                            avatar:1,
                            fullName:1
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
                name:1,
                owner:1,
                visibility:1,
                owner:1
            }
        }
    ]
    const aggregate=Playlist.aggregate(pipeline);
    const playlists=await Playlist.aggregatePaginate(aggregate,{
        page:parsedPage, limit:parsedLimit
    });
    return res.status(200).json(
        new ApiResponse(200,playlists,"Playlists retreived successfully")
    )
})
const addVideoToPlaylist=asynchandler(async (req,res)=>{
    const {videoId,playlistId}=req.body;
    if(!mongoose.Types.ObjectId.isValid(videoId))
        throw new ApiError(400,"Video id is invalid")
    if(!mongoose.Types.ObjectId.isValid(playlistId))
        throw new ApiError(400,"playlist id is invalid")
    const video=await Video.findById(videoId);
    const playlist=await Playlist.findById(playlistId);
    if(!video) throw new ApiError(404,"Video not found")
    if(!playlist) throw new ApiError(404,"playlist not found")
    if(playlist.videos.includes(videoId))
        throw new ApiError(400,"Video already in playlist")
    playlist.videos.push(videoId);
    const newPlaylist=await Playlist.findByIdAndUpdate(
        playlistId,
        {   
            $set:{
                videos:playlist.videos
            }
        },{
            new:true
        }
    )
    if(!newPlaylist) throw new ApiError(400,"Video could not be added");
    return res.status(200).json(
        new ApiResponse(200,newPlaylist,"Video added to playlist successfully")
    )
})
const removeVideoFromPlaylist=asynchandler(async (req,res)=>{
    const {videoId,playlistId}=req.params;
    if(!mongoose.Types.ObjectId.isValid(videoId))
        throw new ApiError(400,"Video id is invalid")
    if(!mongoose.Types.ObjectId.isValid(playlistId))
        throw new ApiError(400,"playlist id is invalid")
    const video=await Video.findById(videoId);
    const playlist=await Playlist.findById(playlistId);
    if(!video) throw new ApiError(404,"Video not found")
    if(!playlist) throw new ApiError(404,"playlist not found")
    if(!playlist.videos.includes(videoId))
        throw new ApiError(400,"Video not in playlist")
    const newPlaylist=await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set:{
                videos:playlist.videos.filter(item=>item!==videoId)
            }
        },{
            new:true
        }
    )
    if(!newPlaylist) throw new ApiError(400,"video could not be deleted")
    return res.status(200).json(
        new ApiResponse(200,newPlaylist,"Video removed from playlist successfully")
    )
})
const updatePlaylist=asynchandler(async (req,res)=>{
    const {name,description}=req.body;
    const {playlistId}=req.params;
    if(!mongoose.Types.ObjectId.isValid(playlistId))
        throw new ApiError(400,"playlist id is invalid")
    const playlist=await Playlist.findById(playlistId);
    if(!playlist) throw new ApiError(404,"playlist not found")
    if(!name) throw new ApiError(401,"Name is required")
    const newPlaylist=await Playlist.findByIdAndUpdate(
    playlistId,{
        $set:{
            name,description
        }
    },{new:true}
    )
    if(!newPlaylist) throw new ApiError(400,"Playlist could not be updated")
    return res.status(200).json(
        new ApiResponse(401,newPlaylist,"Playlist updated successfully")
    )
})
const deletePlaylist=asynchandler(async (req,res)=>{
    const {playlistId}=req.params;
    if(!mongoose.Types.ObjectId.isValid(playlistId))
        throw new ApiError(400,"playlist id is invalid")
    const playlist=await Playlist.findById(playlistId);
    if(!playlist) throw new ApiError(404,"playlist not found")
    await Playlist.findByIdAndDelete(playlistId);
    return res.status(200).json(
        new ApiResponse(200,{},"Playlist deleted successfully")
    )
})
export {createPlaylist,getPlaylistById,getAllPlaylists,addVideoToPlaylist,
removeVideoFromPlaylist,updatePlaylist,deletePlaylist
}
