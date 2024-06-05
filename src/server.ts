import express from "express"
import morgan from "morgan"
import cors from "cors"
import cookieParser from "cookie-parser"
import session from "express-session"

const { Server } = require("socket.io")
const http = require("http")

import "dotenv/config"
import env from "./utils/validateEnv"
import connectDB from "./config/db"
import passport from "passport"

import authRoutes from "./routes/authRoutes"
import userRoutes from "./routes/userRoutes"
import messageRoutes from "./routes/messageRoutes"
import gameRoutes from "./routes/gameRoutes"

import { notFound, errorHandler } from "./middlewares/errorHandler"
require("./config/googleAuth")

connectDB()
const app = express()
const server = http.createServer(app)
export const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"],
    },
})





interface UserSocketMap {
    [userId: string]: string
}

const userSocketMap: UserSocketMap = {}

export const getReceiverSocketId = (receiverId: string): string | undefined => {
    return userSocketMap[receiverId]
}

io.on("connection", (socket: any) => {
    console.log("a user connected", socket.id)

    const userId = socket.handshake.query.userId as string
    if (userId !== "undefined") userSocketMap[userId] = socket.id

    io.emit("getOnlineUsers", Object.keys(userSocketMap))

    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id)
        delete userSocketMap[userId]
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
})

app.use(morgan("dev"))
app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
    session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24,
        },
    })
)

app.use(
    cors({
        origin: "http://localhost:3000",
        methods: "GET,POST,PUT,DELETE",
        credentials: true,
    })
)

app.use(passport.initialize())
app.use(passport.session())

app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/game", gameRoutes)
app.use("/api/messages", messageRoutes)

app.get("/", (req, res) => res.send("Server is ready"))

app.use(notFound)
app.use(errorHandler)

const port = env.PORT || 5000
server.listen(port, () => console.log(`Server started on port ${port}`))
