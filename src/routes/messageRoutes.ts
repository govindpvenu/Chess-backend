import express from "express"
import { getMessages, sendMessage } from "../controllers/messageController"
import { protect } from "../middlewares/passportAuth"

const router = express.Router()

router.post("/send/:id", protect, sendMessage)
router.get("/:id", protect, getMessages)

export default router
