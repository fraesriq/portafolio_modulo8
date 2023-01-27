let fullAmountPurchase = 0;

//FUNCION ENCARGADA DE CARGAR PRODUCTOS
function chargeProducts(listProducts) {
  
  let elements = "";

  listProducts.forEach(product => {
    
    let card = `
      <div class="col-sm-12 col-md-6 col-lg-4 mb-3">
        <div class="card">
          <img src="./assets/img/${product.image}" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">${product.description}</p>
          </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">${product.det1}</li>
            <li class="list-group-item">${product.det2}</li>
            <li class="list-group-item">${product.det3}</li>
          </ul>
          <div class="card-body">
              
            <div id="precios">
              <div class="row">
                <div class="col-sm-12 col-md-4 text-left mt-2"> 
                  <h4>Precio Normal</h4>
                  <p>${Number(product.value).toLocaleString('es')}</p> 
                </div>
                <div class="col-sm-12 col-md-4 text-left mt-2"> 
                  <h4>Descuento</h4>
                  <p>${Number(product.discount).toLocaleString('es')}</p> 
                </div>
                <div class="col-sm-12 col-md-4 text-left mt-2"> 
                  <h4>Precio Final</h4>
                  <p>${Number(product.value-product.discount).toLocaleString('es')}</p> 
                </div>
              </div>
            </div>
            
            <div id="acciones">
              <div class="row">
                <div class="col-sm-12 col-md-6 text-center mt-2"> 
                  <a href="./producto.html" class="btn btn-primary">Descripción</a>
                </div>
                <div class="col-sm-12 col-md-6 text-center mt-2"> 
                  <a href="#" class="btn btn-danger" data-sku="${product.sku}" onclick="addToCart('${product.sku}')">Añadir al Carro</a>                  
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    `;

    elements += card;
  });

  let container = document.querySelector("#productos .row");
  // Carga en la seccion de productos los acumulados por la funcion si encuentra el contenedor
  if (container != null) {
    container.innerHTML = elements;
  }

}

//FUNCION ENCARGADA DE LISTAR PRODUCTOS EN EL CARRO
function chargeCarProducts() {
  
  let elements = "";

  productsCar.forEach((product, index) => {

    let productFound = findProduct(product.sku);
    let unitPrice = productFound.value - productFound.discount;
    let totalProduct = product.amount * unitPrice;
    fullAmountPurchase += totalProduct;

    let template = `
      <tr>
        <th scope="row">${index + 1}</th>
        <td>${productFound.sku}</td>
        <td>${productFound.name}</td>
        <td>${productFound.value}</td>
        <td>${productFound.discount}</td>
        <td>${unitPrice}</td>
        <td>
          <button onclick="discountItemInCar('${productFound.sku}')">-</button>
          <input type="number" value="${product.amount}" style="width:30px;" min="0" max="10">
          <button onclick="addItemInCar('${productFound.sku}')">+</button>
        </td>
        <td>${totalProduct}</td>
      </tr>
    `;
    elements += template;
  });

  document.querySelector("#productos-carrito tbody").innerHTML = elements;
  document.querySelector("#precio-total").innerHTML = `El precio total de la compra es: <strong>$${fullAmountPurchase}</strong>`;
}

//FUNCION ENCARGADA DE AGREGAR PRODUCTOS AL CARRO
function addToCart(sku) {

  let objProduct = {
    sku,
    amount: 1,
  };

  let productFound = productsCar.find(
    (product) => product.sku == sku
  );
  
  if (productFound) {
    productFound.amount += 1;
  } else {
    productsCar.push(objProduct);
  }

  updateCar(productsCar);
  alertSystem('success', 'Producto agregado correctamente.');
}

//FUNCION ENCARGADA DE MOSTRAR ALERTAS 
function alertSystem(type, msj) {  

  let typeAlert = '';

  switch (type) {
    case 'success':
      typeAlert = 'success'
      break;
    case 'error':
      typeAlert = 'error'
      break;
    default:
      typeAlert = 'danger'
      break;
  }

  Swal.fire({
    position: 'center',
    icon: type,
    title: msj,
    showConfirmButton: false,
    timer: 1500
  })
}

//FUNCION ENCARGADA DE ACTUALIZAR PRODUCTOS DEL CARRO
function updateCar(productsList) {
  localStorage.setItem("products", JSON.stringify(productsList));

  const startValue = 0;
  const sumProducts = productsList.reduce(
    (accumulator, product) => accumulator + product.amount,
    startValue
  );

  document.querySelector("#amount-products").innerText = sumProducts;
}

//FUNCION PARA ENCONTRAR PRODUCTO
function findProduct(sku) {
  let found = productosStorage.find((product) => product.sku == sku);  
  return found;
}

//FUNCION PARA VACIAR EL CARRITO
function emptyCar() {
  localStorage.setItem("products", "[]");
  location.reload();
}

//FUNCION PARA APLICAR UN DESCUENTO
function discountApply() {
  
  let couponValue = document.getElementById("input-cupon").value;

  if (couponValue != '') {
    
    let couponFound = coupons.find(
      (coupon) => coupon.name == couponValue
    );
  
  
    if (couponFound && couponFound.status == true) {
      alertSystem('success', 'Cupón aplicado!!');
      fullAmountPurchase =fullAmountPurchase -(fullAmountPurchase * couponFound.discount) / 100;
      document.querySelector("#precio-total").innerHTML = `El precio total de la compra con descuento es: <strong>$${fullAmountPurchase}</strong>`;
      couponFound.status = false;
    } else {
      
      alertSystem('error', 'El cupón no existe. / o está caducado');
    }
  } else {
    alertSystem('error', 'Debe ingresar un valor para el cupón');    
  }
}

//FUNCION PARA SUMAR PRODUCTOS EN EL CARRO
function addItemInCar(sku){

  productsCar.forEach((product, index) => {
    if(sku == product.sku){
      product.amount = product.amount + 1;
      if(product.amount >= 10){
        product.amount = 10;
        alertSystem('error', 'Alcanzo el limite de productos permitidos (10 unidades)');         
      }
    }
  })
  updateCar(productsCar);
  chargeCarProducts();
}

//FUNCION PARA RESTAR PRODUCTOS EN EL CARRO
function discountItemInCar(sku){

  productsCar.forEach((product, index) => {
    if(sku == product.sku){
      product.amount = product.amount - 1;
      if(product.amount <= 0){
        if(confirm("Está seguro que desea eliminar?")){
          productsCar.splice(index, 1);
          alertSystem('success', 'Producto Eliminado'); 
        }else{
          product.amount =1;
        }
      }
    }
  })
  updateCar(productsCar);
  chargeCarProducts();
}


