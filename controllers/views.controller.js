import { Carro } from '../models/Carro.model.js'
import { DetalleVenta } from '../models/DetalleVenta.model.js'
import { Producto } from '../models/Producto.model.js'
import { Venta } from '../models/Venta.model.js'

export const controllerHome = async (req, res) => {
  res.render('home')
}

export const controllerGetProducto = async(req, res) => {
  let id = req.params.id;

  let producto = await Producto.findOne({ 
    raw: true,
    where: {
      id
    }
   });

  if (producto === null) res.status(400).send("No se logro encontrar el producto.")
    
  res.render('detalle_producto', {
    producto
  })
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
  // console.log(productos);
  res.render('mantenedor', {
    id_modal: 'modal_mantenedor',
    productos: productos
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

export const controllerSuccess = async (req, res) => {
  res.render('success')
}

export const controllerVentas = async (req, res) => {

  const usuarioId = req.user.id

  Venta.findAll({   
    where: { usuarioId },
    include: [
      {        
        model: DetalleVenta,        
        include: [Producto]
      }
    ]
  }).then(ventas => {    
  
    res.render('ventas',
      {
        ventas: ventas
      })
  }).catch(error => {
    console.log(error)
    res.json({ code: 500, message: 'Error al cargar las ventas.' })
  })
}
