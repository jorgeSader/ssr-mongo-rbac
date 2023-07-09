import express from "express";

const router = express.Router();

router.get('/', (req, res, next) => {
  res.send('User Routes!')
})

export default router;