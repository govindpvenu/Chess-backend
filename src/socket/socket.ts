// import { Server as SocketServer, Socket } from "socket.io";
// import http from "http";
// import express, { Request, Response } from "express";

// const app = express();

// const server = http.createServer(app);
// const io = new SocketServer(server, {
//     cors: {
//         origin: ["http://localhost:8901"],
//         methods: ["GET", "POST"],
//     },
// });

// interface UserSocketMap {
//     [userId: string]: string;
// }

// const userSocketMap: UserSocketMap = {};

// export const getReceiverSocketId = (receiverId: string): string | undefined => {
//     return userSocketMap[receiverId];
// };

// io.on("connection", (socket: Socket) => {
//     console.log("a user connected", socket.id);

//     const userId = socket.handshake.query.userId as string;
//     if (userId !== "undefined") userSocketMap[userId] = socket.id;

//     io.emit("getOnlineUsers", Object.keys(userSocketMap));

//     socket.on("disconnect", () => {
//         console.log("user disconnected", socket.id);
//         delete userSocketMap[userId];
//         io.emit("getOnlineUsers", Object.keys(userSocketMap));
//     });
// });

// export { app, io, server };
