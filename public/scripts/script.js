async function test() {
    const response = await fetch("https://pokeapi.newdeveloper.nl/api/v2/pokemon/1/");
    const pokemon = await response.json();
    console.log(pokemon);
}

let allLinks = {
    "ability": "http://pokeapi.newdeveloper.nl/api/v2/ability/",
    "berry": "http://pokeapi.newdeveloper.nl/api/v2/berry/",
    "berry-firmness": "http://pokeapi.newdeveloper.nl/api/v2/berry-firmness/",
    "berry-flavor": "http://pokeapi.newdeveloper.nl/api/v2/berry-flavor/",
    "characteristic": "http://pokeapi.newdeveloper.nl/api/v2/characteristic/",
    "contest-type": "http://pokeapi.newdeveloper.nl/api/v2/contest-type/",
    "contest-effect": "http://pokeapi.newdeveloper.nl/api/v2/contest-effect/",
    "egg-group": "http://pokeapi.newdeveloper.nl/api/v2/egg-group/",
    "encounter-method": "http://pokeapi.newdeveloper.nl/api/v2/encounter-method/",
    "encounter-condition": "http://pokeapi.newdeveloper.nl/api/v2/encounter-condition/",
    "encounter-condition-value": "http://pokeapi.newdeveloper.nl/api/v2/encounter-condition-value/",
    "evolution-chain": "http://pokeapi.newdeveloper.nl/api/v2/evolution-chain/",
    "evolution-trigger": "http://pokeapi.newdeveloper.nl/api/v2/evolution-trigger/",
    "generation": "http://pokeapi.newdeveloper.nl/api/v2/generation/",
    "gender": "http://pokeapi.newdeveloper.nl/api/v2/gender/",
    "growth-rate": "http://pokeapi.newdeveloper.nl/api/v2/growth-rate/",
    "item": "http://pokeapi.newdeveloper.nl/api/v2/item/",
    "item-category": "http://pokeapi.newdeveloper.nl/api/v2/item-category/",
    "item-attribute": "http://pokeapi.newdeveloper.nl/api/v2/item-attribute/",
    "item-fling-effect": "http://pokeapi.newdeveloper.nl/api/v2/item-fling-effect/",
    "item-pocket": "http://pokeapi.newdeveloper.nl/api/v2/item-pocket/",
    "language": "http://pokeapi.newdeveloper.nl/api/v2/language/",
    "location": "http://pokeapi.newdeveloper.nl/api/v2/location/",
    "location-area": "http://pokeapi.newdeveloper.nl/api/v2/location-area/",
    "machine": "http://pokeapi.newdeveloper.nl/api/v2/machine/",
    "move": "http://pokeapi.newdeveloper.nl/api/v2/move/",
    "move-ailment": "http://pokeapi.newdeveloper.nl/api/v2/move-ailment/",
    "move-battle-style": "http://pokeapi.newdeveloper.nl/api/v2/move-battle-style/",
    "move-category": "http://pokeapi.newdeveloper.nl/api/v2/move-category/",
    "move-damage-class": "http://pokeapi.newdeveloper.nl/api/v2/move-damage-class/",
    "move-learn-method": "http://pokeapi.newdeveloper.nl/api/v2/move-learn-method/",
    "move-target": "http://pokeapi.newdeveloper.nl/api/v2/move-target/",
    "nature": "http://pokeapi.newdeveloper.nl/api/v2/nature/",
    "pal-park-area": "http://pokeapi.newdeveloper.nl/api/v2/pal-park-area/",
    "pokedex": "http://pokeapi.newdeveloper.nl/api/v2/pokedex/",
    "pokemon": "http://pokeapi.newdeveloper.nl/api/v2/pokemon/",
    "pokemon-color": "http://pokeapi.newdeveloper.nl/api/v2/pokemon-color/",
    "pokemon-form": "http://pokeapi.newdeveloper.nl/api/v2/pokemon-form/",
    "pokemon-habitat": "http://pokeapi.newdeveloper.nl/api/v2/pokemon-habitat/",
    "pokemon-shape": "http://pokeapi.newdeveloper.nl/api/v2/pokemon-shape/",
    "pokemon-species": "http://pokeapi.newdeveloper.nl/api/v2/pokemon-species/",
    "pokeathlon-stat": "http://pokeapi.newdeveloper.nl/api/v2/pokeathlon-stat/",
    "region": "http://pokeapi.newdeveloper.nl/api/v2/region/",
    "stat": "http://pokeapi.newdeveloper.nl/api/v2/stat/",
    "super-contest-effect": "http://pokeapi.newdeveloper.nl/api/v2/super-contest-effect/",
    "type": "http://pokeapi.newdeveloper.nl/api/v2/type/",
    "version": "http://pokeapi.newdeveloper.nl/api/v2/version/",
    "version-group": "http://pokeapi.newdeveloper.nl/api/v2/version-group/"
}

const { Server } = require('socket.io'); 