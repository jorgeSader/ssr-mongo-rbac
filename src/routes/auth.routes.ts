import express from "express";

const router = express.Router();

router.get('/', (req, res, next) => {
  res.send('Auth Routes!')
})

export default router;