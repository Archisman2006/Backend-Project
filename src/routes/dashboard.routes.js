import {getChannelVideos,getChannelStats,getChannelTweets,getChannelPlaylists}
from '../controllers/dashboard.controller.js'
import { Router } from 'express'
import { OptionalVerifyJWT, VerifyJWT } from '../middlewares/auth.middleware.js'
const router=Router();
router.use(OptionalVerifyJWT)
router.route('/:channelId').get(getChannelStats)
router.route('/videos/:username').get(getChannelVideos)
router.route('/tweets/:username').get(getChannelTweets)
router.route('/playlists/:username').get(getChannelPlaylists)
export default router