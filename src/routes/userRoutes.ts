import express from "express"
import { getUsersForRanking, getUsersForSidebar } from "../controllers/userController"
import { protect } from "../middlewares/passportAuth"

const router = express.Router()

router.get("/get-all-users", protect, getUsersForRanking)
router.get("/get-other-users", protect, getUsersForSidebar)

export default router
