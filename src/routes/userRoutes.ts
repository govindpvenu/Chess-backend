import express from "express"
import { getUsers, registerUser, authUser, verifyOtp, logoutUser, forgotPassword, resetPassword, resendOtp } from "../controllers/userController"
import { protect } from "../middlewares/passportAuth"
import passport from "passport"

const router = express.Router()

router.get("/get-users", protect, getUsers)
router.post("/register", registerUser)
router.patch("/verify-otp", verifyOtp)
router.post("/resend-otp", resendOtp)
router.post("/login", authUser)
router.post("/logout", logoutUser)
router.post("/forget-password", forgotPassword)
router.patch("/reset-password", resetPassword)

export default router
