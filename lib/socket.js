import { Server } from "socket.io";

export const initSocket = (server) => {
  const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    process.env.FRONTEND_URL, // This allows your Vercel app to connect!
  ];

  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("user connected", socket.id);

    // join to specific room
    socket.on("join-room", (roomId) => {
      console.log(`User ${socket.id} joined room ${roomId}`);
      socket.join(roomId);
    });

    // code change event
    socket.on("code-change", ({ roomId, content }) => {
      socket.to(roomId).emit("update-code", content);
    });

    // handle the disconnection
    socket.on("disconnect", () => {
      console.log("User disconnected", socket.id);
    });
  });
};
