import axios from 'axios';

const API_URL_SALES = 'http://localhost:7215/api/Ventum';

export const getSales = async () => {
  try {
    const response = await axios.get(API_URL_SALES);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching sales');
  }
};

export const getSaleById = async (id) => {
  try {
    const response = await axios.get(`${API_URL_SALES}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching sale');
  }
};

export const addSale = async (sale) => {
  try {
    const response = await axios.post(API_URL_SALES, sale);
    return response.data;
  } catch (error) {
    throw new Error('Error adding sale');
  }
};

export const updateSale = async (id, sale) => {
  try {
    const response = await axios.put(`${API_URL_SALES}/${id}`, sale);
    return response.data;
  } catch (error) {
    throw new Error('Error updating sale');
  }
};

export const deleteSale = async (id) => {
  try {
    await axios.delete(`${API_URL_SALES}/${id}`);
  } catch (error) {
    throw new Error('Error deleting sale');
  }
};
