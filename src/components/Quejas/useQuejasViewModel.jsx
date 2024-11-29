import { useEffect, useState } from 'react';
import QuejasService from '../../services/QuejasService';

const useQuejasViewModel = () => {
  const [quejas, setQuejas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuejas = async () => {
    try {
      const data = await QuejasService.obtenerQuejas();
      setQuejas(data);
    } catch (err) {
      setError('Error al cargar las quejas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuejas();
  }, []);

  const responderQueja = async (id, accion, comentario) => {
    try {
      const nuevoSeguimiento = await QuejasService.seguimientoQueja(id, accion, comentario);
      setQuejas((prevQuejas) =>
        prevQuejas.map((queja) =>
          queja.id === id
            ? {
                ...queja,
                estado: queja.seguimientos.length === 0 ? 'En Proceso' : queja.estado,
                seguimientos: [...queja.seguimientos, nuevoSeguimiento],
              }
            : queja
        )
      );
      // Fetch updated quejas after responding to a queja
      await fetchQuejas();
    } catch (err) {
      setError(err.message || 'Error al responder la queja.');
    }
  };

  const finalizarQueja = async (id) => {
    try {
      const response = await fetch(`http://localhost:7215/api/SeguimientoQuejas/${id}/finalizar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Error al finalizar la queja.');
      }
      await response.json();
      // Fetch updated quejas after finalizing a queja
      await fetchQuejas();
    } catch (err) {
      setError(err.message || 'Error al finalizar la queja.');
    }
  };

  return {
    quejas,
    loading,
    error,
    responderQueja,
    finalizarQueja,
  };
};

export default useQuejasViewModel;
