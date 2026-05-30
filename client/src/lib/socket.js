// import { io } from "socket.io-client";
// const socketUrl = "ws://localhost:3000";
// const socket = io(socketUrl, {
//   reconnectionDelaysMax: 10000,
// });
// export default socket;
import { io } from "socket.io-client";

// Socket.io needs HTTP for the initial handshake!
const socketUrl = "http://localhost:3000";

const socket = io(socketUrl, {
  reconnectionDelaysMax: 10000,
});

export default socket;
