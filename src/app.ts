import express from 'express';
import createHttpError from 'http-errors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import env from 'dotenv';

import session from 'express-session';
import connectFlash from 'connect-flash';
import passport from 'passport';

// Import Passport Strategies
import "../dist/auth/passport-local.auth.js";
import "../dist/auth/passport-google.auth.js";

import homeRoutes from './routes/index.routes.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';

import { togglePasswordView } from "./dist/utils/password-show.js";

env.config();

// Get Variables
const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI;

// Initialize Server
const app = express();
app.use(morgan('dev'));
app.set('view engine', 'ejs');

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Init Session
app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    // secure: true, // TODO: comment in for production.
    httpOnly: true,
    maxAge: 15000 //24 * 60 * 60 * 1000 // one day in milliseconds
  }
}));

// Initiate passport session for JS Authentication
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(connectFlash());
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

// Routes
app.use('/', homeRoutes);
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => {
  next(createHttpError.NotFound());
});

// app.use((error, req, res, next) => {
//   error.status = error.status || 500;
//   res.status(error.status);
//   res.render('error_40x', { error });
//   res.send(error);
// });

await mongoose
  .connect(DB_URI!)
  .then(console.log('🛢️  Connected to database...')!)
  .catch((e) => console.log('Error connecting to DB: ', e));

app.listen(PORT, () => console.log(`🚀 App running on port ${PORT}`));​
