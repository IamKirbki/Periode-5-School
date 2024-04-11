<template>
    <div v-if="!(opponentReady && playerReady)" class="buttons">
        <button :style="playerReady ? 'cursur: not-allowed;' : 'cursur: pointer'" @click="openModal">Select
            Pokemon</button>
        <p v-if="opponentReady">The opponent is ready!</p>
        <button :style="playerReady ? 'background-color: green' : ''" @click="ready">Ready up!</button>
    </div>
    <div v-if="!(opponentReady && playerReady)" class="pokemon-selector">
        <div class="modal" :class="{ 'is-active': showModal }">
            <div class="modal-background" @click="closeModal"></div>
            <div class="modal-content">
                <h2 @click="closeModal" style="cursor: pointer;">Close</h2>
                <h2>Select a Pokemon</h2>
                <input type="text" placeholder="pokemon" @keyup="search"></input>
                <div class="pokemon-list">
                    <div v-for="pokemon in pokemons" :key="pokemon.id" @click="addPokemon(pokemon)"
                        v-show="!pokemon.isHidden">
                        <img :src="pokemon.png_url" alt="Pokemon" />
                        <p>{{ firstCharUppercase(pokemon.name) }}</p>
                    </div>
                </div>
            </div>
            <button class="modal-close is-large" aria-label="close" @click="closeModal"></button>
        </div>
    </div>
    <div v-if="(opponentReady && playerReady)">
        <h1 v-if="this.selectedPokemon.every(pokemon => pokemon.dead)">You lost!</h1>
        <h1 v-if="this.opponentPokemon.every(pokemon => pokemon.dead)">You won!</h1>
        <div class="battlefield">
            <div class="player">
                <h2 :style="{ color: turn === username ? 'green' : '' }">{{ firstCharUppercase(username) }}</h2>
                <div class="pokemon-list">
                    <div v-for="pokemon in selectedPokemon"
                        :style="{ cursur: turn === username && toSelect === 'pokemon' || selectedSinglePokemon === pokemon.name ? 'pointer' : '', border: pokemon.name === selectedSinglePokemon && !(this.selectedPokemon.every(pokemon => pokemon.dead)) ? '2px solid green' : '' }"
                        @click="handleBattleClick(pokemon.name)" :key="pokemon.id">
                        <img :style="{ filter: pokemon.dead ? 'grayscale(100%)' : '' }" :src="pokemon.png_url"
                            alt="Pokemon" />
                        <p>{{ pokemon.name != "snorlax" ? firstCharUppercase(pokemon.name) : "Fatass" }}</p>
                        <div class="health-bar">
                            <div class="health-bar-inner"
                                :style="{ width: ((pokemon.hp / pokemon.maxHp) * 100) + '%', backgroundColor: (pokemon.hp / pokemon.maxHp) < 0.3 ? 'red' : (pokemon.hp / pokemon.maxHp) < 0.6 ? 'orange' : '' }">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="opponent">
                <h2 :style="{ color: turn === opponent ? 'green' : '' }">{{ firstCharUppercase(opponent) }}</h2>
                <div class="pokemon-list">
                    <div v-for="pokemon in opponentPokemon"
                        :style="{ cursur: turn === username && toSelect === 'attack' ? 'pointer' : '' }"
                        @click="handleBattleClick(pokemon.name)" :key="pokemon.id">
                        <img :style="{ filter: pokemon.dead ? 'grayscale(100%)' : '' }" :src="pokemon.png_url"
                            alt="Pokemon" />
                        <p>{{ firstCharUppercase(pokemon.name) }}</p>
                        <div class="health-bar">
                            <div class="health-bar-inner"
                                :style="{ width: ((pokemon.hp / pokemon.maxHp) * 100) + '%', backgroundColor: (pokemon.hp / pokemon.maxHp) < 0.3 ? 'red' : (pokemon.hp / pokemon.maxHp) < 0.6 ? 'orange' : '' }">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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
            opponentPokemon: [],
            pokemonElements: [],
            selectedPokemon: [],
            showModal: false,
            perPage: 1302,
            page: 1,
            direction: false,
            opponentReady: false,
            playerReady: false,
            notallowed: false,
            turn: "",
            selectedSinglePokemon: "",
            toSelect: "pokemon",
        }
    },
    mounted() {
        this.username = localStorage.getItem("user_name")
        this.opponent = localStorage.getItem("opponent")

        if (this.opponent === null) {
            router.push('/pokemon')
        }

        socket.on("opponentReady", (opponent, pokemon) => {
            this.opponentReady = true;
            this.opponentPokemon = pokemon;
        });
        socket.on("opponentUnready", (opponent) => {
            this.opponentReady = false;
        });
        socket.on("start", () => {
            this.turn = this.username;
        })
        socket.on("wait", () => {
            this.turn = this.opponent;
        })
        socket.on("damage", (pokemonName, damage) => {
            this.handleDamageSocket(pokemonName, damage)
        })

        this.websocketHandler = new websocketHandler(socket, this.messages, this.rooms, this.invites, this.username, this.room, this.opponentReady);

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

            document.addEventListener("unload", (e) => {
                localStorage.removeItem("opponent")
            })
    },
    created() {

    },
    computed: {

    },
    methods: {
        addPokemon(pokemon) {
            if (this.selectedPokemon.length <= 6 && this.selectedPokemon.filter(p => p.id === pokemon.id).length === 0) {
                pokemon.username = this.username;
                this.pokemonElements[pokemon.id - 1].style.border = 'green 2px solid';
                let pokemonAdd = pokemon;
                pokemonAdd.maxHp = pokemon.hp;
                pokemonAdd.dead = false;
                this.selectedPokemon.push(pokemonAdd);
                if (this.selectedPokemon.length === 6) {
                    this.closeModal();
                    // socket.emit("teamSelected")
                }
            } else if (this.selectedPokemon.filter(p => p.id === pokemon.id).length > 0) {
                this.pokemonElements[pokemon.id - 1].style.border = '#525252 2px solid';
                this.selectedPokemon = this.selectedPokemon.filter(p => p.id !== pokemon.id);
            }
        },
        handleBattleClick(pokemonName) {
            if (this.turn === this.username) {
                if (this.toSelect === "pokemon") {
                    this.selectedSinglePokemon = pokemonName
                    this.toSelect = "attack";
                } else if (pokemonName === this.selectedSinglePokemon) {
                    this.toSelect = "pokemon";
                    this.selectedSinglePokemon = "";
                } else if (this.toSelect === "attack") {
                    this.attack(pokemonName)
                    this.selectedSinglePokemon = ""
                    this.toSelect = "pokemon";
                }
            } else {
                return;
            }
        },
        attack(pokemonName) {
            let attacker = this.selectedSinglePokemon;
            if (this.selectedPokemon.filter(p => p.name === attacker)[0].dead) {
                return;
            }
            let detailedAttacker = this.pokemons.filter(p => p.name === attacker)[0];
            let defender = this.opponentPokemon.filter(p => p.name === pokemonName)[0];
            let detailedDefender = this.pokemons.filter(p => p.name === pokemonName)[0];
            let damage = Math.round(((2 * 1500 + 10) / 250) *
                (detailedAttacker.attack / detailedDefender.defense) +
                2);
            this.handleDamage(pokemonName, damage)
            socket.emit("damage", pokemonName, damage, this.opponent)
        },
        handleDamage(pokemonName, damage) {
            let defender = this.opponentPokemon.filter(p => p.name === pokemonName)[0];
            if (defender.hp < damage) {
                defender.hp = 0;
                defender.dead = true;
            } else {
                defender.hp = defender.hp - damage;
            }
        },
        handleDamageSocket(pokemonName, damage) {
            let defender = this.selectedPokemon.filter(p => p.name === pokemonName)[0];
            if (defender.hp < damage) {
                defender.hp = 0;
                defender.dead = true;
                if(this.opponentPokemon.every(pokemon => pokemon.dead) || this.selectedPokemon.every(pokemon => pokemon.dead) ) {
                    end()
                }
            } else {
                defender.hp = defender.hp - damage
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
        search(e) {
            let searchValue = e.target.value.toLowerCase();
            for (const pokemon of this.pokemons) {
                if (pokemon.name.toLowerCase().includes(searchValue)) {
                    pokemon.isHidden = false;
                } else {
                    pokemon.isHidden = true;
                }
                if (searchValue === "") {
                    pokemon.isHidden = false;
                }
            }
            if (searchValue === "") {
                this.page = 1;
                this.paginationFix();
            }
            lazyLoadInstance.update()
        },
        firstCharUppercase(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        },
        search(e) {
            let searchValue = e.target.value.toLowerCase();
            for (const pokemon of this.pokemons) {
                if (pokemon.name.toLowerCase().includes(searchValue)) {
                    pokemon.isHidden = false;
                } else {
                    pokemon.isHidden = true;
                }
                if (searchValue === "") {
                    pokemon.isHidden = false;
                }
            }
            if (searchValue === "") {
                this.page = 1;
                this.paginationFix();
            }
        },
        ready() {
            if (this.selectedPokemon.length > 0) {
                this.notallowed = !this.notallowed;
                this.playerReady = !this.playerReady;
                this.playerReady ? socket.emit("ready", this.opponent, this.selectedPokemon) : socket.emit("unready", this.opponent);
            } else {
                alert('Please select 6 pokemons before readying up!');
            }
        },
        end(){
            setTimeout(() => {
                localStorage.removeItem("opponent")
            }, 5000)
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

.battlefield {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.player {
    display: flex;
    flex-direction: column;
    align-items: center;
    border: #888, 2px solid;
}

.opponent {
    display: flex;
    flex-direction: column;
    align-items: center;
    border: #888, 2px solid;
}

.health-bar {
    width: 100%;
    height: 20px;
    background-color: #333333;
    border-radius: 5px;
    margin-top: 5px;
}

.health-bar-inner {
    height: 100%;
    background-color: #4CAF50;
    border-radius: 5px;
}
</style>