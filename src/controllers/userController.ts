import { Request, Response, json } from "express"
import asyncHandler from "express-async-handler"
import User from "../models/userModel"
import generateToken from "../utils/generateToken"
import generateOTP from "../utils/generateOTP"
import sendEmail from "../utils/sendEmail"

//*@route GET /api/users
const getUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await User.find()
    res.status(200).json(users)
})
    
//*@route POST /api/users/register
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
    console.log(generatedOTP)

    await sendEmail(email, generatedOTP)
    res.status(200).json({
        username: username,
        email: email,
        verified: false,
        otp: generatedOTP,
    })
})

//*@route POST /api/users/verify-otp
const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
    await User.updateOne({ email: req.body.email }, { verified: true })
    const user = await User.findOne({ email: req.body.email })

    res.status(200).json({
        username: user?.username,
        email: user?.email,
        verified: user?.verified,
    })
})

//*@route POST /api/users/login
const authUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (user && (await user.matchPassword(password))) {
        generateToken(res, user._id.toString(), "user")
        res.status(201).json({
            username: user?.username,
            email: user?.email,
            verified: user?.verified,
        })
    } else {
        res.status(401)
        throw new Error("Invalid email or password")
    }
})

//*@route POST /api/users/logout
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie("user", "", {
        httpOnly: true,
        expires: new Date(0),
    })
    res.status(200).json({ message: "User logged out" })
})

//*@route POST /api/users
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
        username: user?.username,
        email: user?.email,
        otp: generatedOTP,
    })
})

//*@route POST /api/users
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
        username: user?.username,
        email: user?.email,
    })
})

//*@route GET /api/users
const resendOtp = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body

    const user = await User.findOne({ email })
    const generatedOTP = generateOTP()

    await sendEmail(email, generatedOTP)
    res.status(200).json({
        username: user?.username,
        email: user?.email,
        otp: generatedOTP,
    })
})

export { getUsers, registerUser, authUser, verifyOtp, logoutUser, forgotPassword, resetPassword, resendOtp }

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
