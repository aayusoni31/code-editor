// import { createServer } from "http";
import { Server } from "socket.io";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("user connected", socket.id);
    // join to specific room
    socket.on("join-room", (roomId) => {
      console.log(`User ${socket.id} joined room ${roomId} `);
      socket.join(roomId);
    });

    //   code change event
    socket.on("code-change", ({ roomId, content }) => {
      socket.to(roomId).emit("update-code", content);
    });

    //   hadle the disconnection
    socket.on("disconnect", () => {
      console.log("User disconnectd", socket.id);
    });
  });
};
// export default server;
