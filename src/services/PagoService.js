import axios from 'axios';

const API_URL = 'http://localhost:7215/api/Pago';

export const getPago = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching products');
  }
};
