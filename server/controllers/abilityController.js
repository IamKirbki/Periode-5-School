import Database from "better-sqlite3";

async function fresh() {
    let limit = 367;
    // let limit = 10;
    let count = 0;
    const db = new Database('./pokemon.db', {fileMustExist: true});
    db.prepare('DELETE FROM ability_pokemon').run();
    let query = "DELETE FROM abilities";
    db.exec(query);
    const response = await fetch("https://pokeapi.newdeveloper.nl/api/v2/ability/?limit="+limit);
    const ability = await response.json();
    const abilities = [];
    console.log("Abilities Started")
    let startTimeAbilities = performance.now();
    for (const ability1 of ability.results) {
        count++;
        const response = await fetch(ability1.url);
        const singleAbility = await response.json();
        let query = "INSERT INTO abilities (name, ability_id) VALUES (?, ?)"
        try {
            db.prepare(query).run(singleAbility.name, singleAbility.id);
        } catch (e) {
            console.log(e)
        }
        if (count % 50 === 0) {
            let percentage = (Math.round(((count / limit * 100) + Number.EPSILON) * 100) / 100)
            const currentTime = performance.now();
            let timeWasted = currentTime - startTimeAbilities
            console.log("Abilities at " + percentage + "% - " + Math.round(timeWasted) + "ms")
            let timeLeft = Math.round(((timeWasted / count) * limit) - timeWasted)
            console.log(formatMilliseconds(timeLeft) + " left")
        } else if(count === limit){
            const currentTime = performance.now();
            let percentage = (Math.round(((count / limit * 100) + Number.EPSILON) * 100) / 100)
            let timeWasted = currentTime - startTimeAbilities
            console.log("Abilities at " + percentage + "% - " + Math.round(timeWasted) + "ms")
        }
        abilities.push(singleAbility);
    }
    return abilities
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


const refreshAbilities = () => {
    return fresh();
}

export default refreshAbilities;