import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getContactClient, getContactClientByEmail } from '../services/historialContacto';

const ContactoCliente = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getContactClient();
        setUsers(usersData);
        setFilteredUsers(usersData); // Mostrar todos los usuarios inicialmente
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    const filterUsers = () => {
      let filtered = users;

      if (searchQuery.trim() !== '') {
        filtered = filtered.filter((user) =>
          user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (selectedDate) {
        const formattedDate = formatDate(selectedDate);
        filtered = filtered.filter((user) =>
          user.fechaCreacion && formattedDate === new Date(user.fechaCreacion).toLocaleDateString()
        );
      }

      setFilteredUsers(filtered);
    };

    filterUsers();
  }, [searchQuery, selectedDate, users]);

  const handleSelectUser = async (email) => {
    try {
      const userData = await getContactClientByEmail(email);
      setSelectedUser(email);
      setUserDetails(userData[0]); // Supone que la API devuelve un array con un objeto
    } catch (error) {
      console.error('Error al obtener detalles del usuario:', error);
    }
  };

  const exportToCSV = () => {
    const csvRows = [];
    const headers = ['Email', 'Mensaje', 'Fecha de Creación'];
    csvRows.push(headers.join(','));

    filteredUsers.forEach((user) => {
      const values = [
        `"${user.email}"`,
        `"${user.mensaje}"`,
        `"${new Date(user.fechaCreacion).toLocaleDateString()}"`,
      ];
      csvRows.push(values.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contactos.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-8">
      {/* Indicadores Resumidos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow text-center border border-green-700">
          <h3 className="text-xl font-bold text-green-700 mb-2">Total de Contactos</h3>
          <p className="text-3xl font-bold text-gray-700">{users.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center border border-green-700">
          <h3 className="text-xl font-bold text-green-700 mb-2">Nuevos este mes</h3>
          <p className="text-3xl font-bold text-gray-700">
            {users.filter(user => new Date(user.fechaCreacion) > new Date().setDate(new Date().getDate() - 30)).length}
          </p>
        </div>
      </div>

      {/* Inputs de búsqueda */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <input
          type="text"
          placeholder="Buscar usuario por email..."
          className="w-full p-4 border border-green-700 rounded text-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          placeholderText="Buscar por fecha"
          className="w-full p-4 border border-green-700 rounded text-lg"
          dateFormat="dd/MM/yyyy"
        />
      </div>

      {/* Botón Exportar a CSV */}
      <div className="mb-4">
        <button
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          onClick={exportToCSV}
        >
          Exportar a CSV
        </button>
      </div>

      {/* Lista de usuarios */}
      <div
        className="bg-gray-100 p-6 rounded-lg shadow mb-8 overflow-auto"
        style={{ maxHeight: '500px' }}
      >
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className={`p-6 mb-6 rounded-lg border ${
                selectedUser === user.email ? 'border-red-500' : 'border-green-700'
              } bg-white shadow cursor-pointer`}
              onClick={() => handleSelectUser(user.email)}
            >
              <p className="text-xl font-bold text-green-700 mb-2">{user.email}</p>
              <p className="text-lg text-green-700 mb-1">Mensaje: {user.mensaje}</p>
              <p className="text-lg text-green-700">
                Fecha de Creación: {new Date(user.fechaCreacion).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          // Vacíos Visuales
          <div className="text-center text-gray-500 p-8">
            <p className="text-lg">No hay contactos que coincidan con los filtros.</p>
            <img src="/assets/no-data.svg" alt="No data" className="w-1/3 mx-auto mt-4" />
          </div>
        )}
      </div>

      {/* Detalles del usuario */}
      {userDetails && (
        <div className="bg-white p-6 rounded-lg shadow border border-green-700">
          <h3 className="text-2xl font-bold text-green-700 mb-4">Detalles del Usuario</h3>
          <p className="text-lg text-green-700 mb-2">Email: {userDetails.email}</p>
          <p className="text-lg text-green-700 mb-2">Mensaje: {userDetails.mensaje}</p>
          <p className="text-lg text-green-700">
            Fecha de Creación: {new Date(userDetails.fechaCreacion).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default ContactoCliente;
