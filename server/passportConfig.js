import {Strategy, ExtractJwt } from 'passport-jwt';
import Database from "better-sqlite3"

const cookieExtractor = (req) => {
    let jwt = null

    if (req && req.cookies) {
        jwt = req.cookies['userToken']
    }

    return jwt
}//\

export default (passport) => {

    passport.use("jwt",

        new Strategy({

            jwtFromRequest: cookieExtractor,

            secretOrKey: 'PVnWTWRGHqMnw9mXG3E2KCY8E4U1LYswHaiNefnJXUZrd2NbMkaDClgdDZagnHkpgwWRbJ7ZxkEmdv1N/8TMVxkUDC+BpUjOdeDZ4ILLivWuKYlcpTVc+9N9vNNuko1/w+NgCSjxqArTY6H+iOKM/pHLyc3D1tiiYRdkQnADHVnvkbulsBkNQYkt9qKGg7H2S+Hqo5ofpytVLE31QxubmH9Oz30XL6IWCnGLqNflU4wVCNNta25Z24CsaZSIPqvPpPJ5+/35IhPLy8dXFUMhWuUhJp8O4hEuAPGabeBrZ72Bd0YxEkxxpnDV/OQAxyCziuFtJzO3Ai92MBAaR8oK6g=='

        }, (jwt_payload, done) => {

            let db = new Database('./pokemon.db', {fileMustExist: true});
            let user = db.prepare("SELECT * FROM users WHERE email = ?").get(jwt_payload.email)

            if (user) {

                return done(null, user)

            }

            return done(null, false);

        })

    )

}