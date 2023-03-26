import express from 'express';
const router = express.Router();

import {getCarro,addProductCarro, deleteProductCarro} from '../controllers/carro.controller.js'
//------------------ RUTAS ------------------
router.get("/carro", getCarro, (req, res) => { });
router.post("/carro", addProductCarro, (req, res) => { });
router.get("/carro", deleteProductCarro, (req, res) => { });

export default router;