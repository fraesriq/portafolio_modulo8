import { Carro } from '../models/Carro.model.js'
import { Producto } from '../models/Producto.model.js'

export const controllerHome = async (req, res) => {
  res.render('home')
}

export const controllerProductos = async (req, res) => {
  const productos = await Producto.findAll({
    raw: true,
    order: [
      ['nameProduct', 'ASC']
    ]
  })
  res.render('productos', {
    productos
  })
}

export const controllerMantenedor = async (req, res) => {
  const productos = await Producto.findAll({
    raw: true,
    order: [
      ['nameProduct', 'ASC']
    ]
  })
  res.render('mantenedor', {
    id_modal: 'modal_mantenedor',
    nproductos: productos
  })
}

export const controllerCarro = async (req, res) => {
  const userId = 1
  const carro = await Carro.findAll({
    raw: true,
    where: {
      usuarioId: userId
    }
  })
  res.render('carro', {
    carro: carro[0]
  })
}
