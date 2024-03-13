import Database from "better-sqlite3";

async function fresh() {
    let id = 1025;
    const db = new Database('./pokemon.db', {fileMustExist: true});
    let query = "DELETE FROM pokemons";
    db.exec(query);
    let count = 0;
    let limit = 1302;
    // let limit = 1;
    const response = await fetch("https://pokeapi.newdeveloper.nl/api/v2/pokemon/?limit=" + limit);
    const pokemon = await response.json();
    const pokemons = [];
    console.log("Pokemon Started")
    let startTimePokemon = performance.now();
    for (const pokemonElement of pokemon.results) {
        count++;
        const response = await fetch(pokemonElement.url);
        const pokemon = await response.json();
        let query = "INSERT INTO pokemons (name, weight, pokemon_id, base_experience, hp, attack, defense, special_attack, special_defense, speed, png_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        let stats = pokemon.stats.slice(0, 6);
        let base_stats = [];
        let url = pokemonElement.url
        const apiResponse = await fetch(pokemonElement.url.replace("http://pokeapi.newdeveloper.nl", "https://pokeapi.co"));
        const API = await apiResponse.json();
        // console.log(API.sprites)
        let pngURL = API.sprites.front_default;
        for (const baseStat of stats) {
            base_stats.push(baseStat.base_stat)
        }
        const pokemonData = {
            name: pokemon.name,
            weight: pokemon.weight,
            pokemon_id: pokemon.id,
            base_experience: pokemon.base_experience,
            hp: base_stats[0],
            attack: base_stats[1],
            defense: base_stats[2],
            special_attack: base_stats[3],
            special_defense: base_stats[4],
            speed: base_stats[5],
            png_url: pngURL
        };
        try {
            db.prepare(query).run(pokemonData.name, pokemonData.weight, pokemonData.pokemon_id, pokemonData.base_experience, pokemonData.hp, pokemonData.attack, pokemonData.defense, pokemonData.special_attack, pokemonData.special_defense, pokemonData.speed, pokemonData.png_url);
        } catch (e) {
            console.log(e)
        }

        for (const ability of pokemon.abilities) {
            const response = await fetch(ability.ability.url);
            const singleAbility = await response.json();
            let query = "INSERT INTO ability_pokemon (ability_id, pokemon_id) VALUES (?, ?)"
            try {
                // console.log(singleAbility.id, pokemonData.pokemon_id)
                db.prepare(query).run(singleAbility.id, pokemonData.pokemon_id)
            } catch (e) {
                console.log(singleAbility.id, pokemonData.pokemon_id)
                // console.log(pokemon)
                console.log(e)
            }
        }


        if (count % 50 === 0) {
            let percentage = (Math.round(((count / limit * 100) + Number.EPSILON) * 100) / 100)
            const currentTime = performance.now();
            let timeWasted = currentTime - startTimePokemon
            console.log("Pokemon at " + percentage + "% - " + Math.round(timeWasted) + "ms")
            let timeLeft = Math.round(((timeWasted / count) * limit) - timeWasted)
            console.log(formatMilliseconds(timeLeft) + " left")
        } else if (count === limit) {
            const currentTime = performance.now();
            let percentage = (Math.round(((count / limit * 100) + Number.EPSILON) * 100) / 100)
            let timeWasted = currentTime - startTimePokemon
            console.log("Pokemon at " + percentage + "% - " + Math.round(timeWasted) + "ms")
        }
        // console.log(pokemon.name)
        pokemons.push(pokemon);

    }
    db.close();
    return pokemons;
}

function formatMilliseconds(milliseconds) {
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

const refreshPokemon = () => {
    return fresh();
}

export default refreshPokemon;