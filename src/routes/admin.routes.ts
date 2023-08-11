import express from "express";
import { ensureLoggedIn } from "connect-ensure-login";

const router = express.Router();

router.get('/', ensureLoggedIn('/auth/login/'), (req, res) => {
  res.render('index');
});

export default router;