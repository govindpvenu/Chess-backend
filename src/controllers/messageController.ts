import asyncHandler from "express-async-handler"
import { Request, Response, json } from "express"
import Message from "../models/messageModel"
import Conversation from "../models/conversationModel"
import { getReceiverSocketId, io } from "../server"

//*@route POST /api/messages/send/:id
const sendMessage = asyncHandler(async (req, res) => {
    try {
        const { message } = req.body
        console.log(req.body)
        const { id: receiverId } = req.params
        const senderId = (req.user as any)._id
        console.log(receiverId, senderId)

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        })

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            })
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        })

        if (newMessage) {
            conversation.messages.push(newMessage._id)
        }

        // this will run in parallel
        await Promise.all([conversation.save(), newMessage.save()])

        // SOCKET IO FUNCTIONALITY WILL GO HERE
        const receiverSocketId = getReceiverSocketId(receiverId)
        if (receiverSocketId) {
            console.log("reveiving:",receiverSocketId)

            // io.to(<socket_id>).emit() used to send events to specific client
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }

        res.status(201).json(newMessage)
    } catch (error: any) {
        console.log("Error in sendMessage controller: ", error.message)
        res.status(500).json({ error: "Internal server error" })
    }
})

//*@route GET /api/messages/:id
const getMessages = async (req: Request, res: Response) => {
    try {
        const { id: userToChatId } = req.params
        const senderId = (req.user as any)._id
        console.log(senderId, userToChatId)

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] },
        }).populate("messages") // NOT REFERENCE BUT ACTUAL MESSAGES(return array of messages)
        console.log({ conversation })
        if (!conversation) return res.status(200).json([])

        const messages = conversation.messages
        console.log({ messages })
        res.status(200).json(messages)
    } catch (error: any) {
        console.log("Error in getMessages controller: ", error.message)
        res.status(500).json({ error: "Internal server error" })
    }
}

export { getMessages, sendMessage }
