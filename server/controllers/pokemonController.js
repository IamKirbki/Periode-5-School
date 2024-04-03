import Database from "better-sqlite3";
import fetch from 'node-fetch';

class PokemonRefresher {
  constructor() {
    this.db = new Database('./pokemon.db', {fileMustExist: true});
    this.limit = 1302; // Default limit
  }

  async refresh() {
    const startTimePokemon = performance.now();
    let count = 0;

    this.clearDatabase();

    console.log("Pokemon Started");
    
    const pokemonResponse = await fetch(`https://pokeapi.newdeveloper.nl/api/v2/pokemon/?limit=${this.limit}`);
    const pokemonData = await pokemonResponse.json();

    for (const pokemonElement of pokemonData.results) {
      count++;

      const singlePokemonResponse = await fetch(pokemonElement.url);
      const singlePokemon = await singlePokemonResponse.json();

      this.insertPokemon(singlePokemon, startTimePokemon, count);

      if (count === this.limit) {
        this.logCompletion(startTimePokemon, count);
      }
    }

    this.db.close();
  }

  clearDatabase() {
    this.db.exec('DELETE FROM user_pokemon_favourite');
    this.db.exec('DELETE FROM ability_pokemon');
    this.db.exec('DELETE FROM pokemons');
  }

  async insertPokemon(pokemon, startTime, count) {
    const baseStats = pokemon.stats.slice(0, 6).map(stat => stat.base_stat);
    const apiResponse = await fetch("https://pokeapi.co/api/v2/pokemon/" + pokemon.id);
    const apiData = await apiResponse.json();
    const pngURL = apiData.sprites.front_default;

    const pokemonData = {
      name: pokemon.name.includes("-") ? pokemon.name.replace("-", " ") : pokemon.name,
      weight: pokemon.weight,
      pokemon_id: pokemon.id,
      base_experience: pokemon.base_experience,
      hp: baseStats[0],
      attack: baseStats[1],
      defense: baseStats[2],
      special_attack: baseStats[3],
      special_defense: baseStats[4],
      speed: baseStats[5],
      png_url: pngURL
    };

    const query = "INSERT INTO pokemons (name, weight, pokemon_id, base_experience, hp, attack, defense, special_attack, special_defense, speed, png_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    try {
      this.db.prepare(query).run(
        pokemonData.name,
        pokemonData.weight,
        pokemonData.pokemon_id,
        pokemonData.base_experience,
        pokemonData.hp,
        pokemonData.attack,
        pokemonData.defense,
        pokemonData.special_attack,
        pokemonData.special_defense,
        pokemonData.speed,
        pokemonData.png_url
      );
    } catch (e) {
      console.log(e);
    }

    for (const ability of pokemon.abilities) {
      const abilityResponse = await fetch(ability.ability.url);
      const singleAbility = await abilityResponse.json();
      const query = "INSERT INTO ability_pokemon (ability_id, pokemon_id) VALUES (?, ?)";
      try {
        this.db.prepare(query).run(singleAbility.id, pokemonData.pokemon_id);
      } catch (e) {
        console.log(e);
      }
    }

    this.logProgress(count, startTime);
  }

  logProgress(count, startTime) {
    if (count % 50 === 0 || count === this.limit) {
      const percentage = (Math.round(((count / this.limit * 100) + Number.EPSILON) * 100) / 100);
      const currentTime = performance.now();
      const timeWasted = currentTime - startTime;
      console.log(`Pokemon at ${percentage}% - ${Math.round(timeWasted)}ms`);
      const timeLeft = Math.round(((timeWasted / count) * this.limit) - timeWasted);
      console.log(`${this.formatMilliseconds(timeLeft)} left`);
    }
  }

  logCompletion(startTime, count) {
    const percentage = (Math.round(((count / this.limit * 100) + Number.EPSILON) * 100) / 100);
    const currentTime = performance.now();
    const timeWasted = currentTime - startTime;
    console.log(`Pokemon at ${percentage}% - ${Math.round(timeWasted)}ms`);
  }

  formatMilliseconds(milliseconds) {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

    let formattedString = "";
    if (hours > 0) {
      formattedString += hours + " hours ";
    }
    if (minutes > 0) {
      formattedString += minutes + " minutes ";
    }
    if (seconds > 0) {
      formattedString += seconds + " seconds ";
    }

    return formattedString.trim();
  }
}

export default PokemonRefresher;
