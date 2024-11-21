// src/models/Empresa.js

import Usuario from './UserModel';  // Si también tienes un archivo para Usuario

class Empresa {
    constructor(
        idEmpresa,
        nombre,
        telefono,
        idUsuario,
        usuario,  // Debería ser una instancia de la clase Usuario
        idDireccion,
        direccion  // Debería ser un objeto de Direccion
    ) {
        this.idEmpresa = idEmpresa ?? 0;
        this.nombre = nombre ?? 'Nombre Desconocido';
        this.telefono = telefono ?? '';
        this.idUsuario = idUsuario ?? 0;
        this.usuario = usuario instanceof Usuario ? usuario : new Usuario();  // Si no pasa un usuario, inicializa uno vacío
        this.idDireccion = idDireccion ?? 0;
        this.direccion = direccion ?? {};  // Dirección vacía si no se pasa
    }
}

export default Empresa;
