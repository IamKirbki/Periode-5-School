import Database from "better-sqlite3";
import bcrypt, {hash} from "bcrypt";
import jsonwebtoken from "jsonwebtoken";

class AuthController {
    static async register(req, res, next) {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        // res.json({ name: name, email: email, password: password});

        let db = new Database('./pokemon.db', {fileMustExist: true});

        let existingUser;

        try {
            let query = "SELECT * FROM users WHERE email = ?";
            existingUser = db.prepare(query).get(email);
        } catch (e) {
            console.log(e);
        }
        if (existingUser) {
            res.json('Gebruiker bestaat al');
            return;
        } else {
            let hashedPassword = await bcrypt.hash(password, 13);
            let query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)"
            try {
                db.prepare(query).run(name, email, hashedPassword);
                res.json('Gebruiker is aangemaakt!');
                return;
            } catch (e) {
                res.json(e)
            }
        }
    }

    static async login(req, res, next) {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        let db = new Database('./pokemon.db', {fileMustExist: true});
        let userDB = db.prepare("SELECT * FROM users WHERE email = ?").get(email)
        let match;
        if (userDB) {
            match = await bcrypt.compare(password, userDB.password);
        } else {
            return;
        }

        if (match) {
            let token = await jsonwebtoken.sign(
                {email: userDB.email},
                'PVnWTWRGHqMnw9mXG3E2KCY8E4U1LYswHaiNefnJXUZrd2NbMkaDClgdDZagnHkpgwWRbJ7ZxkEmdv1N/8TMVxkUDC+BpUjOdeDZ4ILLivWuKYlcpTVc+9N9vNNuko1/w+NgCSjxqArTY6H+iOKM/pHLyc3D1tiiYRdkQnADHVnvkbulsBkNQYkt9qKGg7H2S+Hqo5ofpytVLE31QxubmH9Oz30XL6IWCnGLqNflU4wVCNNta25Z24CsaZSIPqvPpPJ5+/35IhPLy8dXFUMhWuUhJp8O4hEuAPGabeBrZ72Bd0YxEkxxpnDV/OQAxyCziuFtJzO3Ai92MBAaR8oK6g==',
                {expiresIn: "1h"}
            )
            res.cookie("userToken", token);
            res.send("Je bent ingelogd!")
        } else {
            res.send("Dit account staat niet in onze database")
        }
        return;
    }

    static async APIlogin(req, res, next) {
        const email = req.body.email;
        const password = req.body.password;

        console.log(req.body.password)

        let db = new Database('./pokemon.db', {fileMustExist: true});
        let userDB = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
        let match;
        if (userDB) {
            match = await bcrypt.compare(password, userDB.password);
        } else {
            return;
        }
        if (match) {
            let token = await jsonwebtoken.sign(
                {email: userDB.email},
                'PVnWTWRGHqMnw9mXG3E2KCY8E4U1LYswHaiNefnJXUZrd2NbMkaDClgdDZagnHkpgwWRbJ7ZxkEmdv1N/8TMVxkUDC+BpUjOdeDZ4ILLivWuKYlcpTVc+9N9vNNuko1/w+NgCSjxqArTY6H+iOKM/pHLyc3D1tiiYRdkQnADHVnvkbulsBkNQYkt9qKGg7H2S+Hqo5ofpytVLE31QxubmH9Oz30XL6IWCnGLqNflU4wVCNNta25Z24CsaZSIPqvPpPJ5+/35IhPLy8dXFUMhWuUhJp8O4hEuAPGabeBrZ72Bd0YxEkxxpnDV/OQAxyCziuFtJzO3Ai92MBAaR8oK6g==',
                {expiresIn: "1h"}
            )
            console.log("sbahdsbajh")
            res.json({ token: token, user_id: userDB.id, user_name: userDB.name, status: "done"});
        } else {
            res.json({ token: null, user_id: null, user_name: null, status: "Not done"});
        }
        return;
    }

    static async APIregister(req, res, next) {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        // res.json({ name: name, email: email, password: password});

        let db = new Database('./pokemon.db', {fileMustExist: true});

        let existingUser;

        try {
            let query = "SELECT * FROM users WHERE email = ?";
            existingUser = db.prepare(query).get(email);
        } catch (e) {
            console.log(e);
        }
        if (existingUser) {
            res.json('Gebruiker bestaat al');
            return;
        } else {
            let hashedPassword = await bcrypt.hash(password, 13);
            let query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)"
            try {
                db.prepare(query).run(name, email, hashedPassword);
                res.json("Done")
                return;
            } catch (e) {
                res.json(e)
            }
        }
    }
}

export default AuthController;