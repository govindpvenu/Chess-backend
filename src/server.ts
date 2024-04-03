import express from "express"
import morgan from "morgan"
import cors from "cors"
import cookieParser from "cookie-parser"
import session from "express-session"

const { Server } = require("socket.io")
const { v4: uuidV4 } = require("uuid")
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
// upgrade http server to websocket server
const io = new Server(server, {
    cors: "*", // allow connection from any origin
})
const rooms = new Map()

// io.on('connection');
io.on("connection", (socket: any) => {
    console.log(socket.id, "connected")

    // socket.on('username')
    socket.on("username", (username: any) => {
        console.log(username)
        socket.data.username = username
    })

    // createRoom
    socket.on("createRoom", async (callback: (arg0: any) => void) => {
        // callback here refers to the callback function from the client passed as data
        const roomId = uuidV4() // <- 1 create a new uuid
        await socket.join(roomId) // <- 2 make creating user join the room

        // set roomId as a key and roomData including players as value in the map
        rooms.set(roomId, {
            // <- 3
            roomId,
            players: [{ id: socket.id, username: socket.data?.username }],
        })
        // returns Map(1){'2b5b51a9-707b-42d6-9da8-dc19f863c0d0' => [{id: 'socketid', username: 'username1'}]}

        callback(roomId) // <- 4 respond with roomId to client by calling the callback function from the client
    })

    socket.on("joinRoom", async (args: any, callback: any) => {
        // check if room exists and has a player waiting
        const room = rooms.get(args.roomId)
        let error, message

        if (!room) {
            // if room does not exist
            error = true
            message = "room does not exist"
        } else if (room.length <= 0) {
            // if room is empty set appropriate message
            error = true
            message = "room is empty"
        } else if (room.length >= 2) {
            // if room is full
            error = true
            message = "room is full" // set message to 'room is full'
        }

        if (error) {
            // if there's an error, check if the client passed a callback,
            // call the callback (if it exists) with an error object and exit or
            // just exit if the callback is not given

            if (callback) {
                // if user passed a callback, call it with an error payload
                callback({
                    error,
                    message,
                })
            }

            return // exit
        }

        await socket.join(args.roomId) // make the joining client join the room

        // add the joining user's data to the list of players in the room
        const roomUpdate = {
            ...room,
            players: [...room.players, { id: socket.id, username: socket.data?.username }],
        }

        rooms.set(args.roomId, roomUpdate)

        callback(roomUpdate) // respond to the client with the room details.

        // emit an 'opponentJoined' event to the room to tell the other player that an opponent has joined
        socket.to(args.roomId).emit("opponentJoined", roomUpdate)
    })

    socket.on('move', (data:any) => {
        // emit to all sockets in the room except the emitting socket.
        socket.to(data.room).emit('move', data.move);
      });
    
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
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => res.send("Server is ready"))

app.use(notFound)
app.use(errorHandler)

const port = env.PORT || 5000
server.listen(port, () => console.log(`Server started on port ${port}`))
