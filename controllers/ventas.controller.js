import { Producto } from '../models/Producto.model.js'
import { Venta } from '../models/Venta.model.js'
import { DetalleVenta } from '../models/DetalleVenta.model.js'
import { DetalleCarro } from '../models/DetalleCarro.model.js'
import { Carro } from '../models/Carro.model.js'
import { sequelize } from '../database/database.js'

export const getVentas = async (req, res) => {
  
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
    res.json({ code: 200, data: ventas })
  }).catch(error => {
    console.log(error)
    res.json({ code: 500, message: 'Error al cargar las Ventas.' })
  })
  
}

export const generarVenta = async (req, res) => {
  
  const usuarioId = req.user.id
  const t = await sequelize.transaction()

  try {
    
    let carro = await Carro.findOne({
      raw: true,
      where: {
        usuarioId
      }
    })
    
    if (carro === null) throw new Error('No existe el carrito asociado al cliente')

    const idCarroCliente = carro.id

    let detalleCarro = await DetalleCarro.findAll({
      raw: true,
      where: {
        carroId : idCarroCliente
      }
    })
    
    if (detalleCarro.length == 0) throw new Error("Cliente no tiene productos en el carro.")

    let nuevaVenta = await Venta.create({
      usuarioId 
    }, { transaction: t })

    let idVenta = nuevaVenta.dataValues.id;
    let total = 0;

    for (let index = 0; index < detalleCarro.length; index++) {

      let id = detalleCarro[index].productoId;
      let amount = detalleCarro[index].amount;
      
      const producto= await Producto.findOne({        
        where: {id }
      });
      
      if(producto == null) throw new Error("Un producto no existe.")

      await producto.decrement({stock: amount}, { transaction: t })  
      
      let subTotal = producto.dataValues.value - producto.dataValues.discount;

      const detalleVenta = await DetalleVenta.create({
        amount: amount,
        value: subTotal,
        ventumId: idVenta,
        productoId: id 

      }, { transaction: t })

      await Carro.destroy({
        where:{
          usuarioId
        },
        transaction: t
      })
      console.log('subTotal: ',subTotal);
      total += subTotal * amount
    }

    console.log('Total: ',total);
    //Actualizo el monto de la venta
    await Venta.update(
      {
        totalValue: total
      },
      {
        where: { id: idVenta },
        transaction: t
      });

    await t.commit();
    res.status(201).json({ code: 201, message: "Venta generada correctamente." })
    
  } catch (error) {
    console.log('Error al crear Venta',error)
    await t.rollback()
    res.status(500).json({code: 500, error:"Error al generar la venta."})
  }
}
