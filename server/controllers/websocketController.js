import { Server } from "socket.io";
import passportConfig from "../passportConfig.js";
import passport from "passport";

// Wrap middleware to work with socket.io
const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);

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

    // Initialize passport
    passportConfig(passport);
    this.io.use(wrap(passport.initialize()));

    // Use passport to authenticate users
    this.io.engine.use((req, res, next) => {
      // isHandshake is a boolean that indicates whether the request is undefined
      const isHandshake = req._query.sid === undefined;
      // If the request is undefined, it can't authorize the user
      if (!isHandshake) {
        next();
      } else {
        // If the request is defined, use passport to authenticate the user
        passport.authenticate("jwt", { session: false })(req, res, next);
      }
    });
  }

  init() {
    this.io.on("connection", (socket) => {
      // socket.request.user contains the authenticated user
      // this comes from the passport middleware
      this.user_name = socket.request.user.name;
      console.log("a user connected");
      this.addConnection(socket);

      socket.on("getUsername", () => {
        socket.emit("sendUsername", socket.request.user.name);
      });

      socket.on("ready", (opponent, opponentPokemon) => {
        let opponentSocket = this.connections.find(
          (connection) => connection.user_name === opponent
        );
        opponentSocket.socket.emit("opponentReady", socket.request.user.name, opponentPokemon);
      });

      socket.on("undready", (opponent) => {
        let opponentSocket = this.connections.find(
          (connection) => connection.user_name === opponent
        );
        opponentSocket.socket.emit("opponentUndready");
      });

      socket.on("start", (opponent) => {
        socket.send("start");
        let opponentSocket = this.connections.find(
          (connection) => connection.user_name === opponent
        );
        opponentSocket.socket.send("start");
      });

      socket.on("acceptInvite", (inviteReceiver, inviteSender) => {
        let senderSocket = this.connections.find(
          (connection) => connection.user_name === inviteSender
        );
        senderSocket.socket.emit("acceptedInvite", inviteReceiver, inviteSender);
      })

      for (let index = 0; index < this.messages.length; index++) {
        if (
          this.user_name === this.messages[index].username ||
          this.messages[index].room === "general" ||
          this.messages[index].room.includes(this.user_name)
        ) {
          socket.send(this.messages[index]);
          console.table(this.messages);
        }
      }

      socket.on("join", (room_name) => {
        this.user_name = socket.request.user.name;

        this.connections.forEach((connection) => {
          if (room_name && room_name.includes(connection.user_name)) {
            connection.socket.join(room_name);
          }
        });

        if (room_name != "general" && room_name != "gameroom") {
          socket.join(room_name + "-" + this.user_name);
          console.log(
            `User ${this.user_name} joined room ${
              room_name + "-" + socket.request.user.name
            }`
          );
        } else {
          socket.join(room_name);
          console.log(`User ${this.user_name} joined room ${room_name}`);
        }
      });

      socket.on("disconnect", () => {
        console.log("user disconnected");
        this.removeConnection(socket);
      });

      socket.on("message", (message) => {
        this.user_name = socket.request.user.name;

        message.username = this.user_name;

        if (message.chatMessage === "/clear") {
          console.log("clearing messages");
          this.messages = [];
          this.io.emit("clear");
          return "Messages cleared";
        } else if (message.chatMessage === "/users") {
          console.table(this.connections);
          return "Users";
        } else if (message.chatMessage.includes("/invite")) {
          if (
            !message.chatMessage ||
            !message.chatMessage.split(" ")[1] ||
            message.chatMessage.split(" ")[1] === "" ||
            message.chatMessage.split(" ")[1].includes(" ") ||
            message.chatMessage.split(" ")[1] === message.username
          ) {
            console.log("Invalid invite");
            return;
          }

          this.connections.forEach((connection) => {
            if (connection.user_name === message.chatMessage.split(" ")[1]) {
              console.log(
                message.username +
                  " has invited " +
                  connection.user_name +
                  " to a game!"
              );
              connection.socket.send({
                chatMessage: message.username + " has invited you to a game!",
                room: "gameroom",
                sender: socket.request.user.name,
              });
            }
          });

          return "Invited";
        }

        console.log(message);

        this.messages.push(message);
        console.table(this.messages);
        this.io.in(message.room).emit("message", message);
      });
    });
  }

  addConnection(socket) {
    if (!this.user_name) {
      return;
    }

    this.user_name = socket.request.user.name;

    if (
      this.connections.find((connection) => connection.user_id === socket.id)
    ) {
      this.removeConnection(socket);
    }

    this.connections.push({
      user_id: socket.id,
      user_name: this.user_name,
      socket: socket,
    });

    console.table(this.connections);
  }

  removeConnection(socket) {
    this.user_name = socket.request.user.name;

    this.connections = this.connections.filter(
      (connection) => connection.user_id !== socket.id
    );
  }
}

export default websocketController;
