import express from 'express'
import cors from 'cors'
import { create } from 'express-handlebars'
import {sumarHelper,restarHelper,fechaHelper} from './helpers/helpers.js'
import fileUpload from 'express-fileupload';
import 'dotenv/config';

import * as path from 'path'
import { fileURLToPath } from 'url'

// -------------------------------------------------
// ------------------- RUTAS -----------------------
// -------------------------------------------------

import viewsRoutes from './routes/views.routes.js'

import productsRoutes from './routes/productos.routes.js'
import carroRoutes from './routes/carro.routes.js'
import ventasRoutes from './routes/ventas.routes.js'
import usersRoutes from './routes/users.routes.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()

// -------------------------------------------------
// ------------------- MIDLEWARE -------------------
// -------------------------------------------------
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

let limiteMb = 2;
app.use(fileUpload({
  limits: { fileSize: limiteMb* 1024 * 1024 },
  abortOnLimit: true,
  responseOnLimit: `Usted ha superado el límite permitido (${limiteMb})`
}));

// -------------------------------------------------
// ------------------- SERVIDOR --------------------
// -------------------------------------------------
app.use(viewsRoutes)
app.use('/api/v1', productsRoutes)
app.use('/api/v1', carroRoutes)
app.use('/api/v1', ventasRoutes)
app.use('/api/v1', usersRoutes);

const PORT_FRONT = process.env.PORT_FRONTEND || 3000

app.listen(PORT_FRONT, () => { console.log('Servidor en http://localhost:'+PORT_FRONT) })

// -------------------------------------------------
// ---------------- MIDLEWARE RUTAS ----------------
// -------------------------------------------------

// CARPETA DE IMAGENES
app.use('/imagenes', express.static(__dirname + '/assets/img'))
// CARPETA DE ESTILOS
app.use('/css', express.static(__dirname + '/assets/css'))
// CARPETA DE SCRIPTS
app.use('/js', express.static(__dirname + '/assets/js'))

// -------------------------------------------------
// ------------------- HANDLEBARS-------------------
// -------------------------------------------------

const hbs = create({
  helpers: {
    sumarHelper,
    restarHelper,
    fechaHelper
  },
  partialsDir: [
    'views/partials/'
  ]
})

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, './views'))

export default app
