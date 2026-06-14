import { io } from "socket.io-client";

// Point directly to your live Render backend
const BACKEND_URL = "https://syncspace-sjne.onrender.com";

const socket = io(BACKEND_URL, {
  reconnectionDelaysMax: 10000,
});

export default socket;
