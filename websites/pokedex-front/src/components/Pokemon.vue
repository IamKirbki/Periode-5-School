<template>
  <div>
    <div class="header">
      <div>
        <h1>Pokedex</h1>
      </div>
      <div class="search-container">
        <input class="search-input" placeholder="Search" v-model="searchText" @keyup="search">
        <button @click="prev">Previous</button>
        <button @click="next">Next</button>
      </div>
      <div>
        <select id="select" ref="select" @change="sort">
          <option value="id">Sort by</option>
          <option value="weight">Weight</option>
          <option value="hp">Hp</option>
          <option value="attack">Attack</option>
          <option value="defense">Defense</option>
          <option value="speed">Speed</option>
          <option value="special_attack">Special attack</option>
          <option value="special_defense">Special defense</option>
        </select>
        <button @click="reverseSort">Reverse sort</button>
      </div>
      <div class="button-container loginButton">
        <router-link class="nav-link" :to="`/login`">Login</router-link>
        <router-link class="nav-link" :to="`/register`">Register</router-link>
      </div>
      <div class="button-container favoritesButton">
        <router-link class="nav-link" :to="`/favorites`">Favorites</router-link>
        <router-link class="nav-link" :to="`/chatroom`">Chat</router-link>
      </div>
      <div class="button-container loginButton">
        <button @click="logout">Logout</button>
      </div>
    </div>

    <!-- Move the Pokemon cards inside a container -->
    <div class="pokemon-container">
      <div v-for="pokemon in pokemons" :key="pokemon.pokemon_id" class="pokemon-card" :data-name="pokemon.name"
        :data-id="pokemon.pokemon_id" :data-weight="pokemon.weight" :data-base-experience="pokemon.base_experience"
        :data-hp="pokemon.hp" :data-attack="pokemon.attack" :data-defense="pokemon.defense"
        :data-special-attack="pokemon.special_attack" :data-special-defense="pokemon.special_defense"
        :data-speed="pokemon.speed">
        <div>
          <router-link :to="'/pokemon/' + pokemon.id">
            <img class="lazy" :data-src="pokemon.png_url" style="width: 250px; height: 250px;">
          </router-link>
        </div>
        <div>
          <h1>{{ pokemon.name }}</h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LazyLoad from "vanilla-lazyload";

const lazyLoadInstance = new LazyLoad({});

export default {
  data() {
    return {
      searchText: '',
      sortBy: localStorage.getItem("sortBy"),
      pokemons: [],
      perPage: 50,
      page: 1,
      direction: false,
      sortSelect: this.sortSelect,
    };
  },
  mounted() {
    if (localStorage.getItem("user_id")) {
      document.querySelector(".loginButton").style.display = "none"
      document.querySelectorAll(".loginButton")[1].style.display = "flex"
    } else {
      document.querySelector(".favoritesButton").style.display = "none"
      document.querySelectorAll(".loginButton")[1].style.display = "none"
    }
    fetch('http://localhost:3000/api/pokemon/all')
      .then(response => response.json())
      .then(data => {
        this.pokemons = data;
        this.$nextTick(() => {
          this.paginationFix();
          this.$nextTick(() => {
            if (localStorage.getItem("reverseSort") === "true") {
              this.direction = true;
            }
            console.log(this.direction)
            this.sort({ value: localStorage.getItem("sortBy") });
            let selectedValue = localStorage.getItem("sortBy")
            const selectElement = this.$refs.select;
            if (selectedValue) {
              if (selectedValue) {
                for (let i = 0; i < selectElement.options.length; i++) {
                  if (selectElement.options[i].value === selectedValue) {
                    selectElement.options[i].selected = true;
                    break;
                  }
                }
              }
            }
          })
        })
      })
      .catch(error => {
        console.error('Error fetching pokemons:', error);
      });
  },
  methods: {
    paginationFix() {
      let elementList = document.querySelectorAll('.pokemon-card');
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
      // console.log(elementList)
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
      let elementList = document.querySelectorAll('.pokemon-card');
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
    prev() {
      if (this.page !== 1) {
        this.page--;
        this.paginationFix();
      }
    },
    next() {
      let elementList = document.querySelectorAll('.pokemon-card');
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
      if (this.page !== Math.round(filteredElementList.length / this.perPage) + 1) {
        this.page++;
        this.paginationFix();
      }
    },
    sort(sortBy) {
      let html = document.querySelectorAll('.pokemon-card');
      let oldHtml = [...html]
      let Sort;
      try {
        Sort = sortBy.target.value
        localStorage.setItem("sortBy", sortBy.target.value)
      } catch (e) {
        Sort = sortBy.value
        localStorage.setItem("sortBy", sortBy.value)
      }
      for (const htmlElement of oldHtml) {
        htmlElement.remove();
      }
      oldHtml.sort((A, B) => {
        let a = parseInt(A.dataset[Sort]);
        let b = parseInt(B.dataset[Sort]);
        return a - b;
      })
      if (this.direction === true) {
        oldHtml.reverse();
        localStorage.setItem("reverseSort", true)
      } else {
        localStorage.setItem("reverseSort", false)
      }
      for (const htmlElement of oldHtml) {
        document.querySelector('.pokemon-container').appendChild(htmlElement);
      }
      this.paginationFix();
    },
    reverseSort() {
      if (this.direction === true) {
        this.direction = false
      } else if (this.direction === false) {
        this.direction = true
      } else {
        console.error("How is direction removed?");
      }
      console.log(this.direction)
      this.sort(document.querySelector('select'))
    },
    logout() {
      localStorage.removeItem("user_id")
      localStorage.removeItem("user_name")
      localStorage.removeItem("token")
      document.location.reload()
    }
  },
};
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
}

.search-container {
  margin-right: 10px;
}

.search-input {
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
  width: 200px;
}

.button-container {
  display: flex;
  align-items: center;
}

button,
.nav-link {
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
  font-size: 16px;
}

select {
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
}

.pokemon-container {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.pokemon-card {
  width: calc(40% - 20px);
  min-width: 200px;
  height: 450px;
  padding: 20px;
  border-radius: 25px;
  margin: 10px;
  background-color: rgba(220, 220, 220, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.pokemon-card:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1);
  background-color: rgba(220, 220, 220, 0.5);
}

.pokemon-card img {
  max-width: 90%;
  max-height: 90%;
}
</style>
