import { Router } from "express";
import { VerifyJWT } from "../middlewares/auth.middleware.js";
import {toggleSubscription,getChannelSubscribers,
    getSubscribedChannels,getFeedVideos
} from '../controllers/subscription.controller.js'
const router=Router();
router.use(VerifyJWT)
router.route('/').get(getFeedVideos)
router.route('/subscribed-channels').get(getSubscribedChannels)
router.route('/:channelId')
.post(toggleSubscription)
.get(getChannelSubscribers)
export default router