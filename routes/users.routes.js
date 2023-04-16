import express from "express";

const router = express.Router();

import { addUser,getUserByEmailPassword } from "../controllers/users.controller.js";

router.post("/login", getUserByEmailPassword, (req, res) => { });
router.post("/register", addUser, (req, res) => { });

export default router;