import { Server } from "socket.io";

class websocketController {
  connections = [];
  messages = [];
  user_name;
  io;
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: ["http://localhost:5173"],
        methods: ["GET", "POST"],
        credentials: true,
      },
    });
  }

  init() {
    this.io.on("connection", (socket) => {
      this.user_name = socket.handshake.auth.user_name;
      console.log("a user connected");
      this.addConnection(socket);

      for (let index = 0; index < this.messages.length; index++) {
        if (
          socket.handshake.auth.user_name === this.messages[index].username ||
          this.messages[index].room === "general" ||
          this.messages[index].room.includes(socket.handshake.auth.user_name)
        ) {
          socket.send(this.messages[index]);
          console.table(this.messages);
        }
      }

      socket.on("join", (room_name) => {
        if (room_name != "general") {
          socket.join(room_name);
        } else {
          socket.join(room_name);
        }
        this.connections.forEach((connection) => {
          if (room_name && room_name.includes(connection.user_name)) {
            connection.socket.join(room_name);
          }
        });
        if (room_name != "general") {
          console.log(
            `User ${room_name} joined room ${
              room_name + "-" + socket.handshake.auth.user_name
            }`
          );
        } else {
          console.log(`User ${room_name} joined room ${room_name}`);
        }
      });

      socket.on("disconnect", () => {
        console.log("user disconnected");
        this.removeConnection(socket);
      });

      socket.on("message", (message) => {
        if (message.chatMessage === "/clear") {
          console.log("clearing messages");
          this.messages = [];
          this.io.emit("clear");
          return "Messages cleared";
        }
        this.messages.push(message);
        this.io.in(message.room).emit("message", message);
      });
    });
  }

  addConnection(socket) {
    if (this.user_name === undefined) {
      return;
    }
    console.log(" ----");
    this.connections.push({
      user_id: socket.id,
      user_name: this.user_name,
      socket: socket,
    });
    this.connections.forEach((connection) => {
      let clientSocket = connection.socket;
      clientSocket.send({
        message: "User connected",
        user_name: this.user_name,
      });
    });
    console.table(this.connections);
  }

  removeConnection(connection) {
    console.log(" ----");
    this.connections = this.connections.filter(
      (socket) => socket.user_id !== connection.id
    );
    console.table(this.connections);
  }

  broadcast(message) {
    console.log(message);
    this.io.emit("message", message);
  }
}

export default websocketController;
