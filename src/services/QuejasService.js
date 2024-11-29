// services/QuejasService.js
import axios from 'axios';


const API_URL = 'http://localhost:7215/api';

export const QuejasService = {
  obtenerQuejas: async () => {
    try {
      const response = await axios.get(`${API_URL}/SeguimientoQuejas`);
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener las quejas');
    }
  },

  seguimientoQueja: async (id, accion, comentario) => {
    try {
      const seguimientoDTO = { accion, comentario };
      const response = await axios.post(
        `${API_URL}/SeguimientoQuejas/${id}/seguimiento`,
        seguimientoDTO,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data; // Devuelve la respuesta para más control
    } catch (error) {
      console.error("Error en seguimientoQueja:", error);
      throw new Error('Error al enviar el seguimiento.');
    }
  },
};


export default QuejasService;

