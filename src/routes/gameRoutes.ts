import express from "express"
import { updateWins } from "../controllers/gameController"
import { protect } from "../middlewares/passportAuth"

const router = express.Router()

router.patch("/update-wins", protect,updateWins)

export default router
