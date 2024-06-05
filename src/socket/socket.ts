import { io } from "../server"
const { v4: uuidV4 } = require("uuid")

const rooms = new Map()

//socket io stuffs
io.on("connection", (socket: any) => {
    socket.on("username", (username: any) => {
        socket.data.username = username
    })

    socket.on("createRoom", async (callback: any) => {
        const roomId = uuidV4()
        await socket.join(roomId)

        rooms.set(roomId, {
            roomId,
            players: [{ id: socket.id, username: socket.data?.username }],
        })

        callback(roomId)
    })

    socket.on("joinRoom", async (args: any, callback: any) => {
        const room = rooms.get(args.roomId)

        let error, message
        if (!room) {
            error = true
            message = "room does not exist"
        } else if (room.length <= 0) {
            error = true
            message = "room is empty"
        } else if (room.length >= 2) {
            error = true
            message = "room is full"
        }
        if (error) {
            if (callback) {
                callback({ error, message })
            }
            return
        }

        await socket.join(args.roomId)

        const roomData = {
            ...room,
            players: [...room.players, { id: socket.id, username: socket.data?.username }],
        }

        rooms.set(args.roomId, roomData)

        callback(roomData)

        socket.to(args.roomId).emit("opponentJoined", roomData)
    })

    socket.on("move", (data: any) => {
        socket.to(data.room).emit("move", data.move)
    })
})
