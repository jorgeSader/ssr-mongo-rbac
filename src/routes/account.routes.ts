import express from "express";

import { getAccountById, getAccountList, getCurrentAccount } from "../controllers/account.controllers.js";

const router = express.Router();

// GET /account - current Account
router.get('/', getCurrentAccount);

// GET a Account by ID
router.get('/:accountId', getAccountById);

export default router;