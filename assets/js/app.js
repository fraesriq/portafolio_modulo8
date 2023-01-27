
// a la variable productosStorage le asigno lo que esta en el local con nombre productos
let productosStorage = JSON.parse(localStorage.getItem("productos"));  

// Si el local productos no tiene nada... asigno al local mi listado de productos inicial
if(!productosStorage){
  productosStorage = products;    
  localStorage.setItem("productos", JSON.stringify(productosStorage));
}

// Funcion que carga los productos en carrito de compras
chargeProducts(productosStorage);

let productsCar = [];
  
if (localStorage.getItem("products")) {
  productsCar = JSON.parse(localStorage.getItem("products"));  
  updateCar(productsCar);
}
