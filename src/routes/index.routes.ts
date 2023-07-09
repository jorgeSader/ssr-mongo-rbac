import express from "express";

const router = express.Router();

router.get('/', (req, res, next) => {
  res.send('You Look Fantastic Today!')
})

export default router;