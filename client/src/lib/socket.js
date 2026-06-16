import { io } from "socket.io-client";

const BACKEND_URL = "https://syncspace-sjne.onrender.com";

// Don't connect yet — just create the instance with autoConnect OFF
const socket = io(BACKEND_URL, {
  autoConnect: false,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
  reconnectionDelayMax: 10000,
  timeout: 20000,
});

export default socket;
