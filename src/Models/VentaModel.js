class Venta {
    constructor(idVenta, fechaVenta, total, idUsuario) {
        this.idVenta = idVenta ?? 0;
        this.fechaVenta = fechaVenta ?? new Date().toISOString();
        this.total = total ?? 0.0;
        this.idUsuario = idUsuario ?? 0;
    }
}

export default Venta;
