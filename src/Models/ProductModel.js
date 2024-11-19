class Product {
    constructor(idProducto, nombreProducto, precioVenta, fotografia) {
      this.idProducto = idProducto ?? 0;
      this.nombreProducto = nombreProducto ?? 'Unknown Product';
      this.precioVenta = precioVenta ?? 0.0;
      this.fotografia = fotografia || '';
    }
  }
  
  export default Product;
  