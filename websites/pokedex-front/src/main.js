import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Pokemon from "./components/Pokemon.vue";
import {createRouter, createWebHashHistory, createWebHistory} from "vue-router";
import HelloWorld from "./components/HelloWorld.vue";
import singlePokemon from "./components/SinglePokemon.vue";
import Login from "./components/Login.vue";
import Register from "./components/Register.vue";

const routes = [
    {path: '/', component: HelloWorld},
    {path: '/pokemon', component: Pokemon},
    {path: '/pokemon/:id', component: singlePokemon},
    {path: '/login', component: Login},
    {path: '/register', component: Register},
]

const router = createRouter ({
    history: createWebHistory(),
    routes,
})

const app = createApp(App)

app.use(router)

app.mount('#app')