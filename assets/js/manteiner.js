import Product from './Product.js';

function chargeManteiner(listadoProductos){  

  let cuerpoTabla = document.querySelector(".section_mantenedor_productos tbody");
  cuerpoTabla.innerHTML = '';
  let acumuladorFilas = "";
  listadoProductos.forEach(producto => {      
    acumuladorFilas += `
      <tr>
        <th scope="row">${producto.sku}</th>
        <td>${producto.name}</td>
        <td>${producto.description}</td>
        <td>${producto.value}</td>
        <td>${producto.discount}</td>
        <td>${producto.stock}</td>
      </tr>
    `
  });
  cuerpoTabla.innerHTML = acumuladorFilas;
}

function findProduct(sku) {  
  let product = new Product(sku);  
  return product.getProduct();
}

let inputId = document.getElementById("sku");

inputId.addEventListener("change", (event) =>{
  event.preventDefault();
  let sku =  inputId.value;
  let product = findProduct(sku);

  if(product){
    crud_name.value         = product.name;
    crud_description.value  = product.description;
    crud_det1.value         = product.det1;
    crud_det2.value         = product.det2;
    crud_det3.value         = product.det3;
    crud_value.value        = product.value;
    crud_discount.value     = product.discount;
    crud_stock.value        = product.stock;
  }else{
    crud_name.value         = "";
    crud_description.value  = "";
    crud_det1.value         = "";
    crud_det2.value         = "";
    crud_det3.value         = "";
    crud_value.value        = 0;
    crud_stock.value        = 0;
    crud_discount.value     = 0;
  }
})

//MODIFICAR PRODUCTOS
document.getElementById("btn_mod").addEventListener("click", (event)=> {
  event.preventDefault();
  let id         = sku.value;
  let name        = crud_name.value;
  let description = crud_description.value;
  let det1        = crud_det1.value;
  let det2        = crud_det2.value;
  let det3        = crud_det3.value;
  let value       = crud_value.value;
  let discount    = crud_discount.value;
  let stock       = crud_stock.value;
  
  let producto = new Product(id, name, description, det1, det2, det3, value, discount, stock);
  console.log(producto);
  if(producto.getProduct()){
    producto.updateProduct();
    chargeManteiner(producto.getProducts());
  }else{
    alert("El producto que intenta actualizar no existe en la BD.")
  } 
})

//AGREGAR PRODUCTOS
document.getElementById("btn_add").addEventListener("click", (event) => {
  event.preventDefault();
  console.log('Agregar Elementos');

  let id          = sku.value;
  let name        = crud_name.value;
  let description = crud_description.va
  let det1        = crud_det1.value;
  let det2        = crud_det2.value;
  let det3        = crud_det3.value;
  let value       = crud_value.value;
  let discount    = crud_value.discount;
  let stock = crud_stock.value;
  
  let nuevoProducto = new Product(id, name, description, det1, det2, det3, value,discount, stock);
  if (nuevoProducto.getProduct()) {
    alert("Ya existe un producto con ese SKU");
  } else {
    nuevoProducto.addProduct();
    chargeManteiner(nuevoProducto.getProducts());
  }
})

//ELIMINAR PRODUCTOS
document.getElementById("btn_delete").addEventListener("click", (event) => {
  event.preventDefault();
  let id = sku.value;

  let product = new Product(id);
  if (product.getProduct()) {
    let respuesta = confirm("Está seguro que quiere eliminar el producto con ID: " + product.sku);
    if(respuesta){
      product.deleteProduct();
      chargeManteiner(product.getProducts());
    }
  }
});

function main() {
  
  // a la variable productosStorage le asigno lo que esta en el local con nombre productos
  let productosStorage = JSON.parse(localStorage.getItem("productos"));  

  // Si el local productos no tiene nada... asigno al local mi listado de productos inicial
  if(!productosStorage){
    productosStorage = products;    
    localStorage.setItem("productos", JSON.stringify(productosStorage));
  }

  chargeManteiner(productosStorage);

}

main();