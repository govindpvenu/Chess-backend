import { Request, Response, json } from "express"
import asyncHandler from "express-async-handler"
import User from "../models/userModel"

//*@route GET /api/user/get-users
const getUsersForRanking = asyncHandler(async (req, res) => {
    const users = await User.find().sort({ rating: -1 });
    res.status(200).json(users)
})

//*@route GET /api/user/get-users
 const getUsersForSidebar = async (req: Request, res: Response) => {
	try {
		const loggedInUserId =  (req.user as any)._id;

		const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

		res.status(200).json(filteredUsers);
	} catch (error:any) {
		console.error("Error in getUsersForSidebar: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export { getUsersForRanking, getUsersForSidebar }
