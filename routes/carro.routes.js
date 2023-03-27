import express from 'express';
const router = express.Router();

import {getCarro,addProductCarro,deleteCarro,deleteProductCarro} from '../controllers/carro.controller.js'
//------------------ RUTAS ------------------
router.get("/carro", getCarro, (req, res) => { });
router.post("/carro", addProductCarro, (req, res) => { });
router.delete("/carro", deleteCarro, (req, res) => { });
router.delete("/carro/producto", deleteProductCarro, (req, res) => { });

export default router;