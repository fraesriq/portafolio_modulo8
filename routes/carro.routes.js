import express from 'express';
import { verifyToken } from '../middlewares/jwt.js';

const router = express.Router();

import {getCarro,addProductCarro,deleteCarro,deleteProductCarro} from '../controllers/carro.controller.js'
//------------------ RUTAS ------------------
router.get("/carro",verifyToken,getCarro, (req, res) => { });
router.post("/carro", verifyToken, addProductCarro, (req, res) => { });
router.delete("/carro", verifyToken, deleteCarro, (req, res) => { });
router.delete("/carro/producto",verifyToken, deleteProductCarro, (req, res) => { });

export default router;