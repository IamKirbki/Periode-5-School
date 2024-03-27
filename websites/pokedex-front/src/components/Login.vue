<template>
  <div class="login-container">
    <div class="login-form">
      <h2 style="color: black">Login</h2>
      <input class="login-input" id="email" type="text" placeholder="Email" v-model="email">
      <input class="login-input" id="password" type="password" placeholder="Password" v-model="password">
      <button class="login-button" @click="login">Login</button>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";

const socket = io('http://127.0.0.1:3000');
export default {
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    login() {
      const postData = {
        email: this.email,
        password: this.password
      }
      console.log(postData);
      
      fetch('http://localhost:3000/api/pokemon/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Failed to register');
          }
        })
        .then(data => {
          console.log(data)
          if(data.status === "done"){
            localStorage.setItem("token", data.token)
            localStorage.setItem("user_id", data.user_id)
            localStorage.setItem("user_name", data.user_name)
            window.location.href = "http://localhost:5173/pokemon"  
          } else {
            alert("These do not match our credentials")
          }
        })
        .catch(error => {
          console.error('Error making POST request:', error);
        });
    }
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-form {
  width: 400px;
  padding: 20px;
  border-radius: 10px;
  background-color: #f0f0f0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.login-input {
  width: 90%;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.login-button {
  width: 90%;
  padding: 10px;
  border-radius: 5px;
  border: none;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
}
</style>
