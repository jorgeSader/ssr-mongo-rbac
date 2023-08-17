import express from "express";
import { ensureLoggedIn } from "connect-ensure-login";
import { getUserById, getUserList, updateRole } from "../controllers/user.controllers.js";
import { ensureRole } from "../auth/basic.auth.js";
import { roles } from "../utils/constants.js";

const router = express.Router();

router.get('/', ensureLoggedIn('/auth/login/'), (req, res) => { res.render('index'); });

router.get('/users', ensureLoggedIn('/auth/login/'), ensureRole([roles.superAdmin, roles.admin]), getUserList);

router.get('/users/:userId', ensureLoggedIn('/auth/login/'), ensureRole([roles.superAdmin, roles.admin]), getUserById);

router.post('/update-role', ensureLoggedIn('/auth/login/'), ensureRole([roles.superAdmin, roles.admin]), updateRole);

export default router;