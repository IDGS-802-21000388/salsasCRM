import { useEffect, useState } from 'react';
import { getEmpresas, createEmpresa, getEmpresa } from '../../services/EmpresaService';
import { getUsers } from '../../services/UsuarioService';
import AddEmpresaModal from './AddEmpresaModal'; // Asegúrate de ajustar la ruta

const EmpresaList = () => {
  const [empresas, setEmpresas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [selectedUsuarios, setSelectedUsuarios] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: '' });
  const [loading, setLoading] = useState(true);  // Estado de carga

  // Obtener las empresas y usuarios cuando el componente se monta
  useEffect(() => {
    const fetchEmpresasYUsuarios = async () => {
      try {
        const empresasData = await getEmpresas();
        const usuariosData = await getUsers();

        // Agrupar empresas por nombre y agregar todos los usuarios asociados a ellas
        const groupedEmpresas = empresasData.reduce((acc, empresa) => {
          const empresaExistente = acc.find(item => item.nombre === empresa.nombre);
          if (empresaExistente) {
            empresaExistente.usuarios.push(empresa.usuario); // Agregar el usuario asociado
          } else {
            acc.push({ ...empresa, usuarios: [empresa.usuario] });
          }
          return acc;
        }, []);

        setEmpresas(groupedEmpresas);
        setUsuarios(usuariosData);
        setLoading(false);  // Termina la carga
      } catch (error) {
        console.error('Error al cargar empresas o usuarios', error);
        setLoading(false);  // Termina la carga en caso de error
      }
    };

    fetchEmpresasYUsuarios();
  }, []);

  // Función para manejar el cambio de usuario seleccionado para cada empresa
  const handleUsuarioChange = (empresaId, event) => {
    setSelectedUsuarios((prev) => ({
      ...prev,
      [empresaId]: event.target.value,
    }));
  };

  const handleAddEmpresa = async (newEmpresa) => {
    try {
      if (!newEmpresa.idUsuario) {
        setAlert({ open: true, message: 'Debe seleccionar un usuario para la empresa', severity: 'error' });
        return;
      }
  
      // Verificar si el usuario ya está asociado a la empresa
      const usuarioExistente = newEmpresa.usuarios.some(usuario => usuario.idUsuario === newEmpresa.idUsuario);
      if (usuarioExistente) {
        setAlert({ open: true, message: 'El usuario ya está asociado a esta empresa', severity: 'error' });
        return;
      }
  
      // Si pasa la validación, agregar el usuario a la empresa
      newEmpresa.usuarios.push(usuarios.find(user => user.idUsuario === newEmpresa.idUsuario));
  
      // Crear la empresa
      const response = await createEmpresa(newEmpresa);
  
      // Obtener la empresa con los datos completos
      const empresaConUsuario = await getEmpresa(response.idEmpresa);
  
      // Verificar si la empresa ya existe
      setEmpresas((prev) => {
        const empresaExistente = prev.find(empresa => empresa.idEmpresa === empresaConUsuario.idEmpresa);
        if (!empresaExistente) {
          return [...prev, empresaConUsuario];
        }
        return prev; 
      });
  
      // Mostrar alerta de éxito
      setAlert({ open: true, message: 'Empresa guardada correctamente', severity: 'success' });
    } catch (error) {
      console.error('Error al guardar la empresa:', error);
      setAlert({ open: true, message: 'Error al guardar la empresa', severity: 'error' });
    }
  };
  

  return (
    <div style={{ padding: '10px' }}>
      <h2 style={{ textAlign: 'center', fontWeight: 'bold' }}>Catálogo de Empresas</h2>

      {/* Botón para abrir el modal */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <button onClick={() => setIsModalOpen(true)} style={buttonStyle}>
          Agregar Empresa
        </button>
      </div>

      {/* Modal para agregar empresa */}
      <AddEmpresaModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddEmpresa}
      />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {loading ? (
          <p style={{ fontSize: '16px', color: '#757575' }}>Cargando...</p>
        ) : empresas.length > 0 ? (
          empresas.map((empresa) => (
            <div key={empresa.idEmpresa} style={cardStyle}>
              <div style={{ padding: '10px' }}>
                <h3 style={headingStyle}>{empresa.nombre}</h3>
                <p><strong>Teléfono de la Empresa:</strong> {empresa.telefono}</p>

                {/* Dirección de la empresa */}
                <h4>Dirección</h4>
                <p>
                  {empresa.direccion?.calle}, {empresa.direccion?.colonia}, {empresa.direccion?.municipio}, {empresa.direccion?.estado}, {empresa.direccion?.codigoPostal}
                </p>

                {/* Información de los usuarios asociados */}
                <h4>Usuarios Asociados</h4>
                {empresa.usuarios?.map((usuario) => (
                  <div key={usuario.idUsuario}>
                    <p><strong>Nombre:</strong> {usuario.nombre}</p>
                    <p><strong>Correo:</strong> {usuario.correo}</p>
                    <p><strong>Teléfono:</strong> {usuario.telefono}</p>
                  </div>
                ))}

                {/* Selección de un nuevo usuario para asociar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                  <select
                    value={selectedUsuarios[empresa.idEmpresa] || ''}
                    onChange={(event) => handleUsuarioChange(empresa.idEmpresa, event)}
                    style={selectStyle}
                  >
                    <option value="">Seleccionar Usuario</option>
                    {usuarios.filter(usuario => ['cliente', 'hotel', 'restaurante'].includes(usuario.rol) && !empresa.usuarios.some(u => u.idUsuario === usuario.idUsuario)).map((usuario) => (
                      <option key={usuario.idUsuario} value={usuario.idUsuario}>
                        {usuario.nombre}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleAddEmpresa({ ...empresa, idUsuario: selectedUsuarios[empresa.idEmpresa] })}
                    style={{ ...buttonStyle, padding: '6px 12px', fontSize: '14px', marginTop: '10px' }}
                  >
                    Agregar Usuario
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p style={{ fontSize: '16px', color: '#757575' }}>
            No hay empresas disponibles.
          </p>
        )}
      </div>

      {/* Snackbar para mostrar alertas */}
      {alert.open && (
        <div style={alertStyle[alert.severity]}>
          <p>{alert.message}</p>
        </div>
      )}
    </div>
  );
};

const buttonStyle = {
  backgroundColor: '#3f51b5',
  color: 'white',
  padding: '10px 20px',
  borderRadius: '5px',
  border: 'none',
  cursor: 'pointer',
};

const cardStyle = {
  marginBottom: '10px',
  width: '100%',
  maxWidth: '900px',
  padding: '15px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  borderRadius: '6px',
};

const headingStyle = {
  fontSize: '16px',
  fontWeight: 'bold',
  marginBottom: '5px',
};

const selectStyle = {
  maxWidth: '200px',
  padding: '5px',
  fontSize: '14px',
};

const alertStyle = {
  success: {
    backgroundColor: '#4caf50',
    color: 'white',
    padding: '10px',
    marginTop: '10px',
    borderRadius: '5px',
  },
  error: {
    backgroundColor: '#f44336',
    color: 'white',
    padding: '10px',
    marginTop: '10px',
    borderRadius: '5px',
  },
};

export default EmpresaList;
