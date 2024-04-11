import router from "../src/main.js";
class websocketHandler {
  constructor(socket, messages, rooms, invites, username, room, opponentReady) {
    this.messages = messages;
    this.invites = invites;
    this.socket = socket;
    this.rooms = rooms;
    this.username = username;
    this.room = room;
    this.router = router;
  }

  //TODO: fix the websocketHandler to work with the new file structure
  //TIP: add this. to the variables that are not defined in the constructor

  handleChatMessage() {
    this.socket.on("message", (msg) => {
      let sender = msg.username,
        messageText = msg.chatMessage,
        msgRoom = msg.room;

      if (!this.rooms.includes(msgRoom) && msgRoom != "gameroom") {
        this.rooms.push(msgRoom);
      }

      if (msgRoom != "gameroom") {
        this.messages.push({ sender, messageText, msgRoom });
        return;
      }

      if (msgRoom === "gameroom") {
        this.createInvite(msg);
      } else if (
        msgRoom != "general" &&
        msgRoom != "gameroom" &&
        !this.rooms.includes(msgRoom)
      ) {
        this.createChat(msgRoom);
      }
    });
    this.socket.on("acceptedInvite", (inviteReceiver, inviteSender) => {
      this.acceptedInvite(inviteReceiver, inviteSender);
    });
  }

  createInvite(msg) {
    if (msg.room === "gameroom" && !this.invites.includes(msg)) {
      this.invites.push(msg);
    }
  }

  createChat(targetRoom) {
    if (!targetRoom || targetRoom === "" || this.rooms.includes(targetRoom)) {
      return;
    }

    targetRoom = targetRoom + "-" + this.username;

    try {
      this.rooms.push(targetRoom);
    } catch (error) {
      console.log(error);
    }
  }

  acceptedInvite(inviteReceiver, inviteSender) {
    this.invites = [];
    this.router.push("/battle");
    localStorage.setItem("opponent", inviteReceiver);
  }

  acceptInvite(inviteSender, inviteReceiver) {
    this.invites = [];
    let username = this.getUsername();
    this.router.push("/battle");
    localStorage.setItem("opponent", inviteSender);
    this.socket.emit("acceptInvite", username, inviteSender);
  }

  getUsername() {
    this.socket.emit("getUsername");
    this.socket.on("sendUsername", (username) => {
      this.username = username;
    });
    return this.username;
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
      this.messages.splice(0, this.messages.length);
    });
  }
}

export default websocketHandler;
