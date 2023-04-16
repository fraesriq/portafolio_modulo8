
let fullAmountPurchase = 0

const coupons = [
  {
    name: '10%',
    discount: 10,
    status: true
  },
  {
    name: '20%',
    discount: 20,
    status: true
  },
  {
    name: '30%',
    discount: 50,
    status: true
  }
]

// FUNCION ENCARGADA DE LISTAR PRODUCTOS EN EL CARRO
async function chargeCarProducts () {
  let elements = ''
  carProductsTbl.innerHTML = ''
  let totalCompra = 0

  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')
  myHeaders.append("authorization", "Bearer " + localStorage.getItem("jwt"));

  const requestOptions = {    
    headers: myHeaders
  }

  fetch('/api/v1/carro',requestOptions)
    .then(response => response.json())
    .then(result => {
      if (result.code == 200) {
        if (result.data.length) {
          const carro = result.data[0]
          const idCarro = carro.id
          const detalleCarro = carro.detalle_carros
          const usuarioId = carro.usuarioId

          detalleCarro.map((detalle, index) => {
            const unitPrice = detalle.producto.value - detalle.producto.discount
            const total = unitPrice * detalle.amount
            const template = `
              <tr>
                <td scope="row">${index + 1}</td>
                <td>${detalle.producto.sku}</td>
                <td>${detalle.producto.nameProduct}</td>
                <td>${detalle.producto.value}</td>
                <td>${detalle.producto.discount}</td>
                <td>${unitPrice}</td>
                <td>
                  <button onclick="discountItemInCar('${detalle.producto.id}')">-</button>
                  <input type="number" value="${detalle.amount}" style="width:30px;" min="0" max="10">
                  <button onclick="addItemInCar('${detalle.producto.id}')">+</button>
                </td>
                <td>${total}</td>
              </tr>
            `

            elements += template
            totalCompra += total
          })

          elements += `<tr><td colspan="7">Total</td><td>${totalCompra}</td></tr>`
          carProductsTbl.innerHTML = elements
        } else {
          toastr.error('El Carro no cuenta con productos')
        }
      } else {
        toastr.error(result.message)
      }
    })
    .catch(error => console.log('error', error))
}

// FUNCION ENCARGADA DE AGREGAR PRODUCTOS AL CARRO
function addToCart(id) {  

  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')
  myHeaders.append("authorization", "Bearer " + localStorage.getItem("jwt"));

  const raw = JSON.stringify({
    id_producto: id
  })

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  }

  fetch('/api/v1/carro', requestOptions)
    .then(response => response.json())
    .then(result => {
      alertSystem('success', result.message)
    })
    .catch(error => console.log('error', error))
}

// FUNCION PARA SUMAR PRODUCTOS EN EL CARRO
function addItemInCar (id) {
  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')
  myHeaders.append("authorization", "Bearer " + localStorage.getItem("jwt"));

  const raw = JSON.stringify({
    idUsuario: '1',
    id_producto: id
  })

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw
  }

  fetch('/api/v1/carro', requestOptions)
    .then(response => response.json())
    .then(result => {
      alertSystem('success', result.message)
      chargeCarProducts()
    })
    .catch(error => console.log('error', error))
}

// FUNCION PARA RESTAR PRODUCTOS EN EL CARRO
function discountItemInCar (id) {
  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')
  myHeaders.append("authorization", "Bearer " + localStorage.getItem("jwt"));

  const raw = JSON.stringify({
    id_product: id
  })

  const requestOptions = {
    method: 'DELETE',
    headers: myHeaders,
    body: raw
  }

  fetch('/api/v1/carro/producto', requestOptions)
    .then(response => response.json())
    .then(result => {
      alertSystem('success', result.message)
      chargeCarProducts()
    })
    .catch(error => {
      alertSystem('error', error``)
    })
}

// FUNCION PARA VACIAR EL CARRITO
function emptyCar (id) {
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
      const myHeaders = new Headers()
      myHeaders.append('Content-Type', 'application/json')
      myHeaders.append("authorization", "Bearer " + localStorage.getItem("jwt"));

      const raw = JSON.stringify({
        id_carro: id
      })

      const requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        body: raw
      }

      fetch('/api/v1/carro', requestOptions)
        .then(response => response.json())
        .then(result => {
          alertSystem('success', result.message)
          chargeCarProducts()
        })
        .catch(error => {
          alertSystem('error', error``)
        })
    }
  })
}

// FUNCION PARA APLICAR UN DESCUENTO
function discountApply () {
  const couponValue = document.getElementById('input-cupon').value

  if (couponValue != '') {
    const couponFound = coupons.find(
      (coupon) => coupon.name == couponValue
    )

    if (couponFound && couponFound.status == true) {
      toastr.success('Exito', 'Cupón aplicado!!')
      fullAmountPurchase = fullAmountPurchase - (fullAmountPurchase * couponFound.discount) / 100
      document.querySelector('#precio-total').innerHTML = `El precio total de la compra con descuento es: <strong>$${fullAmountPurchase}</strong>`
      couponFound.status = false
    } else {
      toastr.error('El cupón no existe. / o está caducado')
    }
  } else {
    toastr.error('Debe ingresar un valor para el cupón')
  }
}

// FUNCION PARA REALIZAR LA COMPRA
function buy () {
  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')
  myHeaders.append("authorization", "Bearer " + localStorage.getItem("jwt"));

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    redirect: 'follow'
  }

  fetch('/api/v1/ventas', requestOptions)
    .then(response => response.json())
    .then(result => {
      if (result.code === 201) {        
        location.href = "/success"
      } else {
        alertSystem(result.error)
      }
    })
    .catch(error => console.log('error', error))

  // Realizar la compra
}
