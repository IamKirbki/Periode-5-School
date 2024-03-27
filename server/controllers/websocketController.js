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
    const self = this;
    this.io.on("connection", (socket) => {
        console.table(this.connections);
      self.user_name = socket.handshake.auth.user_name;
      console.log("a user connected");
      self.addConnection(socket);
      for (let index = 0; index < self.messages.length; index++) {
        socket.send(self.messages[index]);
      }
      socket.on("typing", () => {
        this.io.emit("typing", self.user_name);
      });
      socket.on("join", (chat) => {
        socket.join(chat);
      }) 
      socket.on("disconnect", () => {
        console.log("user disconnected");
        self.removeConnection(socket);
      });
      socket.on("message", (message) => { 
        console.log("message: " + message);
        self.messages.push(message);
        this.broadcast(message);
      });
    });
  }

  addConnection(socket) {
    // console.log(' ----');
    // console.table(this.connections);
    this.connections[this.user_name] = socket;
    this.connections.push(socket);
    // console.table(this.connections);
  }

  removeConnection(connection) {
    this.connections = this.connections.filter((c) => c !== connection);
    console.table(this.connection);
  }

  broadcast(message) {
    console.log(message);
    this.io.emit("message", message);
  }
}

export default websocketController;
