<template>
  <div class="pokemon-details">
    <img :src="pokemon.png_url" class="pokemon-image">
    <h1>{{ pokemon.name }}</h1>
    <div class="pokemon-stats">
      <table>
        <tr>
          <td>HP</td>
          <td>{{ pokemon.hp }}</td>
          <td>
            <div
                :style="{ width: pokemon.hp / 2 + '%'}"
            >
              <div class="stat-bar fade-in"
                   :style="{backgroundColor: getStatBarColor(pokemon.hp)}"></div>
            </div>
          </td>
        </tr>
        <tr>
          <td>Attack</td>
          <td>{{ pokemon.attack }}</td>
          <td>
            <div
                :style="{ width: pokemon.attack / 2 + '%'}"
            >
              <div class="stat-bar fade-in"
                   :style="{backgroundColor: getStatBarColor(pokemon.attack)}"></div>
            </div>
          </td>
        </tr>
        <tr>
          <td>Defense</td>
          <td>{{ pokemon.defense }}</td>
          <td>
            <div
                :style="{ width: pokemon.defense / 2 + '%'}"
            >
              <div class="stat-bar fade-in"
                   :style="{backgroundColor: getStatBarColor(pokemon.defense)}"></div>
            </div>
          </td>
        </tr>
        <tr>
          <td>Special Attack</td>
          <td>{{ pokemon.special_attack }}</td>
          <td>
            <div
                :style="{ width: pokemon.special_attack / 2 + '%'}"
            >
              <div class="stat-bar fade-in"
                   :style="{backgroundColor: getStatBarColor(pokemon.special_attack)}"></div>
            </div>
          </td>
        </tr>
        <tr>
          <td>Special Defense</td>
          <td>{{ pokemon.special_defense }}</td>
          <td>
            <div
                :style="{ width: pokemon.special_defense / 2 + '%'}"
            >
              <div class="stat-bar fade-in"
                   :style="{backgroundColor: getStatBarColor(pokemon.special_defense)}"></div>
            </div>
          </td>
        </tr>
        <tr>
          <td>Speed</td>
          <td>{{ pokemon.speed }}</td>
          <td>
            <div
                :style="{ width: pokemon.speed / 2 + '%'}"
            >
              <div class="stat-bar fade-in"
                   :style="{backgroundColor: getStatBarColor(pokemon.speed)}"></div>
            </div>
          </td>
        </tr>
      </table>
    </div>
    <form @submit.prevent="addToFavorites" class="add-to-favorites-form">
      <button type="submit" class="add-to-favorites-button">
        <!--        <img src="https://www.levensceremonie.nl/wp-content/uploads/2011/12/Star_Glow-1080x675.png" class="star-icon">-->
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="25%" width="25%"
             version="1.1" id="Capa_1" viewBox="0 0 47.94 47.94" xml:space="preserve">
<path style="fill:#ED8A19;"
      d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757  c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042  c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685  c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528  c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956  C22.602,0.567,25.338,0.567,26.285,2.486z"/>
</svg>
      </button>
    </form>
    <div class="back-button-container">
      <button @click="goBack" class="back-button">Back</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pokemon: []
    }
  },
  mounted() {
    fetch(`http://localhost:3000/api/pokemon/single/${this.$route.params.id}`)
        .then(response => response.json())
        .then(data => {
          this.pokemon = data;
        })
        .catch(error => {
          console.error('Error fetching pokemons:', error);
        });
  },
  methods: {
    addToFavorites() {
      this.$emit('add-to-favorites', this.pokemon.id);
    },
    goBack() {
      window.location.replace("http://localhost:5173/pokemon");
    },
    getStatBarColor(value) {
      if (value > 75) {
        return 'green';
      } else if (value > 50) {
        return 'yellow';
      } else if (value > 25) {
        return 'orange';
      } else {
        return 'red';
      }
    }
  }
}
</script>

<style scoped>
.pokemon-details {
  padding: 20px;
}

.pokemon-image {
  width: 200px;
  height: 200px;
}

.pokemon-stats table {
  width: 100%;
  border-collapse: collapse;
}

.pokemon-stats td {
  padding: 8px;
  border-bottom: 1px solid #ddd;
  text-align: left;
}

.stat-bar {
  height: 10px;
  background-color: #4CAF50;
}

tr > td:nth-child(2) {
  text-align: center;
}

tr > td:nth-child(3) {
  width: 25%;
}

.add-to-favorites-form {
  margin-top: 10px;
}

.add-to-favorites-button {
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.star-icon {
  width: 50px;
  height: auto;
}

.back-button-container {
  margin-top: 10px;
}

.back-button {
  background-color: #4CAF50;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.back-button:hover {
  background-color: #45a049;
}

.fade-in {
  animation: fadeIn 1s ease forwards;
  width: 0;
}

@keyframes fadeIn {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}
</style>