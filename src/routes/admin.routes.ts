import express from "express";
import { ensureLoggedIn } from "connect-ensure-login";

import { ensureRole } from "../auth/basic.auth.js";
import { roles } from "../utils/constants.js";
import { getUserById, getUserList, updateRole } from "../controllers/user.controllers.js";
import { getAccountById, getAccountList } from "../controllers/account.controllers.js";

const router = express.Router();

// GET /admin/ - Should Render admin page but currently renders home ('/').
router.get('/', (req, res) => { res.render('index'); }); // TODO: see comment above

// GET /admin/account/ - get all registered accounts (requires SuperAdmin) 
router.get('/account', ensureRole([roles.superAdmin]), getAccountList);

// GET /admin/account/:accountId - get a registered account by ID (requires SuperAdmin) 
router.get('/account/:accountId', ensureRole([roles.superAdmin]), getAccountById);


router.get('/user', ensureRole([roles.superAdmin, roles.admin]), getUserList);

router.get('/user/:userId', ensureRole([roles.superAdmin, roles.admin]), getUserById);

router.post('/update-role', ensureRole([roles.superAdmin, roles.admin]), updateRole);

export default router;