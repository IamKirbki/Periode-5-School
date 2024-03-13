import express from 'express';
import Database from "better-sqlite3";
import path from "path";
import {fileURLToPath} from "url";
import refreshPokemon from "../controllers/pokemonController.js";
import refreshAbilities from "../controllers/abilityController.js";
import AuthController from "../controllers/authController.js";
import passport from "passport";

var router = express.Router();
const db = new Database('./pokemon.db', {fileMustExist: true});
/* GET home page. */
router.get('/pokemon', async function (req, res, next) {
    const query = 'SELECT * FROM pokemons';
    const pokemons = db.prepare(query).all();
    res.render('pokemon', {title: 'Pokemon', pokemons: pokemons});
});

router.get('/api/pokemon/all', async function (req, res, next) {
    try {
        // const query = 'SELECT * FROM pokemons WHERE id <= 200;';
        const query = 'SELECT * FROM pokemons;';
        const pokemons = await db.prepare(query).all();
        res.send(JSON.stringify(pokemons));
    } catch (error) {
        console.error('Error fetching pokemons:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/api/pokemon/login', AuthController.login)
router.post('/api/pokemon/register', AuthController.register)

router.post('/api/pokemon/favourite/:id', async function (req, res, next) {
    const query = "INSERT INTO user_pokemon_favourite (user_id, pokemon_id) VALUES (?, ?)";
    const user_id = req.user.id;

    db.prepare(query).run(user_id, req.params.id)
});

router.get('/api/pokemon/single/:id', async function (req, res, next) {
    try {
        const id = req.params.id;
        const query = 'SELECT * FROM pokemons WHERE id = ?'
        const pokemon = db.prepare(query).get(id);
        res.send(JSON.stringify(pokemon));
    } catch (error) {
        console.error('Error fetching pokemons:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/pokemon/:id/favourite', passport.authenticate("jwt", {session: false}), async function (req, res, next){
   const query = "INSERT INTO user_pokemon_favourite (user_id, pokemon_id) VALUES (?, ?)";
   const user_id = req.user.id;

   db.prepare(query).run(user_id, req.params.id)

    res.redirect('/pokemon/' + req.params.id)
});

router.get('/pokemon/favourite', passport.authenticate('jwt', {session: false}), function(req, res, next){
    let query = "SELECT * FROM pokemons WHERE id IN (SELECT pokemon_id FROM user_pokemon_favourite WHERE user_id = ?);";
    const user_id = req.user.id;

    let pokemons = db.prepare(query).all(user_id);

    res.render('pokemon', {title: 'Pokemon', pokemons: pokemons});
})

router.get('/auth', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    res.send('auth');
});

router.get('/pokemon/:id', async function(req, res, next){
    const id = req.params.id;
    const query = 'SELECT * FROM pokemons WHERE id = ?'
    const pokemon = db.prepare(query).get(id);
    res.render('singlePokemon', {title: pokemon.name, pokemon: pokemon});
})

router.get('/', async function(req, res, next){
    res.render('index');
})
router.get('/login', async function(req, res, next){
    res.render('login');
})
router.get('/register', async function(req, res, next){
    res.render('register');
})

router.post('/login/attempt', AuthController.login)

router.post('/register/attempt', AuthController.register);

router.post('/refresh', function (req, res, next) {
    // new pokemonSearchController();
    refreshAbilities().then(value => {
        refreshPokemon()
    });
    res.send('Het is bezig, zie de console voor hoe ver die is, ' +
        'als hij niet bezig lijkt is die dat waarschijnlijk wel');
});

export default router;
