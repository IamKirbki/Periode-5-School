<template>
  <div class="register-container">
    <div class="register-form">
      <h2 style="color: black">Register</h2>
      <form @submit.prevent="register">
        <input class="register-input" type="text" placeholder="Username" v-model="username">
        <input class="register-input" type="email" placeholder="Email" v-model="email">
        <input class="register-input" type="password" placeholder="Password" v-model="password">
        <input class="register-input" type="password" v-model="passwordRepeat" placeholder="Confirm Password">
        <button class="register-button">Register</button>
      </form>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';

export default {
  data() {
    return {
      password: '',
      passwordRepeat: '',
      username: '',
      email: '',
    };
  },
  methods: {
    register() {
      if (!this.email.includes("@") || !this.email.includes(".")) {
        alert("Please fill in a email at email")
        this.email = "";
        return "failed";
      }

      if (this.password !== this.passwordRepeat) {
        alert("The passwords do not match")
        this.password = "";
        this.passwordRepeat = "";
        return "failed;"
      }

      if (this.password.length <= 5) {
        alert("The password atleast has to be 6 characters")
        this.password = "";
        this.passwordRepeat = "";
        return "failed";
      }

      let data = {
        name: this.username,
        email: this.email,
        password: this.password
      };

      fetch('http://localhost:3000/api/pokemon/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Failed to register');
          }
        })
        .then(data => {
          if (data === "Done") {
            window.location.href = "http://localhost:5173/login"
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
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.register-form {
  width: 400px;
  padding: 20px;
  border-radius: 10px;
  background-color: #f0f0f0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.register-input {
  width: 90%;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.register-button {
  width: 90%;
  padding: 10px;
  border-radius: 5px;
  border: none;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
}
</style>