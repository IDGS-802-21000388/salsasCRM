import { useState, useEffect } from 'react';
import { getUsers } from '../../services/UsuarioService';

const ClientCatalog = () => {
  const [clients, setClients] = useState([]);

  // Fetch clients when the component loads
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const data = await getUsers();
      // Filter clients by specific roles
      const filteredClients = data.filter(client =>
        ['cliente', 'hotel', 'restaurante'].includes(client.rol.toLowerCase())
      );
      setClients(filteredClients);
    } catch (error) {
      console.error('Error fetching clients:', error.message);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Clientes</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'left' }}>Nombre</th>
            <th style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'left' }}>Rol</th>
            <th style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'left' }}>Dirección</th>
            <th style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'left' }}>Correo</th>
            <th style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'left' }}>Teléfono</th>
            <th style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'left' }}>Redes Sociales</th>
            <th style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'left' }}>Cómo llegó</th>
            <th style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'left' }}>Comunicación Preferida</th>
            <th style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'left' }}>Grupos/Asociaciones</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.idUsuario}>
              <td style={{ padding: '8px', border: '1px solid #ccc' }}>{client.nombre}</td>
              <td style={{ padding: '8px', border: '1px solid #ccc' }}>{client.rol}</td>
              <td style={{ padding: '8px', border: '1px solid #ccc' }}>
                {client.direccion?.calle}, {client.direccion?.colonia},{' '}
                {client.direccion?.municipio}, {client.direccion?.estado},{' '}
                {client.direccion?.codigoPostal}
              </td>
              <td style={{ padding: '8px', border: '1px solid #ccc' }}>{client.correo}</td>
              <td style={{ padding: '8px', border: '1px solid #ccc' }}>{client.telefono}</td>
              <td style={{ padding: '8px', border: '1px solid #ccc' }}>{client.redesSociales || 'N/A'}</td>
              <td style={{ padding: '8px', border: '1px solid #ccc' }}>{client.comoLlego || 'No especificado'}</td>
              <td style={{ padding: '8px', border: '1px solid #ccc' }}>
                {client.comunicacionPreferida || 'No especificada'}
              </td>
              <td style={{ padding: '8px', border: '1px solid #ccc' }}>
                {client.gruposAsociaciones || 'No pertenece'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientCatalog;
