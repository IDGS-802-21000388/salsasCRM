import axios from 'axios';

const API_URL = 'http://localhost:7215/api'; // Cambia el puerto y URL según tu servidor

// Empresas
export const getEmpresas = async () => {
    const response = await axios.get(`${API_URL}/empresa`);
    return response.data;
};

export const getEmpresaById = async (id) => {
    const response = await axios.get(`${API_URL}/empresa/${id}`);
    return response.data;
};

export const getEmpresasConUsuarios = async () => {
  try {
    const response = await axios.get(`${API_URL}/empresa/api/empresa-con-usuarios`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener empresas con usuarios:", error);
    throw error;
  }
};

export const createEmpresa = async (empresa) => {
    const response = await axios.post(`${API_URL}/empresa`, empresa);
    return response.data;
};

export const updateEmpresa = async (id, empresa) => {
    const response = await axios.put(`${API_URL}/empresa/${id}`, empresa);
    return response.data;
};

export const deleteEmpresa = async (id) => {
    const response = await axios.delete(`${API_URL}/empresa/${id}`);
    return response.status;
};

// Relaciones Empresa-Usuario
export const createEmpresaUsuario = async (relation) => {
    const response = await axios.post(`${API_URL}/empresaUsuario`, relation);
    return response.data;
};

export const getAllEmpresaUsuarios = async () => {
  try {
      const response = await axios.get(`${API_URL}/empresaUsuario`);
      return response.data;
  } catch (error) {
      console.error("Error al obtener los registros de EmpresaUsuario:", error);
      throw error;
  }
};

export const getEmpresaUsuarioById = async (id) => {
  const response = await axios.get(`${API_URL}/empresaUsuario/${id}`);
  return response.data;
};
