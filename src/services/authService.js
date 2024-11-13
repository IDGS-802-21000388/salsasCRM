import axios from 'axios';

const API_URL = 'http://localhost:7215/api/Login';

export const login = async (correo, contrasenia) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      correo,
      contrasenia,
    });
    return response.data;
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    throw error;
  }
};
