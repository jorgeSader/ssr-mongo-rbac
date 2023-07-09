import express from "express";

const router = express.Router();

// GETS
router.get('/login', async (req, res, next) => {
  res.render('login')
})
router.get('/register', async (req, res, next) => {
  res.render('register')
})
router.get('/logout', async (req, res, next) => {
  res.redirect('../')
})


// POSTS
router.post('/login', async (req, res, next) => {
  res.send('Login Post')
})
router.post('/register', async (req, res, next) => {
  res.send('register Post')
})

export default router; 