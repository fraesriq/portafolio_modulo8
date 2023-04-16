import app from './app.js'
import { sequelize } from './database/database.js'

// --------------------------------------------------
// -------------- IMPORTAR MODELOS ------------------
// --------------------------------------------------
import './models/Producto.model.js'
import './models/Carro.model.js'
import './models/DetalleCarro.model.js'
import './models/Usuario.model.js'
import './models/Venta.model.js'
import './models/DetalleVenta.model.js'

// --------------------------------------------------
// -------------- IMPORTAR RELACIONES----------------
// --------------------------------------------------

import './models/Relaciones.js'

// importar datos de prueba
import { cargarSemillas } from './seed.js'

const forceMetod = false // Si fuerzo la sincronizacion borra los datos y carga las semillas

const main = async () => {
  try {
    await sequelize.authenticate()
    // console.log('Nos hemos conectado con éxito')
    await sequelize.sync({
      force: forceMetod,
      alter: true,
      logging: false
    })
    if (forceMetod) {
      cargarSemillas()
    }
    const PORT = process.env.PORT_BACKEND || 3003

    app.listen(PORT, () => { console.log('Servidor escuchando en http://localhost:' + PORT) })
  } catch (error) {
    console.log('Ha ocurrido un error: ', error)
  }
}

main()
