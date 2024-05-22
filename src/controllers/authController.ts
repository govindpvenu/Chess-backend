import { Request, Response, json } from "express"
import asyncHandler from "express-async-handler"
import User from "../models/userModel"
import generateToken from "../utils/generateToken"
import generateOTP from "../utils/generateOTP"
import sendEmail from "../utils/sendEmail"

//*@route POST /api/auth/register
const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { username, email, password } = req.body

    const userExists = await User.findOne({ email })
    if (userExists) {
        res.status(400)
        throw new Error("User already exists")
    }

    const user = await User.create({
        username,
        email,
        password,
        verified: false,
    })

    if (!user) {
        res.status(400)
        throw new Error("Invalid user data")
    }

    generateToken(res, user._id.toString(), "user")

    const generatedOTP = generateOTP()

    await sendEmail(email, generatedOTP)
    res.status(200).json({
        _id: user._id,
        username: username,
        email: email,
        verified: false,
        profile: user?.profile,
        otp: generatedOTP,
    })
})

//*@route PATCH /api/auth/verify-otp
const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
    await User.updateOne({ email: req.body.email }, { verified: true })
    const user = await User.findOne({ email: req.body.email })

    res.status(200).json(
        user
        // _id: user?._id,
        // username: user?.username,
        // email: user?.email,
        // profile: user?.profile,
        // verified: user?.verified,
    )
})

//*@route POST /api/auth/resend-otp
const resendOtp = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body

    const user = await User.findOne({ email })
    const generatedOTP = generateOTP()

    await sendEmail(email, generatedOTP)
    res.status(200).json({
        _id: user?._id,
        username: user?.username,
        email: user?.email,
        otp: generatedOTP,
    })
})

//*@route POST /api/auth/login
const authUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (user && (await user.matchPassword(password))) {
        generateToken(res, user._id.toString(), "user")
        res.status(201).json(
            user
            // _id: user?._id,
            // username: user?.username,
            // email: user?.email,
            // profile: user?.profile,
            // verified: user?.verified,
        )
    } else {
        res.status(401)
        throw new Error("Invalid email or password")
    }
})

//*@route POST /api/auth/logout
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie("user", "", {
        httpOnly: true,
        expires: new Date(0),
    })
    res.status(200).json({ message: "User logged out" })
})

//*@route POST /api/auth/forget-password
const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body
    const user = await User.findOne({ email })
    console.log(user)
    if (!user) {
        res.status(400)
        throw new Error("No such user")
    }

    const generatedOTP = generateOTP()
    await sendEmail(email, generatedOTP)
    res.status(200).json({
        _id: user?._id,
        username: user?.username,
        email: user?.email,
        otp: generatedOTP,
    })
})

//*@route PATCH /api/auth/auth/reset-password
const resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body
    console.log(email, password)
    const user = await User.findOne({ email })
    console.log(user)

    if (!user) {
        res.status(400)
        throw new Error("No such user")
    }

    user.password = password
    const updatedUser = await user.save()
    console.log(updatedUser)

    res.status(200).json({
        _id: user?._id,
        username: user?.username,
        email: user?.email,
    })
})

//*@route GET /api/auth/auth/login/success
const googleSuccess = asyncHandler((req: Request, res: Response) => {
    const user: any = req.user
    if (user) {
        generateToken(res, user._id.toString(), "user")
        res.status(200).json({ user })
    }
})

//*@route GET /api/auth/auth/google/logout
const googleLogout = asyncHandler((req: Request, res: Response) => {
    req.logout((err) => {
        if (err) return res.status(500).send("Logout failed")
        res.redirect("http://localhost:3000/login")
    })
})

export { registerUser, authUser, verifyOtp, logoutUser, forgotPassword, resetPassword, resendOtp, googleLogout, googleSuccess }



















//*@route POST /api
//?@route POST /api

// const getUsers:RequestHandler = asyncHandler(async (req, res) => {
//
// })

// const users = await User.find()
// res.status(200).json(users)

// res.status(401)
// throw new Error("An unexpected error occured")

// try {
//
// } catch (error) {
//     console.error(error)
//     res.status(500).send("Internal Server Error")
// }
