import axios from 'axios';

const API_URL_DOMICILIO = 'http://localhost:7215/api/Direccion';

export const getDomicilios = async () => {
  try {
    const response = await axios.get(API_URL_DOMICILIO);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching domicilios');
  }
};

export const getDomicilioById = async (id) => {
  try {
    const response = await axios.get(`${API_URL_DOMICILIO}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching domicilio by ID');
  }
};

export const addDomicilio = async (domicilio) => {
  try {
    const response = await axios.post(API_URL_DOMICILIO, domicilio);
    return response.data;
  } catch (error) {
    throw new Error('Error adding domicilio');
  }
};

export const updateDomicilio = async (id, domicilio) => {
  try {
    const response = await axios.put(`${API_URL_DOMICILIO}/${id}`, domicilio);
    return response.data;
  } catch (error) {
    throw new Error('Error updating domicilio');
  }
};

export const deleteDomicilio = async (id) => {
  try {
    await axios.delete(`${API_URL_DOMICILIO}/${id}`);
  } catch (error) {
    throw new Error('Error deleting domicilio');
  }
};
