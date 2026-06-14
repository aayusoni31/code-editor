import { io } from "socket.io-client";

// Point directly to your live Render backend
const BACKEND_URL = "https://syncspace-sjne.onrender.com";

const socket = io(BACKEND_URL, {
  autoConnect: false,
});

export default socket;import { io } from "socket.io-client";

// Point directly to your live Render backend
const BACKEND_URL = "https://syncspace-sjne.onrender.com";

const socket = io(BACKEND_URL, {
  autoConnect: false,
});

export default socket;