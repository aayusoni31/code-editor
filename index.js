import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { createServer } from "http";
import { initSocket } from "./lib/socket.js";
import interviewRoutes from "./module/interview/route.js";
import { connectToDatabase } from "./lib/db.js";

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3000;
// const SOCKET_PORT = process.env.SOCKET_PORT || 3001;

connectToDatabase();
initSocket(server);

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  return res.status(200).send("Server is running");
});
app.use("/interview", interviewRoutes);

server.listen(PORT, () => {
  console.log(`Socket server is running on port ${PORT}`);
});
