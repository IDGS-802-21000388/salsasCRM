import axios from 'axios';

const API_URL = 'http://localhost:7215/api/Tarjetum';

export const getTarjeta = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching products');
  }
};
