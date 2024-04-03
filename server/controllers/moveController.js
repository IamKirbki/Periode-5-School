import Database from "better-sqlite3";

class freshMoves {
  constructor() {
    this.db = new Database("./pokemon.db", { fileMustExist: true });
    this.startTime = performance.now();
    this.count = 0;
    this.limit = 937;
    console.log("Moves Started");
  }
  async refresh() {
    this.db.prepare("DELETE FROM moves").run();
    const response = await fetch(
      "https://pokeapi.newdeveloper.nl/api/v2/move/?limit=" + this.limit
    );
    const moves = await response.json();
    for (const move of moves.results) {
      this.count++;
      const response = await fetch(move.url);
      const singleMove = await response.json();
      let moveProperties = {
        name: singleMove.name,
        accuracy: singleMove.accuracy,
        effect_chance: singleMove.effect_chance,
        pp: singleMove.pp,
        priority: singleMove.priority,
        power: singleMove.power,
        damage_class: singleMove.damage_class.name,
      };
      let query =
        "INSERT INTO moves (name, accuracy, effect_chance, pp, priority, power, damage_class) VALUES (?, ?, ?, ?, ?, ?, ?)";
      try {
        this.db
          .prepare(query)
          .run(
            moveProperties.name,
            moveProperties.accuracy,
            moveProperties.effect_chance,
            moveProperties.pp,
            moveProperties.priority,
            moveProperties.power,
            moveProperties.damage_class
          );
      } catch (e) {
        console.log(e);
      }
      if (this.count % 50 === 0) {
        this.timeleft();
      } else if (this.count === this.limit) {
        this.finsihed();
      }
    }
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
  timeleft() {
    let percentage =
        Math.round(((this.count / this.limit) * 100 + Number.EPSILON) * 100) / 100,
      currentTime = performance.now(),
      timeWasted = currentTime - this.startTime,
      timeLeft = Math.round((timeWasted / this.count) * this.limit - timeWasted);

    console.log(
      "Moves at " + percentage + "% - " + Math.round(timeWasted) + "ms"
    );
    console.log(this.formatMilliseconds(timeLeft) + " left");
  }
  finsihed() {
    let percentage =
        Math.round(((this.count / this.limit) * 100 + Number.EPSILON) * 100) / 100,
      currentTime = performance.now(),
      timeWasted = currentTime - this.startTime;

    console.log(
      "Moves at " + percentage + "% - " + Math.round(timeWasted) + "ms"
    );
  }
}

export default freshMoves;
