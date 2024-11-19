class Usuario {
    constructor(
        idUsuario,
        nombre,
        nombreUsuario,
        correo,
        contrasenia,
        rol,
        estatus,
        telefono,
        intentos,
        idDireccion,
        dateLastToken
    ) {
        this.idUsuario = idUsuario ?? 0;
        this.nombre = nombre ?? 'Nombre Desconocido';
        this.nombreUsuario = nombreUsuario ?? '';
        this.correo = correo ?? '';
        this.contrasenia = contrasenia ?? '';
        this.rol = rol ?? '';
        this.estatus = estatus ?? 1;
        this.telefono = telefono ?? '';
        this.intentos = intentos ?? 0;
        this.idDireccion = idDireccion ?? 0;
        this.dateLastToken = dateLastToken ?? new Date();
    }
}

export default Usuario;
