import { Router } from 'express'
import {createPlaylist,getPlaylistById,getAllPlaylists,addVideoToPlaylist,
removeVideoFromPlaylist,updatePlaylist,deletePlaylist} from '../controllers/playlist.controller.js'
import { OptionalVerifyJWT, VerifyJWT} from '../middlewares/auth.middleware.js'
const router=Router();
router.route('/').post(VerifyJWT,createPlaylist).get(OptionalVerifyJWT,getAllPlaylists)
router.route('/:playlistId').get(OptionalVerifyJWT,getPlaylistById)
.patch(VerifyJWT,updatePlaylist).delete(VerifyJWT,deletePlaylist)
router.route('/:playlistId/:videoId')
.post(VerifyJWT,addVideoToPlaylist).delete(VerifyJWT,removeVideoFromPlaylist)
export default router;