import express from "express";

const router = express.Router();

// GET current User's Profile
router.get('/', async (req, res, next) => {
  const currentUser = req.user;
  res.render('profile', { currentUser, selectedUser: false });
});

export default router;