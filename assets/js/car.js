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

chargeCarProducts();

let btnEmptyCar = document.getElementById("btn-vaciar");
let btnDiscount = document.getElementById("btn-descuento");

//EVENTO ON CLICK DEL BOTON PARA VACIAR EL CARRITO
btnEmptyCar.addEventListener("click", function (event) {
  event.preventDefault();
  emptyCar();
});

//LÓGICA DESCUENTO POR CUPÓN
btnDiscount.addEventListener("click", function (event) {
  event.preventDefault();
  discountApply();
});




