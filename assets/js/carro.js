let productsCar         = [];
let fullAmountPurchase  = 0;

let coupons = [
  {
    name: "10%",
    discount: 10,
    status: true,
  },
  {
    name: "20%",
    discount: 20,
    status: true
  },
  {
    name: "30%",
    discount: 50,
    status: true
  },
];


if (localStorage.getItem("products")) {
  console.log('obtiene items del carro');
  productsCar = JSON.parse(localStorage.getItem("products"));  
  updateCar(productsCar);
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

//FUNCION ENCARGADA DE ACTUALIZAR PRODUCTOS DEL CARRO
function updateCar(productsList) {
  localStorage.setItem("products", JSON.stringify(productsList));

  const startValue = 0;
  const sumProducts = productsList.reduce(
    (accumulator, product) => accumulator + product.amount,
    startValue
  );
  
  console.log('Actualiza carro');

  document.querySelector("#amount-products").innerText = sumProducts;
}

//FUNCION ENCARGADA DE LISTAR PRODUCTOS EN EL CARRO
async function chargeCarProducts() {
  
  let elements = "";
  carProductsTbl.innerHTML = "";

  
  await Promise.all(productsCar.map(async (product, index) => {

    let productFound = await findProduct(product.sku);    
    
    let unitPrice = productFound.value - productFound.discount;
    let totalProduct = product.amount * unitPrice;
    fullAmountPurchase += totalProduct;

    let template = `
      <tr>
        <th scope="row">${index + 1}</th>
        <td>${productFound.sku}</td>
        <td>${productFound.nameProduct}</td>
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
    
  }));  

  carProductsTbl.innerHTML = elements;  
  document.querySelector("#precio-total").innerHTML = `El precio total de la compra es: <strong>$${fullAmountPurchase}</strong>`;
}

//FUNCION PARA ENCONTRAR PRODUCTO
function findProduct(sku) {
  return new Promise((resolve, reject) => {
    fetch("http://localhost:3000/api/productos/"+sku)
      .then(response => response.json())
      .then(data => {
        if (data.code == 500) reject(data.message);        
        resolve(data);        
      }).catch(err => {
        console.log('Error: ', err);
        reject("Error al leer los datos.")
      })
    })
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

//FUNCION PARA VACIAR EL CARRITO
function emptyCar() {

  Swal.fire({
    title: 'ATENCIÓN',
    text: 'Esto eliminara todos los productos en el carro',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí',
    cancelButtonText: 'No'
  }).then((result) => {
    if (result.value) {
      localStorage.setItem("products", "[]");
      location.reload();
    } 
  });
}

//FUNCION PARA APLICAR UN DESCUENTO
function discountApply() {
  
  let couponValue = document.getElementById("input-cupon").value;

  if (couponValue != '') {
    
    let couponFound = coupons.find(
      (coupon) => coupon.name == couponValue
    );
  
    if (couponFound && couponFound.status == true) {
      toastr.success('Exito', 'Cupón aplicado!!');
      fullAmountPurchase =fullAmountPurchase -(fullAmountPurchase * couponFound.discount) / 100;
      document.querySelector("#precio-total").innerHTML = `El precio total de la compra con descuento es: <strong>$${fullAmountPurchase}</strong>`;
      couponFound.status = false;      
    } else {
      toastr.error('El cupón no existe. / o está caducado');      
    }
  } else {
    toastr.error('Debe ingresar un valor para el cupón');        
  }
}

//FUNCION PARA REALIZAR LA COMPRA
function buy() {
  
  if (productsCar.length > 0) {
    
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");      

    fetch("http://localhost:3000/api/ventas/", {
      method  : 'POST',  
      headers : myHeaders,
      body    : JSON.stringify(productsCar)
    }).then(response => response.json())
      .then(data => {
        if (data.code == 500 || data.code == 400) {
          toastr.err(data.message)
        } else {
          toastr.success('Compra Realizada con exito');          
          localStorage.setItem("products", []);
          window.location.href = '/success';
        }
        
    })
  } else {
    toastr.error('El Carro debe contener productos para realizar la compra');
  }
}