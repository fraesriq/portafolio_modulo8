import express from "express";
import { verifyToken } from '../middlewares/jwt.js';

const router = express.Router();

import {controllerHome,controllerGetProducto,controllerProductos,controllerMantenedor,controllerCarro,controllerVentas} from "../controllers/views.controller.js";

router.get(["/", "home"], controllerHome, (req, res) => { });
router.get("/productos",verifyToken, controllerProductos, (req, res) => { });
router.get("/producto/:id",verifyToken, controllerGetProducto, (req, res) => { });
router.get("/mantenedor",verifyToken, controllerMantenedor, (req, res) => { });
router.get("/carro", verifyToken,controllerCarro, (req, res) => { });
router.get("/ventas", verifyToken,controllerVentas, (req, res) => { });
router.get("/success", (req, res) => {res.render('success') });
router.get("/contacto", (req, res) => {res.render('contacto') });
router.get("/login", (req, res) => {res.render('login') });
router.get("/registro", (req, res) => {res.render('registro') });
export default router;