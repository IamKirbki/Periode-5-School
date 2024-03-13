<template>
  <div class="login-container">
    <div class="login-form">
      <h2 style="color: black">Login</h2>
      <input class="login-input" type="text" placeholder="Username" v-model="username">
      <input class="login-input" type="password" placeholder="Password" v-model="password">
      <button class="login-button" @click="login">Login</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  methods: {
    login() {

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
