import axios from 'axios';


const API_URL_SALE_DETAILS = 'http://localhost:7215/api/DetalleVentum';

export const getSaleDetails = async () => {
  try {
    const response = await axios.get(API_URL_SALE_DETAILS);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching sale details');
  }
};

export const getSaleDetailById = async (id) => {
  try {
    const response = await axios.get(`${API_URL_SALE_DETAILS}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching sale detail');
  }
};

export const addSaleDetail = async (saleDetail) => {
  try {
    const response = await axios.post(API_URL_SALE_DETAILS, saleDetail);
    return response.data;
  } catch (error) {
    throw new Error('Error adding sale detail');
  }
};

export const updateSaleDetail = async (id, saleDetail) => {
  try {
    const response = await axios.put(`${API_URL_SALE_DETAILS}/${id}`, saleDetail);
    return response.data;
  } catch (error) {
    throw new Error('Error updating sale detail');
  }
};

export const deleteSaleDetail = async (id) => {
  try {
    await axios.delete(`${API_URL_SALE_DETAILS}/${id}`);
  } catch (error) {
    throw new Error('Error deleting sale detail');
  }
};
