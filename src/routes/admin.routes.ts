import express from "express";
import { ensureLoggedIn } from "connect-ensure-login";
import { getUserList } from "../controllers/user.controllers.js";
import { ensureRole } from "../auth/basic.auth.js";
import { roles } from "../utils/constants.js";

const router = express.Router();

router.get('/', ensureLoggedIn('/auth/login/'), (req, res) => {
  res.render('index');
});

router.get('/users', ensureLoggedIn('/auth/login/'), ensureRole([roles.superAdmin]), getUserList);

export default router;