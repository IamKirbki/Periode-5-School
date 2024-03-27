import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Pokemon from "./components/Pokemon.vue";
import HelloWorld from "./components/HelloWorld.vue";
import singlePokemon from "./components/SinglePokemon.vue";
import Login from "./components/Login.vue";
import Register from "./components/Register.vue";
import FavouritePokemon from './components/FavouritePokemon.vue';
import ChatRoom from './components/ChatRoom.vue'
import {createRouter, createWebHashHistory, createWebHistory} from "vue-router";

const routes = [
    {path: '/', component: HelloWorld},
    {path: '/pokemon', component: Pokemon},
    {path: '/pokemon/:id', component: singlePokemon},
    {path: '/login', component: Login},
    {path: '/register', component: Register},
    {path: '/favorites', component: FavouritePokemon},
    {path: '/chatroom', component: ChatRoom},
]

const router = createRouter ({
    history: createWebHistory(),
    routes,
})

const app = createApp(App)

app.use(router)

app.mount('#app')