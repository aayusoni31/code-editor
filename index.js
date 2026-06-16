// import "dotenv/config";
// import express from "express";
// import cors from "cors";
// import bodyParser from "body-parser";
// import { createServer } from "http";
// import { initSocket } from "./lib/socket.js";
// import interviewRoutes from "./module/interview/route.js";
// import { connectToDatabase } from "./lib/db.js";
// import authRoutes from "./module/auth/route.js";
// const app = express();
// const server = createServer(app);
// const PORT = process.env.PORT || 3000;

// connectToDatabase();
// initSocket(server);

// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173",
//       "http://localhost:3000",
//       "https://code-editor-sooty-pi.vercel.app", // Lets Vercel in!
//     ],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   }),
// );
// app.use(bodyParser.json());

// app.get("/", (req, res) => {
//   return res.status(200).send("Server is running");
// });
// app.use("/auth", authRoutes);
// app.use("/interview", interviewRoutes);

// server.listen(PORT, () => {
//   console.log(`Socket server is running on port ${PORT}`);
// });
import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { createServer } from "http";
import { initSocket } from "./lib/socket.js";
import interviewRoutes from "./module/interview/route.js";
import { connectToDatabase } from "./lib/db.js";
import authRoutes from "./module/auth/route.js";

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3000;

connectToDatabase();
initSocket(server);

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://code-editor-sooty-pi.vercel.app/",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(bodyParser.json());

app.get("/health", (req, res) => {
  return res.status(200).json({ status: "ok" });
});

app.get("/", (req, res) => {
  return res.status(200).send("Server is running");
});

app.use("/auth", authRoutes);
app.use("/interview", interviewRoutes);

server.listen(PORT, () => {
  console.log(`Socket server is running on port ${PORT}`);
});
