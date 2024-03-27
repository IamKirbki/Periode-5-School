<template>

    <div class="container">
        <div class="sidebar">
            <h2>Chats:</h2>
            <ul class="user-list">
                <li><button ref="general" @click="toGeneralChat">General</button></li>
            </ul>
        </div>

        <!-- {{ localStorage.getItem('user_name') }} -->

        <div class="chat">
            <div id="messages" class="chat-messages">
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
        };
    },
    mounted() {
        this.toGeneralChat();
    },
    created() {
        if(localStorage.getItem('user_name') === null) {
            window.location.href = "http://localhost:5173/login"
        }
        /**
         * socket.on means socket on (event)
         */
        socket.on('message', (msg) => {
            let sender = msg.username,
                messageText = msg.chatMessage
            const messageDiv = document.createElement('div');
            if (sender === localStorage.getItem('user_name')) {  
                messageDiv.classList.add('message', 'chat_self');
            } else {
                messageDiv.classList.add('message');
            }
            messageDiv.innerText = `${sender}: ${messageText}`;
            messageDiv.onclick = () => {
                this.changeChat(sender)
            }
            messages.appendChild(messageDiv);
            messages.scrollTo(0, messages.scrollHeight)
        })
    },
    methods: {
        formSubmit(e) {
            e.preventDefault();
            let messageObject = {
                chatMessage: this.chatMessage,
                username: localStorage.getItem('user_name')
            }
            socket.emit("message", messageObject);
            this.chatMessage = "";
        },
        toGeneralChat() {
            socket.emit("join", "general");
            this.$refs.general.style.backgroundColor = "#007bff";
        },
        changeChat(user_name) {
            socket.emit("leave", "general");
            this.$refs.general.style.backgroundColor = "#333333";
            socket.emit("join", user_name);
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