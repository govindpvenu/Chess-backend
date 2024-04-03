import { Request, Response, json } from "express"
import asyncHandler from "express-async-handler"
import User from "../models/userModel"

//*@route PATCH /api/user/verify-otp
const updateWins = asyncHandler(async (req: Request, res: Response) => {
    await User.updateOne({ email: req.body.email }, { $inc: { wins: 1, rating: 10 } })
    res.status(200).json({ message: "success" })
})

export { updateWins }
