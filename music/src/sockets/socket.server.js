        import { Server } from "socket.io";

export default function initSocketServer(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log("Client Connected:", socket.id);

        socket.on("play", (data) => {
            socket.broadcast.emit("play", data);
        });

        socket.on("pause", (data) => {
            socket.broadcast.emit("pause", data);
        });

        socket.on("seek", (data) => {
            socket.broadcast.emit("seek", data);
        });

        socket.on("volume", (data) => {
            socket.broadcast.emit("volume", data);
        });

        socket.on("speed", (data) => {
            socket.broadcast.emit("speed", data);
        });

     socket.on("leaveMusic", (data) => {
    io.emit("leaveMusic", data);
});
        socket.on("disconnect", () => {
            console.log("Client Disconnected:", socket.id);
        });
    });
}