import { io } from "socket.io-client";

// this is the socket connection handler
// it connects to the server and sends the token in the header
let socket = io("http://localhost:3000", {
  extraHeaders: { authorization: "bearer " + localStorage.getItem("token") },
});


socket.on("Unauthorized", (error) => {
    console.log("error", error);
});

export default socket;
