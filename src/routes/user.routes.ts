import express from "express";

import { getUserById, getUserList } from "../controllers/user.controllers.js";

const router = express.Router();

// GET all Users
router.get('/', getUserList);

// GET a User by ID
router.get('/:userId', getUserById);


export default router;