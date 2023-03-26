import { Producto } from '../models/Producto.model.js';
import { v4 } from 'uuid';
//-------------------------------------------------------
//------------------------- GET -------------------------
//-------------------------------------------------------
export const getProducts = async(req, res) => {
  Producto.findAll().then(productos => {
    res.json({ data: productos });
  }).catch(error => {
    res.json({ code: 500, message: "Error al cargar los productos" });
  })
}

//-------------------------------------------------------
//------------------------- POST ------------------------
//-------------------------------------------------------

export const addProducts = async (req, res) => {
  try {
    let objProduct = req.body;
    objProduct.sku = v4().slice(0, 6);
        
    let newProduct = await Producto.create(objProduct);  
    
    //Devuelvo los productos para llenar nuvamente la tabla
    let productos = await Producto.findAll({
      raw: true,
      order: [
        ["nameProduct", "ASC"]
      ]
    });
    
    res.status(201)
      .json(
        {
          code: 201,
          producto: productos,
          message: "Producto creado correctamente."
        })
    
  }catch(error){
    console.log(error)
    res.status(500).json({code: 500, message: "Error al guardar el producto."})
  }
}

export const getProductById = async (req, res) => {
  try {
    let id = req.params.id;
    let producto = await Producto.findByPk(id);
    if (producto === null) {
      res.status(400).send("No se encontro el producto soliciado");
    } else {
      res.json({
        producto: producto,
        message: "Producto encontrado correctamente."
      })
    }
  } catch (error) {
    res.status(500).send("Error al buscar el producto");
  }
}

export const editProduct = async (req, res) => {
  
  let { id,nameProduct, description, image, det1, det2, det3, value, discount, stock } = req.body;

  let producto = await Producto.findByPk(id);
  
  if (producto == null) {
    res.status(400).send("El producto que intenta actualizar no existe.");
  } else {
    await Producto.update({ nameProduct, description, image, det1, det2, det3, value, discount, stock }, {
      where: {
        id
      }
    });
    
    //Devuelvo los productos para llenar nuvamente la tabla
    let productos = await Producto.findAll({
      raw: true,
      order: [
        ["nameProduct", "ASC"]
      ]
    });

    res.json({
      code: 200,
      producto:productos,
      message: "Producto actualizado correctamente."
    });
  }
}

export const deleteProductById = async (req, res) => {
  try {
    let id = req.params.id;
    await Producto.destroy({
      where: {
        id
      }
    })

    //Devuelvo los productos para llenar nuvamente la tabla
    let productos = await Producto.findAll({
      raw: true,
      order: [
        ["nameProduct", "ASC"]
      ]
    });

    res.json({
      code: 200,
      productos: productos,
      message: "Producto eliminado correctamente."
    })

  } catch (error) {
    res.status(500).json({code:500,message:"Error al eliminar el producto."})
  }
}