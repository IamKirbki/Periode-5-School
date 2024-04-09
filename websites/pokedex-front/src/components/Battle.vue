<template>
    <div class="buttons">
        <button @click="openModal">Select Pokemon</button>
        <button @click="ready">Ready up!</button>
    </div>
    <div class="pokemon-selector">
        <div class="modal" :class="{ 'is-active': showModal }">
            <div class="modal-background" @click="closeModal"></div>
            <div class="modal-content">
                <h2 @click="closeModal" style="cursor: pointer;">Close</h2>
                <h2>Select a Pokemon</h2>
                <div class="pokemon-list">
                    <div v-for="pokemon in pokemons" :key="pokemon.id" @click="addPokemon(pokemon)">
                        <img :src="pokemon.png_url" alt="Pokemon" />
                        <p>{{ pokemon.name }}</p>
                    </div>
                </div>
            </div>
            <button class="modal-close is-large" aria-label="close" @click="closeModal"></button>
        </div>
    </div>
</template>
<script>
import websocketHandler from "./../../public/websocketHandler";
import socket from "../../public/SocketConnectHandler";
import LazyLoad from "vanilla-lazyload";
import router from "../main";

const lazyLoadInstance = new LazyLoad({});

export default {
    data() {
        return {
            opponent: '',
            username: '',
            messages: [],
            rooms: [],
            invites: [],
            room: '',
            pokemons: [],
            pokemonElements: [],
            selectedPokemons: [],
            showModal: false,
            perPage: 1302,
            page: 1,
            direction: false,
            opponentReady: false,
        }
    },
    mounted() {
        this.username = localStorage.getItem("user_name")
        this.opponent = localStorage.getItem("opponent")

        if (this.opponent === null) {
            router.push('/pokemon')
        }

        this.websocketHandler = new websocketHandler(socket, this.messages, this.rooms, this.invites, this.username, this.room);

        this.username = this.websocketHandler.getUsername()

        fetch('http://localhost:3000/api/pokemon/all')
            .then(response => response.json())
            .then(data => {
                let index = 0;
                data.forEach(element => {
                    if (index <= 1000) {
                        this.pokemons.push(element);
                    } else {
                        return;
                    }
                    index++;
                });
                this.$nextTick(() => {
                    document.querySelectorAll('.pokemon-list>div').forEach(element => {
                        this.pokemonElements.push(element);
                    });
                })
            })
            .catch(error => {
                console.error('Error fetching pokemons:', error);
            });

        socket.on("opponentReady", () => {
            this.opponentReady = true;
        })

        socket.on("opponentUnready", () => {
            this.opponentReady = false;
        })

        console.log(this.opponent)
        console.log(this.username)
    },
    created() {

    },
    computed: {

    },
    methods: {
        addPokemon(pokemon) {
            if (this.selectedPokemons.length <= 6 && this.selectedPokemons.filter(p => p.id === pokemon.id).length === 0) {
                pokemon.username = this.username;
                this.pokemonElements[pokemon.id - 1].style.border = 'green 2px solid';
                this.selectedPokemons.push(pokemon);
                if (this.selectedPokemons.length === 6) {
                    this.closeModal();
                    // socket.emit("teamSelected")
                }
            } else if (this.selectedPokemons.filter(p => p.id === pokemon.id).length > 0) {
                this.pokemonElements[pokemon.id - 1].style.border = '#525252 2px solid';
                this.selectedPokemons = this.selectedPokemons.filter(p => p.id !== pokemon.id);
            }
        },
        openModal() {
            if (this.notallowed) {
                return;
            }
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
        },
        paginationFix() {
            let elementList = document.querySelectorAll('.pokemon-list>div');
            let filteredElementList = [];
            for (const element of elementList) {
                if (element.dataset['isHidden']) {
                    if (element.dataset['isHidden'] === "false") {
                        filteredElementList.push(element);
                    }
                } else {
                    filteredElementList = elementList;
                    break;
                }
            }
            for (const element of elementList) {
                element.style.display = 'none';
            }
            for (let i = this.perPage * (this.page - 1); i < this.perPage * this.page; i++) {
                if (filteredElementList[i]) {
                    filteredElementList[i].style.display = 'inherit';
                } else {
                    break;
                }
            }
            lazyLoadInstance.update();
        },
        search(e) {
            let elementList = document.querySelectorAll('.pokemon-list>div');
            for (const element of elementList) {
                if (element.lastChild.textContent.includes(e.target.value)) {
                    element.dataset['isHidden'] = "false";
                    element.style.display = 'inherit';
                } else {
                    element.style.display = 'none';
                    element.dataset['isHidden'] = "true";
                }
                if (e.target.value === "") {
                    element.style.display = 'inherit';
                    delete element.dataset['isHidden'];
                }
            }
            if (e.target.value === "") {
                this.page = 1;
                this.paginationFix();
            }
        },
        ready() {
            if (this.selectedPokemons.length === 6) {
                //socket.emit("teamSelected", this.selectedPokemons);
                if (document.querySelector('.buttons button:last-child').style.backgroundColor === 'green') {
                    document.querySelector('.buttons button:last-child').style.backgroundColor = '#333333'
                    document.querySelector('.buttons button:first-child').style.cursor = 'pointer';
                    this.notallowed = false;
                    socket.emit("unready", this.opponent)
                    return;
                }
                document.querySelector('.buttons button:last-child').style.backgroundColor = 'green';
                document.querySelector('.buttons button:first-child').style.cursor = 'not-allowed';
                this.notallowed = true;
                socket.emit("ready", this.opponent, this.selectedPokemons)
            } else {
                alert('Please select 6 pokemons before readying up!')
            }
        }
    }
}
</script>
<style>
.modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
    overflow: auto;
}

.modal-content {
    background-color: #333333;
    margin: 15% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
    height: 80%;
    overflow-y: scroll;
}

.modal-close {
    position: absolute;
    top: 15px;
    right: 15px;
    background-color: transparent;
    border: none;
    cursor: pointer;
    font-size: 24px;
}

.is-active {
    display: block;
}

.pokemon-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    margin-top: 20px;
}

.pokemon-list>div {
    text-align: center;
    cursor: pointer;
    border: #525252 2px solid;
    padding: 5px;
    margin: 20px;
}

.pokemon-list img {
    width: 100px;
    height: auto;
    margin-bottom: 5px;
}

.buttons {
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
    flex-direction: column;
    height: 300px;
}

.buttons button {
    width: 200px;
    height: 50px;
    background-color: #333333;
    color: white;
    border: none;
    cursor: pointer;
    font-size: 20px;
    margin: 10px;
}

.buttons button:hover {
    background-color: #525252;
}
</style>