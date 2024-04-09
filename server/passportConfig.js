import { Strategy, ExtractJwt } from "passport-jwt";
import Database from "better-sqlite3";

//This function will extract the token from the request
const cookieExtractor = (req) => {
  let jwt = null;
  //If the request has headers it will extract the token from the headers
  if (jwt === null && req && req.headers) {
    //Here it will extract the token from the headers
    let func = ExtractJwt.fromAuthHeaderAsBearerToken();
    //Here it will return the token
    return func(req);
  }
  if (jwt === null && req && req.cookies) {
    jwt = req.cookies["userToken"];
  }

  return jwt;
}; //\

export default (passport) => {
  passport.use(
    "jwt",

    //This is the strategy that will be used to authenticate the user
    new Strategy(
      {
        //This is the function that will extract the token from the cookies
        jwtFromRequest: cookieExtractor,

        secretOrKey:
          "PVnWTWRGHqMnw9mXG3E2KCY8E4U1LYswHaiNefnJXUZrd2NbMkaDClgdDZagnHkpgwWRbJ7ZxkEmdv1N/8TMVxkUDC+BpUjOdeDZ4ILLivWuKYlcpTVc+9N9vNNuko1/w+NgCSjxqArTY6H+iOKM/pHLyc3D1tiiYRdkQnADHVnvkbulsBkNQYkt9qKGg7H2S+Hqo5ofpytVLE31QxubmH9Oz30XL6IWCnGLqNflU4wVCNNta25Z24CsaZSIPqvPpPJ5+/35IhPLy8dXFUMhWuUhJp8O4hEuAPGabeBrZ72Bd0YxEkxxpnDV/OQAxyCziuFtJzO3Ai92MBAaR8oK6g==",
      },
      (jwt_payload, done) => {
        //Here it gets the user from the database
        let db = new Database("./pokemon.db", { fileMustExist: true });
        let user = db
          .prepare("SELECT * FROM users WHERE email = ?")
          .get(jwt_payload.email);

        return done(null, user);
      }
    )
  );
};
