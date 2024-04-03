import Database from "better-sqlite3";
class AbilityRefresher {
  constructor() {
    this.db = new Database('./pokemon.db', {fileMustExist: true});
    this.limit = 367; // Default limit
    this.count = 0;
    this.startTimeAbilities = performance.now();
  }

  async refresh() {
    this.clearDatabase();

    console.log("Abilities Started");

    const abilityResponse = await fetch(`https://pokeapi.newdeveloper.nl/api/v2/ability/?limit=${this.limit}`);
    const abilitiesData = await abilityResponse.json();

    for (const abilityData of abilitiesData.results) {
      this.count++;

      const singleAbilityResponse = await fetch(abilityData.url);
      const singleAbility = await singleAbilityResponse.json();

      this.insertAbility(singleAbility.name, singleAbility.id);

      this.logProgress();

      if (this.count === this.limit) {
        this.logCompletion();
      }
    }
  }

  clearDatabase() {
    this.db.prepare('DELETE FROM ability_pokemon').run();
    this.db.prepare('DELETE FROM abilities').run();
  }

  insertAbility(name, id) {
    let query = "INSERT INTO abilities (name, ability_id) VALUES (?, ?)";
    try {
      this.db.prepare(query).run(name, id);
    } catch (e) {
      console.log(e);
    }
  }

  logProgress() {
    if (this.count % 50 === 0 || this.count === this.limit) {
      let percentage = (Math.round(((this.count / this.limit * 100) + Number.EPSILON) * 100) / 100);
      const currentTime = performance.now();
      let timeWasted = currentTime - this.startTimeAbilities;
      console.log(`Abilities at ${percentage}% - ${Math.round(timeWasted)}ms`);
      let timeLeft = Math.round(((timeWasted / this.count) * this.limit) - timeWasted);
      console.log(`${this.formatMilliseconds(timeLeft)} left`);
    }
  }

  logCompletion() {
    const currentTime = performance.now();
    let percentage = (Math.round(((this.count / this.limit * 100) + Number.EPSILON) * 100) / 100);
    let timeWasted = currentTime - this.startTimeAbilities;
    console.log(`Abilities at ${percentage}% - ${Math.round(timeWasted)}ms`);
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

export default AbilityRefresher;
