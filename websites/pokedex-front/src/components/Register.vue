<template>
  <div class="register-container">
    <div class="register-form">
      <h2 style="color: black">Register</h2>
      <input class="register-input" type="text" placeholder="Username" v-model="username">
      <input class="register-input" type="email" placeholder="Email" v-model="email">
      <input class="register-input" type="password" placeholder="Password" v-model="password">
      <input class="register-input" type="password" placeholder="Confirm Password" v-model="confirmPassword">
      <button class="register-button" @click="register">Register</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Register"
}
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