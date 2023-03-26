import { Producto } from "../models/Producto.model.js";

export const controllerHome = async (req, res) => {
  res.render("home");
}

export const controllerProductos = async (req, res) => {
  let productos = await Producto.findAll({
    raw: true,
    order: [
      ["nameProduct","ASC"]
    ]
  })  
  res.render("productos", {
    productos
  })
}

export const controllerMantenedor = async (req, res) => {
  let productos = await Producto.findAll({
    raw: true,
    order: [
      ["nameProduct","ASC"]
    ]
  })
  res.render("mantenedor", {
    id_modal : 'modal_mantenedor',
    productos :productos
  })
}

export const controllerCarro = async (req, res) => {
  res.render("carro");
}