<template>

    <div class="container">

        <div class="sidebar">
            <h2>Chats:</h2>
            <ul id="users" class="user-list">
                <li v-for="ROOM in rooms" @click="changeChat(ROOM)">
                    <button v-if="room === ROOM" style="background-color: #007bff;">{{ ROOM.includes("-") ?
                    ROOM.replace(this.username, "").replace('-', '') : ROOM }}</button>
                    <button v-else style="background-color: #1a1a1a;">{{ ROOM.includes('-') ?
                    ROOM.replace(this.username, "").replace('-', '') : ROOM }}</button>
                </li>
            </ul>
        </div>

        <div class="chat">
            <div id="messages" class="chat-messages">
                <div v-for="message in messagesshow" @click="createChat(message.sender)">
                    {{ message.sender }}: {{ message.messageText }}
                </div>
            </div>

            <form @submit="formSubmit" class="message-input">
                <input v-model="chatMessage" type="text" placeholder="">
                <button>Send</button>
            </form>

        </div>
    </div>

</template>
<script>
import io from "socket.io-client";

const socket = io('http://127.0.0.1:3000', {
    transports: ['websocket', 'polling', 'flashsocket'],
    auth: { user_name: localStorage.getItem('user_name') }
});

export default {
    data() {
        return {
            chatMessage: '',
            messages: [],
            users: [],
            username: null,
            rooms: ['general'],
            room: 'general'
        };
    },
    mounted() {
        this.username = localStorage.getItem('user_name');
        this.$nextTick(() => {
            this.toGeneralChat();
        });
    },
    created() {
        if (localStorage.getItem('user_name') === null || localStorage.getItem('user_name') === '' || localStorage.getItem('user_name') === undefined){
            window.location.href = "http://localhost:5173/login"
        }  

        /**
         * socket.on means socket on (event)
         */

        socket.on('clear', () => {
            this.messages = [];
        });

        socket.on('message', (msg) => {
            let sender = msg.username,
                messageText = msg.chatMessage,
                room = msg.room

            this.messages.push({ sender, messageText, room });

            if (room != 'general' && this.rooms.includes(room) === false) {
                this.createChat(room)
            }
        });
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
            socket.emit("message", messageObject);
            this.chatMessage = "";
        },

        toGeneralChat() {
            socket.emit("leave", this.room);
            socket.emit("join", "general");
            this.room = 'general';
        },

        createChat(targetRoom) {
            if (targetRoom === null || targetRoom === '' || targetRoom === undefined || this.rooms.includes(targetRoom)) {
                return;
            }

            try {
                this.rooms.push(targetRoom+'-'+this.username);
            } catch (error) {
                console.log(error)
            }
        },

        changeChat(targetRoom) {
            socket.emit("leave", this.room);
            this.room = targetRoom + '-' + this.username;
            socket.emit("join", this.room);
        }
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
</style>