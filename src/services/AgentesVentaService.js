import axios from 'axios';

// Definir la URL base de la API
const API_URL = 'http://localhost:7215/api/AgentesVenta/basic'; // Ajusta la URL según tu configuración

// Servicio para obtener los datos básicos de AgentesVenta
export const getAgentesVenta = async () => {
  try {
    const response = await axios.get(API_URL); // Hacer la solicitud GET
    return response.data; // Devolver los datos obtenidos
  } catch (error) {
    console.error("Error al obtener los agentes de venta", error);
    throw error; // Lanzar el error para que sea manejado por el componente
  }
};


