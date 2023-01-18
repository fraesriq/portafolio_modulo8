// Funcion que carga los productos en carrito de compras
chargeProducts(products);

let productsCar = [];
  
if (localStorage.getItem("products")) {
  productsCar = JSON.parse(localStorage.getItem("products"));  
  updateCar(productsCar);
}
