import express from "express";

const router = express.Router();

import { controllerHome, controllerProductos, controllerMantenedor, controllerCarro } from "../controllers/views.controller.js";

router.get(["/", "home"], controllerHome, (req, res) => { });
router.get("/productos", controllerProductos, (req, res) => { });
router.get("/mantenedor", controllerMantenedor, (req, res) => { });
router.get("/carro", controllerCarro, (req, res) => { });

export default router;