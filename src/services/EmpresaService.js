import axios from 'axios';

// Configura la URL base de tu API
const API_URL = 'http://localhost:7215/api/empresa';  // Ajusta la URL según tu configuración

// Obtén todas las empresas
export const getEmpresas = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error al obtener las empresas:', error);
    throw error;
  }
};

// Obtén una empresa por su id
export const getEmpresa = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener la empresa:', error);
    throw error;
  }
};

// Crea una nueva empresa
export const createEmpresa = async (empresa) => {
  try {
    const response = await axios.post(API_URL, empresa);
    return response.data;
  } catch (error) {
    console.error('Error al crear la empresa:', error);
    throw error;
  }
};

// Actualiza una empresa existente
export const updateEmpresa = async (id, empresa) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, empresa);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar la empresa:', error);
    throw error;
  }
};

// Elimina una empresa
export const deleteEmpresa = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error('Error al eliminar la empresa:', error);
    throw error;
  }
};
