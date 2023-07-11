import express from 'express';
import createHttpError from 'http-errors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import env from 'dotenv';

import homeRoutes from './routes/index.routes.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';

env.config();

const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI;

const app = express();
app.use(morgan('dev'))
app.set('view engine', 'ejs');
app.use(express.static('public'))

app.use('/', homeRoutes)
app.use('/auth', authRoutes)
app.use('/user', userRoutes)

app.use((req, res, next) => {
  next(createHttpError.NotFound());
})

app.use((error, req, res, next) => {
  error.status = error.status || 500;
  res.status(error.status);
  res.send(error);
});

await mongoose
  .connect(DB_URI!)
  .then(console.log('🛢️  Connected to database...')!)
  .catch((e) => console.log('Error connecting to DB: ', e));

app.listen(PORT, () => console.log(`🚀 App running on port ${PORT}`))