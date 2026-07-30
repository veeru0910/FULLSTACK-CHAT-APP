import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
    transports: ["polling", "websocket"],
    cors: {
        origin: [
    "http://localhost:5173",
    "https://meetme-by-veerendra.vercel.app"
],
        methods: ["GET", "POST"],
        credentials: true,
    },
});
const userSocketMap = {};

let adminSocketId = null;

export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

export function getAdminSocketId() {
    return adminSocketId;
}


// Send online users
const sendOnlineUsers = () => {

    const onlineUserIds = Object.keys(userSocketMap);

    io.sockets.sockets.forEach((connectedSocket) => {

        const connectedUserEmail =
            connectedSocket.handshake.query.email;

        const isAdmin =
            connectedUserEmail &&
            process.env.ADMIN_EMAIL &&
            connectedUserEmail.toLowerCase() ===
                process.env.ADMIN_EMAIL.toLowerCase();

        if (isAdmin) {
            // Admin can see normal users
            const normalUsers = onlineUserIds.filter(
                (userId) => userId !== connectedSocket.handshake.query.userId
            );

            connectedSocket.emit(
                "getOnlineUsers",
                normalUsers
            );

        } else {
            // Normal users cannot see admin
            const adminUserId = Object.keys(userSocketMap).find(
                (userId) =>
                    userSocketMap[userId] === adminSocketId
            );

            const visibleUsers = onlineUserIds.filter(
                (userId) => userId !== adminUserId
            );

            connectedSocket.emit(
                "getOnlineUsers",
                visibleUsers
            );
        }
    });
};


io.on("connection", (socket) => {

    console.log("A user connected");

    const userId = socket.handshake.query.userId;
    const userEmail = socket.handshake.query.email;


    // Store user socket
    if (userId) {
        userSocketMap[userId] = socket.id;
    }


    // Check admin
    if (
        userEmail &&
        process.env.ADMIN_EMAIL &&
        userEmail.toLowerCase() ===
            process.env.ADMIN_EMAIL.toLowerCase()
    ) {

        adminSocketId = socket.id;

        console.log("Admin connected");
    }


    // Send updated online users
    sendOnlineUsers();


    // Disconnect
    socket.on("disconnect", () => {

        console.log("A user disconnected");

        if (userId) {
            delete userSocketMap[userId];
        }

        if (socket.id === adminSocketId) {
            adminSocketId = null;

            console.log("Admin disconnected");
        }

        sendOnlineUsers();
    });

});


export { app, io, httpServer };