import express from "express"
import { getMessages, sendMessage } from "../controllers/messageController"
import { protect } from "../middlewares/passportAuth"

const router = express.Router()

router.get("/:id", protect, getMessages)
router.post("/send/:id", protect, sendMessage)

export default router
