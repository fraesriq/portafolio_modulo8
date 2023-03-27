import { Usuario } from "./models/Usuario.model.js";
import { Producto } from "./models/Producto.model.js";

const users = [
  { name: "Pedro", email: "pedro@mail.com", password: '123456' },
  { name: "Carlos", email: "carlos@mail.com", password: '123456' },
  { name: "juan", email: "juan@mail.com", password: '123456' }
]

const products = [
  {sku: "34475d",nameProduct: "Parlante Sony",description: "Parlante Bluetooth Sony SRS-XB43 Negro",image: "prod_1.webp",det1: "Conexión Bluetooth: Sí",det2: "Potencia: 10W",det3: "Conexión USB: Sí",value: 15000,discount: 10000,stock: 6},
  {sku: "d759ee",nameProduct: "Silla de Camping",description: "Alpinextrem Silla de Camping Plegable Alpinextrem",image: "prod_2.webp",det1: "Modelo: D21",det2: "Hecho en: China",det3: "Peso: 1,2",value: 22000,discount: 1200,stock: 8},
  {sku: "456c4b",nameProduct: "Zapatilla",description: "Zapatilla Mujer Skechers",image: "prod_3.webp",det1: "Marca: Skechers",det2: "Modelo: 128273-BLK",det3: "Hecho en: China",value: 25200,discount: 4500,stock: 9},
  {sku: "792a71",nameProduct: "Linterna",description: "Linterna Recargable Fenix E09R",det1: "Linterna Recargable",det2: "Hasta 600 lumenes",det3: "Dura hasta 70 horas.",value: 12500,discount: 1500,stock: 9,image: "prod_4.webp"},
  {sku: "d2bb3d",nameProduct: "Estuche",description: "Hori Estuche Nintendo Switch Hori Tough Pouch",det1: "Marca: Hori",det2: "Modelo: Tough Pouch",det3: "Peso: 1.2",value: 15000,discount: 3000,stock: 8,image: "prod_5.webp"},
  {sku: "a8820c",nameProduct: "Estuche",description: "Hori Estuche Nintendo Switch Hori Aluminio Pikachu",image: "prod_6.webp",det1: "Marca: Hori",det2: "Modelo: Aluminio Pikachu",det3: "Peso: 1.2",value: 15000,discount: 3000,stock: 12}
]

const chargeUsers = async () => {
  for (let index = 0; index < users.length; index++) {
    const [user, created] = await Usuario.findOrCreate({
      where: { name: users[index].name },
      defaults: {
        name    : users[index].name,
        email   : users[index].email,
        password: users[index].password
      }
    });
  }
}

const chargueProducts = async () => {
  for (let index = 0; index < products.length; index++) {
    const [product, created] = await Producto.findOrCreate({
      where: { sku: products[index].sku },
      defaults: {
        sku         : products[index].sku,
        nameProduct : products[index].nameProduct,
        description : products[index].description,
        image       : products[index].image,
        det1        : products[index].det1,
        det2        : products[index].det2,
        det3        : products[index].det3,
        value       : products[index].value,
        discount    : products[index].discount,
        stock       : products[index].stock
      }
    });
  }
}

export const cargarSemillas = () => {
  chargeUsers();
  chargueProducts();
}