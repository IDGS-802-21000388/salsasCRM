class DetalleVenta {
    constructor(idDetalleVenta, cantidad, subtotal, idVenta, idProducto) {
        this.idDetalleVenta = idDetalleVenta ?? 0;
        this.cantidad = cantidad ?? 0.0;
        this.subtotal = subtotal ?? 0.0;
        this.idVenta = idVenta ?? 0;
        this.idProducto = idProducto ?? 0;
    }
}

export default DetalleVenta;
