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
          <select id="select" v-model="sortBy" @change="sort">
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
        <div class="button-container">
          <button @click="goToPokemons">AllPokemons</button>
        </div>
      </div>
  
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
        sortBy: 'id',
        pokemons: [],
        perPage: 50,
        page: 1,
        direction: false,
        // user_id = localStorage.getItem("user_id"),
      };
    },
    mounted() {
        fetch('http://localhost:3000/api/pokemon/favourites/all/1')
          .then(response => response.json())
          .then(data => {
            this.pokemons = data;
            this.$nextTick(() => {
              this.paginationFix();
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
        // console.log(sortBy)
        let Sort;
        try {
          Sort = sortBy.target.value
        } catch (e) {
          Sort = sortBy.value
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
          return "How is direction removed?";
        }
        this.sort(document.querySelector('select'))
      },
      goToLogin() {
        window.location.replace('/login')
      },
      goToRegister() {
        window.location.replace('/register')
      },
      goToPokemons() {
        window.location.replace('/pokemon')
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
  
  button {
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
  