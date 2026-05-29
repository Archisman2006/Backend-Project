import { Router } from 'express'
import {createPlaylist,getPlaylistById,getAllPlaylists,addVideoToPlaylist,
removeVideoFromPlaylist,updatePlaylist,deletePlaylist} from '../controllers/playlist.controller.js'
import { VerifyJWT} from '../middlewares/auth.middleware.js'
const router=Router();
router.use(VerifyJWT);
router.route('/').post(createPlaylist).get(getAllPlaylists)
router.route('/:playlistId').get(getPlaylistById)
.patch(updatePlaylist).delete(deletePlaylist)
router.route('/:playlistId/:videoId')
.post(addVideoToPlaylist).delete(removeVideoFromPlaylist)
export default router;