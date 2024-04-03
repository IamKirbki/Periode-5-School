class websocketHandler {
  constructor(socket, msgs, rooms, invites, username, currentRoom) {
    this.connections = [];
    this.messages = msgs;
    this.invites = invites;
    this.socket = socket;
    this.rooms = rooms;
    this.username = username;
    this.room = currentRoom;
  }
  //TODO: fix the websocketHandler to work with the new file structure
  //TIP: add this. to the variables that are not defined in the constructor
  handleChatMessage() {
    this.socket.on("message", (msg) => {
      let sender = msg.username,
        messageText = msg.chatMessage,
        room = msg.room;

      if (!this.rooms.includes(msg.room)) {
        this.rooms.push(msg.room);
      }

      this.messages.push({ sender, messageText, room });

      if (
        room != "general" &&
        this.rooms.includes(room) === false &&
        room != "gameroom"
      ) {
        this.createChat(room);
      } else {
        this.createInvite(msg);
      }
    });
  }

  createInvite(msg) {
    if (msg.room === "gameroom" && this.invites.includes(msg) === false) {
      this.invites.push(msg);
    }
  }

  createChat(targetRoom) {
    if (!targetRoom || targetRoom === "" || this.rooms.includes(targetRoom)) {
      return;
    }

    try {
      this.rooms.push(targetRoom);
    } catch (error) {
      console.log(error);
    }
  }

  acceptedInvite(sender) {
    this.invites = [];
    this.socket.emit("leave", this.room);
    this.socket.emit("join", "gameroom");
    this.room = "gameroom";
  }

  declinedInvite(sender) {
    this.invites
      .filter((invite) => invite.sender === sender)
      .forEach((invite) => {
        this.invites.splice(this.invites.indexOf(invite), 1);
      });
  }

  toGeneralChat() {
    this.socket.emit("leave", this.room);
    this.socket.emit("join", "general");
    this.room = "general";
  }

  changeChat(targetRoom) {
    this.socket.emit("leave", this.room);
    this.room = targetRoom;
    this.socket.emit("join", this.room);
  }

  clear() {
    this.socket.on("clear", () => {
      this.messages = [];
    });
  }

}

export default websocketHandler;
