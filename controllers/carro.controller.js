import { Carro } from '../models/Carro.model.js'
import { DetalleCarro } from '../models/DetalleCarro.model.js'
import { Producto } from '../models/Producto.model.js'

// -----------------------------------------------------
// ------------------------ GET ------------------------
// -----------------------------------------------------

export const getCarro = async (req, res) => {
  Carro.findAll({
    include: [
      {
        model: DetalleCarro,
        include: [Producto]        
      }
    ]
  }).then(carro => {
    res.json({ code: 200, data: carro });
  }).catch(error => {
    res.json({ code: 500, meessage: "Error al cargar el carrito." });
  })
}

export const addProductCarro = async (req, res) => {
  try {
    
    let { idUsuario, id_producto } = req.body;
    let usuarioId = idUsuario;

    const [carroCliente, created] = await Carro.findOrCreate({
      raw: true,
      where: { usuarioId },
      defaults: {
        usuarioId
      }
    });
    console.log(carroCliente);
    const [carroWhitProducts, create2] = await DetalleCarro.findOrCreate({
      where: { carroId: carroCliente.id, productoId: id_producto },
      defaults: {
        carroId: carroCliente.id,
        productoId: id_producto,
        amount: 1
      }
    })

    if (!create2) {
      carroWhitProducts.increment({ amount: 1 });
    }

    let producto = await Producto.findByPk(id_producto);

    if (carroWhitProducts.amount > producto.stock) {
      await carroWhitProducts.update({ amount: producto.stock }, {
        where: {
          id:producto.id
        }
      })  

      return res.status(201).json({message: "No hay más productos en stock."})
    }

    res.status(201).json({ message: "Producto agregado correctamente." });

  } catch (error) {
    console.log(error);
    res.status(500).json({ code: 500, message: "Error al agregar el producto al carro." });
  }
}

export const deleteProductCarro = async (req, res) => {
  try {
    
    let { id_product } = req.body;
    let idCliente = 1;
    const carroCliente = await Carro.findOne({
      raw: true,
      where: {
        usuarioId: idCliente
      }
    });

    const carroWithProducts = await DetalleCarro.findOne({
      where: {
        carroId: carroCliente.id, productoId: id_product
      }
    })

    if (carroWithProducts === null) {
      return res.status(400).json({message: "El producto que intenta restar no existe."})
    }

    await carroWithProducts.decrement({ amount: 1 });

    if (carroWithProducts.dataValues.amount == 0) {
      carroWithProducts.destroy();
      return req.status(201).json({ message: "Ha quitado todos los productos de este tipo." });
    }

    return req.status(201).json({ message: "Producto Eliminado correctamente." });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al agregar el producto al carro." });
  }
}