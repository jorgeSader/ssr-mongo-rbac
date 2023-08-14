import express from "express";

const router = express.Router();

// GET current User's Profile
router.get('/', async (req, res, next) => {
  res.render('profile');
});

export default router;