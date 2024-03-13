import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import {v4 as uuidv4} from 'uuid';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import express from 'express';
import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import passport from "passport";
import passportConfig from "./passportConfig.js";
import cors from "cors";

const db = new Database(path.dirname(fileURLToPath(import.meta.url)) + '/../pokemon.db', {fileMustExist: true});
uuidv4();


var app = express();

app.use(cors({
    origin: 'http://localhost:5173'
}));
// const cors = require('cors');

// view engine setup
app.set('views', path.join(path.dirname(fileURLToPath(import.meta.url)), 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), '../public')));
passportConfig(passport);
app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', usersRouter);


// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });
//
// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

export default app;