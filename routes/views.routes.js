import express from "express";

const router = express.Router();

import {controllerHome,controllerGetProducto,controllerProductos,controllerMantenedor,controllerCarro,controllerVentas} from "../controllers/views.controller.js";

router.get(["/", "home"], controllerHome, (req, res) => { });
router.get("/productos", controllerProductos, (req, res) => { });
router.get("/producto/:id", controllerGetProducto, (req, res) => { });
router.get("/mantenedor", controllerMantenedor, (req, res) => { });
router.get("/carro", controllerCarro, (req, res) => { });
router.get("/ventas", controllerVentas, (req, res) => { });
router.get("/success", (req, res) => {res.render('success') });
router.get("/contacto", (req, res) => {res.render('contacto') });
router.get("/login", (req, res) => {res.render('login') });

export default router;