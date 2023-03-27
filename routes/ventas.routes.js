import express from 'express'
import { generarVenta } from '../controllers/ventas.controller.js'
const router = express.Router()
// rutas
router.post('/ventas', generarVenta, (req, res) => {})

export default router
