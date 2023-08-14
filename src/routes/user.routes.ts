import express from "express";

import { getUser, getUserList } from "../controllers/user.controllers.js";

const router = express.Router();

// GET all Users
router.get('/', getUserList);

// GET a User by ID
router.get('/:id', getUser);


export default router;