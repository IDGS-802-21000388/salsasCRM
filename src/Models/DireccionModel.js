class Direccion {
    constructor(idDireccion, estado, municipio, codigoPostal, colonia, calle, numExt, numInt, referencia) {
      this.idDireccion = idDireccion ?? 0;
      this.estado = estado ?? '';
      this.municipio = municipio ?? '';
      this.codigoPostal = codigoPostal ?? '';
      this.colonia = colonia ?? '';
      this.calle = calle ?? '';
      this.numExt = numExt ?? '';
      this.numInt = numInt ?? null;
      this.referencia = referencia ?? '';
    }
  }
  
  export default Direccion;
  