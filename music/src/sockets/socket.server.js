import { Server } from "socket.io";

export default function initSocketServer(
  httpServer
) {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {

    console.log(
      "Client connected:",
      socket.id
    );

    // =========================================
    // PLAY MUSIC
    // =========================================

    socket.on(
      "playMusic",
      (data) => {

        console.log(
          "PLAY MUSIC:",
          data
        );

        socket.broadcast.emit(
          "playMusic",
          data
        );

      }
    );

    // =========================================
    // PLAY
    // =========================================

    socket.on(
      "play",
      (data) => {

        console.log(
          "PLAY:",
          data
        );

        socket.broadcast.emit(
          "play",
          data
        );

      }
    );

    // =========================================
    // PAUSE
    // =========================================

    socket.on(
      "pause",
      (data) => {

        console.log(
          "PAUSE:",
          data
        );

        socket.broadcast.emit(
          "pause",
          data
        );

      }
    );

    // =========================================
    // SEEK
    // =========================================

    socket.on(
      "seek",
      (data) => {

        console.log(
          "SEEK:",
          data
        );

        socket.broadcast.emit(
          "seek",
          data
        );

      }
    );

    // =========================================
    // VOLUME
    // =========================================

    socket.on(
      "volume",
      (data) => {

        console.log(
          "VOLUME:",
          data
        );

        socket.broadcast.emit(
          "volume",
          data
        );

      }
    );

    // =========================================
    // SPEED
    // =========================================

    socket.on(
      "speed",
      (data) => {

        console.log(
          "SPEED:",
          data
        );

        socket.broadcast.emit(
          "speed",
          data
        );

      }
    );

    // =========================================
    // LEAVE MUSIC
    // =========================================

    socket.on(
      "leaveMusic",
      (data) => {

        console.log(
          "LEAVE MUSIC:",
          data
        );

        socket.broadcast.emit(
          "leaveMusic",
          data
        );

      }
    );

    // =========================================
    // DISCONNECT
    // =========================================

    socket.on(
      "disconnect",
      () => {

        console.log(
          "Client disconnected:",
          socket.id
        );

      }
    );

  });

  return io;
}