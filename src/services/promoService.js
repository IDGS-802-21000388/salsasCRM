import axios from "axios";

const API_URL = "http://localhost:7215/api/CodigosDescuento";

// Obtener todos los códigos de descuento
export const getAllCodigos = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Crear un nuevo código de descuento
export const createPromocion = async (promocion) => {
  const response = await axios.post(API_URL, promocion);
  return response.data;
};

// Actualizar un código de descuento
export const updatePromocion = async (id, promocion) => {
  const response = await axios.put(`${API_URL}/${id}`, promocion);
  return response.data;
};

// Cambiar estatus de un código de descuento (activar/desactivar)
export const cambiarEstatusCodigo = async (id, estatus) => {
  const response = await axios.patch(`${API_URL}/${id}/estatus?estatus=${estatus}`);
  return response.data;
};

// Asignar un código a usuarios específicos
export const asignarCodigoAUsuarios = async (idCodigo, usuariosIds) => {
  const response = await axios.post(
    `${API_URL}/AsignarCodigo?idCodigo=${idCodigo}`,
    usuariosIds
  );
  return response.data;
};

// Obtener los códigos asignados a un usuario
export const getCodigosPorUsuario = async (idUsuario) => {
  const response = await axios.get(`${API_URL}/PorUsuario/${idUsuario}`);
  return response.data;
};

// Validar un código de descuento para un usuario
export const validarCodigo = async (idUsuario, codigo) => {
  const response = await axios.get(
    `${API_URL}/ValidarCodigo?idUsuario=${idUsuario}&codigo=${codigo}`
  );
  return response.data;
};

// Marcar un código como usado
export const marcarCodigoUsado = async (idUsuario, idCodigo) => {
  const response = await axios.post(
    `${API_URL}/MarcarUsado?idUsuario=${idUsuario}&idCodigo=${idCodigo}`
  );
  return response.data;
};

export const fetchUsuariosConCodigo = async (idCodigo) => {
    try {
      const response = await axios.get(`${API_URL}/${idCodigo}/usuarios`);
      return response.data;
    } catch (error) {
      console.error("Error al cargar usuarios con código asignado:", error);
      throw error;
    }
  };