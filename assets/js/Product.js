let productosStorage = JSON.parse(localStorage.getItem("productos")) || [];

export default class Product{

  constructor(sku, name = "", description = "Sin descripción", det1="Sin Detalle 1", det2="Sin Detalle 2", det3="Sin Detalle 3", value = 999999, discount = 0, stock = 0){
      this.sku          = sku;
      this.name         = name;
      this.description  = description
      this.det1         = det1;
      this.det2         = det2;
      this.det3         = det3;
      this.value        = value;  
      this.discount     = discount;  
      this.stock        = stock;
  }

  getProducts(){
      productosStorage = JSON.parse(localStorage.getItem("productos")) || []
      return productosStorage;
  }
  
  getProduct() {  
    productosStorage = JSON.parse(localStorage.getItem("productos")) || [];        
    return productosStorage.find(producto => producto.sku == this.sku);
  }
  
  deleteProduct(){
    productosStorage = JSON.parse(localStorage.getItem("productos")) || []
    productosStorage = productosStorage.filter(producto => producto.sku != this.sku)
    localStorage.setItem("productos", JSON.stringify(productosStorage))
    return productosStorage;
  }
  
  updateProduct() {
    
    productosStorage = JSON.parse(localStorage.getItem("productos")) || []
    let producto = productosStorage.find(producto => producto.sku == this.sku)
  
    producto.name         = this.name;
    producto.description  = this.description;
    producto.det1         = this.det1;
    producto.det2         = this.det2;
    producto.det3         = this.det3;
    producto.value        = this.value;
    producto.discount     = this.discount;
    producto.stock        = this.stock;
    
    localStorage.setItem("productos", JSON.stringify(productosStorage))
    return producto;
  }
  
  addProduct(){
    productosStorage = JSON.parse(localStorage.getItem("productos")) || [];
    
    productosStorage.push(
      {
        sku: this.sku,
        name: this.name,
        description: this.description,
        det1: this.det1,
        det2: this.det2,
        det3: this.det3,
        value: this.value,
        discount: this.discount,
        stock: this.stock,
      }
    );

    localStorage.setItem("productos", JSON.stringify(productosStorage));

    return productosStorage
  }

}