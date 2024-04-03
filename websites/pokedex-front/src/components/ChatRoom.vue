<template>
    <div v-if="room != 'gameroom'" class="container">
        <div class="sidebar">
            <h2>Chats:</h2>
            <ul id="users" class="user-list">
                <li v-for="roomName in rooms" @click="this.websocketHandler.changeChat(roomName)">
                    {{ roomName }}
                    <button v-if="room === roomName && roomName" style="background-color: #007bff;">
                        {{ roomName.includes("-") ? roomName.replace(username, "").replace('-', '') : roomName }}
                    </button>
                    <button v-else-if="roomName" style="background-color: #1a1a1a;">
                        {{ roomName.includes('-') ? roomName.replace(username, "").replace('-', '') : roomName }}
                    </button>
                </li>
            </ul>
        </div>

        <div class="chat">
            <div id="messages" class="chat-messages">
                <div v-for="message in messagesshow" @click="this.websocketHandler.createChat(message.sender)">
                    {{ message.sender }}: {{ message.messageText }}
                </div>
            </div>

            <form @submit="formSubmit" class="message-input">
                <input v-model="chatMessage" type="text" placeholder="">
                <button>Send</button>
            </form>
        </div>

        <div class="sidebar">
            <h2>Invites:</h2>
            <ul id="invites" class="invites-list">
                <li v-for="invite in invites">
                    <ul class="battle-invite">
                        <h2>Battle Invitation</h2>
                        <div class="invite-details">
                            <p>{{ invite.sender }} has invited you to a battle!</p>
                        </div>
                        <div class="invite-actions">
                            <button @click="this.websocketHandler.acceptedInvite(invite.sender)"
                                class="accept-button">Accept</button>
                            <button @click="this.websocketHandler.declinedInvite(invite.sender)"
                                class="decline-button">Decline</button>
                        </div>
                    </ul>
                </li>
            </ul>
        </div>

    </div>

</template>
<script>
import io from "socket.io-client";
import websocketHandler from "./../../public/websocketHandler";
//import SocketConnectectHandler from "./../../public/SocketConnectectHandler";
import socket from "../../public/SocketConnectHandler";


// const socket = io("http://localhost:3000", {
//   transports: ["websocket", "polling", "flashsocket"],
//   auth: { user_name: localStorage.getItem("user_name") },
// });

export default {
    data() {
        return {
            chatMessage: '',
            messages: [],
            users: [],
            username: null,
            rooms: ['general'],
            room: 'general',
            invites: [],
            socket: socket,
            websocketHandler: null,
        };
    },
    mounted() {
        this.username = localStorage.getItem('user_name');
        this.$nextTick(() => {
            this.websocketHandler.toGeneralChat();
            this.websocketHandler.handleChatMessage();
        });
        this.websocketHandler = new websocketHandler(socket, this.messages, this.rooms, this.invites, this.username, this.room);
    },
    created() {
        if (localStorage.getItem('user_name') === null || localStorage.getItem('user_name') === '' || localStorage.getItem('user_name') === undefined) {
            window.location.href = "http://localhost:5173/login"
        }

        /**
         * socket.on means socket on (event)
         */
    },
    computed: {
        messagesshow() {
            return this.messages.filter((message) => message.room === this.room);
        }
    },
    methods: {
        formSubmit(e) {
            e.preventDefault();
            let messageObject = {
                chatMessage: this.chatMessage,
                username: this.username,
                room: this.room
            };
            if (this.chatMessage === '') {
                return;
            }
            console.log(this.messages)
            socket.emit("message", messageObject);
            this.chatMessage = "";
        },

    }
}
</script>
<style scoped>
body {
    margin: 0;
    font-family: Arial, sans-serif;
    color: #ffffff;
    display: flex;
    justify-content: center;
}

.container {
    display: flex;
    height: 80vh;
    width: 80vw;
}

.sidebar {
    flex: 0 0 20%;
    background-color: #333333;
    padding: 20px;
    overflow-y: scroll;
}

.chat {
    flex: 1;
    padding: 20px;
}

.chat-messages {
    height: calc(100% - 50px);
    overflow-y: scroll;
    text-align: start;
}

.user-list {
    list-style-type: none;
    padding: 0;
}

.invites-list {
    list-style-type: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.user-list li {
    margin-bottom: 10px;
}

.message-input {
    margin-top: 20px;
    display: flex;
}

.message {
    background-color: #444444;
    color: #ffffff;
    padding: 10px;
    margin-bottom: 5px;
    border-radius: 5px;
}

.message-input input {
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 5px;
    margin-right: 10px;
}

.message-input button {
    padding: 10px 20px;
    background-color: #007bff;
    border: none;
    border-radius: 5px;
    color: #ffffff;
    cursor: pointer;
}

.message-input button:hover {
    background-color: #0056b3;
}

.battle-invite {
    border: 2px solid #4CAF50;
    border-radius: 5px;
    padding: 10px;
    width: 250px;
    background-color: #444444;
    text-align: center;
    display: flex;
    flex-direction: column;
}

.battle-invite h2 {
    color: #4CAF50;
    margin-bottom: 10px;
}

.invite-details p {
    margin: 5px 0;
}

.invite-actions {
    margin-top: 10px;
}

.accept-button,
.decline-button {
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 3px;
    padding: 8px 16px;
    margin: 0 5px;
    cursor: pointer;
}

.accept-button:hover,
.decline-button:hover {
    background-color: #45a049;
}
</style>