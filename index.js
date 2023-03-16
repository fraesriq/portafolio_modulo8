const express      = require('express');
const app          = express();
const { create }   = require('express-handlebars');
const { v4: uuid } = require('uuid');
const fs           = require('fs');
const moment       = require('moment');

// CONFIGURACIONES Y MIDDLEWARES
const hbs = create({ partialsDir: ["views/partials"] });
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", "./views");

// CARPETA DE IMAGENES
app.use("/imagenes", express.static(__dirname + "/assets/img"));
// CARPETA DE ESTILOS
app.use("/css", express.static(__dirname + "/assets/css"));
// CARPETA DE SCRIPTS
app.use("/js", express.static(__dirname + "/assets/js"));

// SERVIDOR
app.listen(3000, () => console.log("http://localhost:3000"));

// ---------------------------------------------------------
// --------------------RUTAS DE LA VISTA--------------------
// ---------------------------------------------------------

// HOME
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/productos", (req, res) => {
  fetch("http://localhost:3000/api/productos")
    .then(response => response.json())
    .then(data => {
      if (data.code == 500) {
        console.log('Error: ', data.message);
        
      } 
      res.render("productos", {
        productos: data.productos
      });
    }).catch(err => {
      console.log('Error: ',err);
  })  

});

app.get("/producto/:sku", (req, res) => {
  let { sku } = req.params;
  fetch("http://localhost:3000/api/productos/"+sku)
    .then(response => response.json())
    .then(data => {      
      if (data.code == 500) {
        console.log('Error: ', data.message);
      } 

      data.pFinal   = data.value - data.discount;
      data.value    = Number(data.value).toLocaleString('es');
      data.discount = Number(data.discount).toLocaleString('es');
      data.pFinal   = Number(data.pFinal).toLocaleString('es');
            
      res.render("detalle_producto", {
        producto: data
      });
    }).catch(err => {
      console.log('Error: ',err);
  })  

});

app.get("/mantenedor", (req, res) => {
  fetch("http://localhost:3000/api/productos")
    .then(response => response.json())
    .then(data => {
      if (data.code == 500) {
        console.log('Error: ', data.message);
      } 
      res.render("mantenedor", {
        id_modal : 'modal_mantenedor',
        productos: data.productos
      });
    }).catch(err => {
      console.log('Error: ',err);
    })   
});

app.get("/ventas", (req, res) => {   
  fetch("http://localhost:3000/api/ventas")
    .then(response => response.json())
    .then(data => {
      if (data.code == 500) {
        console.log('Error: ', data.message);
      } 
      res.render("ventas", {
        ventas: data.ventas
      });
    }).catch(err => {
      console.log('Error: ',err);
  })  
});

app.get("/contacto", (req, res) => {
  res.render("contacto");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/carro", (req, res) => {  
  res.render("carro");
});

app.get("/success", (req, res) => {  
  res.render("success");
});

// app.all('*', function (req, res) {
//   res.send(`<h1>Aún no estoy preparado para responder al método ${req.method}</h1>`);
// });

// ---------------------------------------------------------
// --------------------ENDPOINTS PRODUCTOS------------------
// ---------------------------------------------------------

app.route("/api/productos")
  .get((req, res) => {
    fs.readFile("./assets/js/products.json", "utf-8", (err, data) => {
      if (err) {        
        return res.status(500).end({
          code: 500,
          message: "No se logro acceder al listado de productos"
        });
      }
      let productos = JSON.parse(data);

      productos.productos = productos.productos.map(producto => {        
        producto.pFinal   = producto.value - producto.discount;
        producto.value    = Number(producto.value).toLocaleString('es');
        producto.discount = Number(producto.discount).toLocaleString('es');
        producto.pFinal   = Number(producto.pFinal).toLocaleString('es');
        return producto;
      })      
      
      res.json(productos);
    })
  })
  .post((req, res) => {
    
    let nuevoProducto = req.body;
    nuevoProducto.sku = uuid().slice(0, 6);  
    fs.readFile("./assets/js/products.json", "utf8", (err, data)=> {
      if(err) return res.status(500).end({code: 500, message: "No se ha podido acceder al listado de productos"});
      let productos = JSON.parse(data);
      productos.productos.push(nuevoProducto);
      fs.writeFile("./assets/js/products.json", JSON.stringify(productos, null, 2), "utf8", (err) => {
        if(err) return res.status(500).end({code: 500, message: "No se ha podido acceder al listado de productos"});        
        res.json({
          code: 201,
          productos : productos,
          message: "Producto agregado correctamente"
        });
      })
    })
  })
  .put((req, res) => {
    
    let objProducto = req.body;
    
    fs.readFile("./assets/js/products.json", "utf8", (err, data) => {
      if (err) return res.status(500).end({ code: 500, message: "No se ha podido acceder al listado de productos" });
      
      let productos = JSON.parse(data);

      //Lo guardo en el mismo objeto para luego rescribir el archivo
      productos.productos = productos.productos.map(producto => {
        if (producto.sku == objProducto.sku) {
          producto = objProducto;
        }
        return producto;
      })

      fs.writeFile("./assets/js/products.json", JSON.stringify(productos, null, 2), "utf8", (err) => {
        if (err) return res.status(500).end({ code: 500, message: "No se ha podido sobrescribir el archivo" });
        res.json({
          code: 201,
          productos : productos,
          message: "Producto actualizado correctamente"
        });
      })
    })
  })
  .delete((req, res) => {
    let {sku} = req.query || false;
    
    if (sku) {
      fs.readFile("./assets/js/products.json", "utf8", (err, data) => {
        
        if (err) res.status(500).end({ code: 500, message: "No se ha podico acceder al listado de productos" })
        
        let productos = JSON.parse(data);
        
        productos.productos = productos.productos.filter(producto => producto.sku != sku)        
        
        fs.writeFile("./assets/js/products.json", JSON.stringify(productos, null, 4), "utf8", (err, data) => {
          if (err) return res.status(500).end({ code: 500, message: "No se ha podido acceder al listado de productos" });
          res.json({
            code: 201,
            productos : productos,
            message: "Producto eliminado correctamente"
          });
        })
      })
    }
  })

// ---------------------------------------------------------
// --------------------ENDPOINTS VENTAS---------------------
// ---------------------------------------------------------

app.route("/api/ventas")
  .get((req, res) => {
    readFile("./assets/js/ventas.json")
      .then(data => {
        res.json(data);
      })
      .catch(err => {
        res.json({
          code: 500,
          message: "Error al obtener los datos del archivo: "+err
        })
    })
  })
  .post((req, res) => {
    let productos = req.body;

    let objVenta = {
      id:  uuid().slice(0,6),
      fecha: moment().format('DD-MM-YYYY'),
      productos,
      total: 0
    }
    
    let productosTienda = JSON.parse(fs.readFileSync("./assets/js/products.json", "utf8"));
    // console.log('nuevaVenta antes: ',objVenta);
    // console.log('productosTienda: ',productosTienda);

    objVenta.productos.forEach(productoVenta => {
      let productsFound = productosTienda.productos.find(productFound => productFound.sku == productoVenta.sku)
      // console.log('productsFound: ', productsFound);
      productoVenta.value     = parseInt(productsFound.value);
      productoVenta.discount  = parseInt(productsFound.discount);
      productoVenta.total = parseInt(productsFound.value - productsFound.discount);
      
      objVenta.total += (productsFound.value - productsFound.discount) * productoVenta.amount;
    });
    
    readFile("./assets/js/ventas.json")
      .then(ventas => {
        ventas.ventas.push(objVenta);
        return ventas;
      })
      .then(data => {
        updateFile("./assets/js/ventas.json", data)
          .then(respuesta => {
            return res.status(201).json({code:201,message:respuesta})
          })
          .catch(err => {
            return res.status(500).json({ code:500,message:err})
        })
      })
      .catch(err => {
        return res.status(500).json({ code:500,message:err})
      })
      .finally(() => {        
        discountProducts(objVenta)
          .then(respuesta => console.log(respuesa))
          .catch(err => console.log('Error: ',err))
      })
  })

//OBTENGO PRODUCTOS POR SKU
app.route("/api/productos/:sku")
  .get((req, res) =>{
    let { sku } = req.params;
    fs.readFile("./assets/js/products.json", "utf8", (err, data)=> {
      if(err) return res.status(500).end({code: 500, message: "No se ha podido acceder al listado de productos"});
      let productos = JSON.parse(data);

      let productoBuscado = productos.productos.find(producto => producto.sku == sku);
      res.json(productoBuscado);
    })
  })

//FUNCION PARA LEER ARCHIVO JSON
function readFile(nameFile) {
  return new Promise((resolve, reject) => {
    fs.readFile(nameFile, "utf8", (err, data) => {
      if (err) reject("Error al leer el archivo: "+nameFile)
      let datos = JSON.parse(data);
      resolve(datos);
    })
  })
}

//FUNCION PARA ACTUALIZAR ARCHIVO JSON
function updateFile(nameFile, objData) {
  return new Promise((resolve, reject) => {
    fs.writeFile(nameFile, JSON.stringify(objData, null, 2), "utf8", (err) => {
      if (err) reject("Error al escribir en el archivo: " + nameFile)
      resolve("Archivo actualizado con éxito");
    })
  })
}

//FUNCION DESCONTAR productos
function discountProducts(carProducts) {
  return new Promise((resolve, reject) => {    
    readFile("./assets/js/products.json")
      .then(data => {

        carProducts.productos.forEach(carProduct => {
          let foundProduct = data.productos.find(product => product.sku == carProduct.sku);
          foundProduct.stock = foundProduct.stock - carProduct.amount;
        });

        updateFile("./assets/js/products.json", data)
          .then(response => { resolve(response) })
          .catch(err => {reject(err)})
      })
      .catch(err => {reject(err)})
  })
      
}