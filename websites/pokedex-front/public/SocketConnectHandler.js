import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  transports: ["websocket", "polling", "flashsocket"],
  auth: { user_name: localStorage.getItem("user_name") },
});

export default socket;
