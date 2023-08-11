import express from 'express';
import createHttpError from 'http-errors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import env from 'dotenv';

import session from 'express-session';
import connectFlash from 'connect-flash';
import passport from 'passport';
import { default as connectMongo } from 'connect-mongodb-session';
import { ensureLoggedIn } from 'connect-ensure-login';

// Import Passport Strategies
import "../dist/auth/passport-local.auth.js";
import "../dist/auth/passport-google.auth.js";

import homeRoutes from './routes/index.routes.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import adminRoutes from './routes/admin.routes.js';

env.config();

// Get Variables
const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI;

// Initialize Server
const app = express();
app.use(morgan('dev'));
app.set('view engine', 'ejs');

// Initialize store
const MongoStore = connectMongo(session);
const store = new MongoStore({
  uri: DB_URI!,
  collection: 'sessions'
});
store.on('error', (error) => { console.error(error); });

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
    maxAge: 24 * 60 * 60 * 1000 // one day in milliseconds
  },
  store: store
}));

// Initiate passport session for JS Authentication
app.use(passport.initialize());
app.use(passport.session());

// add share user with all routes via middleware 
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// Connect flash
app.use(connectFlash());
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

// Routes
app.use('/', homeRoutes);
app.use('/auth', authRoutes);
app.use('/user', ensureLoggedIn({ redirectTo: '/auth/login' }), userRoutes);
app.use('/admin', ensureLoggedIn({ redirectTo: '/auth/login' }), adminRoutes);

app.use((req, res, next) => {
  next(createHttpError.NotFound());
});

app.use((error: any, req: any, res: any, next: any) => {
  error.status = error.status || 500;
  res.status(error.status);
  res.render('error_40x', { error });
});

await mongoose
  .connect(DB_URI!)
  .then(console.log('🛢️  Connected to database...')!)
  .catch((e) => console.log('Error connecting to DB: ', e));

app.listen(PORT, () => console.log(`🚀 App running on port ${PORT}`));​
