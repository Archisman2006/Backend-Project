import { Router } from "express";
import { VerifyJWT } from "../middlewares/auth.middleware.js";
import {toggleSubscription,getChannelSubscribers,
    getSubscribedChannels
} from '../controllers/subscription.controller.js'
const router=Router();
router.use(VerifyJWT)
router.route('/:channelId')
.post(toggleSubscription)
.get(getChannelSubscribers)
router.route('/:subscriberId').get(getSubscribedChannels)
export default router