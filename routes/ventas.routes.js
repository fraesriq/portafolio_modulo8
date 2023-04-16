import express from 'express'
import { generarVenta, getVentas } from '../controllers/ventas.controller.js'
import { verifyToken } from '../middlewares/jwt.js';

const router = express.Router()
// rutas
router.get('/ventas',verifyToken, getVentas, (req, res) => {})
router.post('/ventas',verifyToken, generarVenta, (req, res) => {})

export default router
