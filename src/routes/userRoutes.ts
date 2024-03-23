import express from "express"
import { getUsers, registerUser, authUser, verifyOtp, logoutUser, forgotPassword, resetPassword, resendOtp, googleLogout, googleSuccess } from "../controllers/userController"
import { protect } from "../middlewares/passportAuth"
import passport from "passport"

const router = express.Router()

router.post("/register", registerUser)
router.patch("/verify-otp", verifyOtp)
router.post("/resend-otp", resendOtp)
router.post("/login", authUser)
router.post("/logout", logoutUser)
router.post("/forget-password", forgotPassword)
router.patch("/reset-password", resetPassword)
router.get("/get-users", protect, getUsers)
//Google Authentication
router.get("/auth/google", passport.authenticate("google", { scope: ["email", "profile"] }))
router.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "http://localhost:3000/login", successRedirect: "http://localhost:3000/" }))
router.get("/auth/google/logout", googleLogout)
router.get("/auth/login/success", googleSuccess)

export default router
