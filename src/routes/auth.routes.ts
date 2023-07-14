import express from "express";
import { User } from "../models/user.model.js";

const router = express.Router();

// Login
router.get('/login', async (req, res, next) => {
  res.render('login');
});
router.post('/login', async (req, res, next) => {
  res.send('Login Post');
});

// Logout
router.get('/logout', async (req, res, next) => {
  res.redirect('../');
});

// Register
router.get('/register', async (req, res, next) => {
  res.render('register');
});

router.post('/register', async (req, res, next) => {
  try {
    const { email } = req.body;
    const doesExist = await User.findOne({ email });

    if (doesExist) {
      res.redirect('/auth/register');
      return;
    }

    const user = new User(req.body);
    await user.save();
    res.send(user);
  } catch (error) {
    next(error);
  }

});

export default router; 