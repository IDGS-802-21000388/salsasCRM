import axios from 'axios';

const API_URL = 'http://localhost:7215/api/PromoPorTipo';

// Obtener todos los registros de contactos
export const getContactClient = async () => {
    try {
      const response = await axios.get(`${API_URL}/getContactClient`);
      return response.data;
    } catch (error) {
      throw error;
    }
};

// Obtener contactos filtrados por email
export const getContactClientByEmail = async (email) => {
    try {
      const response = await axios.get(`${API_URL}/getContactClientByEmail`, {
        params: { email }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
};