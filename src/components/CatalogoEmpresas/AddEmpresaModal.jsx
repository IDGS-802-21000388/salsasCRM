import { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { getUsers } from '../../services/UsuarioService';

const AddEmpresaModal = ({ open, onClose, onSubmit }) => {
  const [empresa, setEmpresa] = useState({
    nombre: '',
    telefono: '',
    direccion: {
      estado: '',
      municipio: '',
      codigoPostal: '',
      colonia: '',
      calle: '',
      numExt: '',
      numInt: '',
      referencia: '',
    },
    idUsuario: '',
  });

  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await getUsers();
        const filteredUsers = allUsers.filter((user) =>
          ['cliente', 'hotel', 'restaurante'].includes(user.rol)
        );
        setUsuarios(filteredUsers);
      } catch (error) {
        console.error('Error fetching users', error);
      }
    };

    if (open) {
      fetchUsers();
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'telefono') {
      // Asegúrate de que solo se ingresen números y tenga un máximo de 10 dígitos
      const phoneValue = value.replace(/\D/g, '').slice(0, 10);  // Solo números y límite de 10 caracteres
      setEmpresa((prev) => ({ ...prev, telefono: phoneValue }));
    } else if (name in empresa.direccion) {
      setEmpresa((prev) => ({
        ...prev,
        direccion: { ...prev.direccion, [name]: value },
      }));
    } else {
      setEmpresa((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUserSelect = (e) => {
    const selectedUserId = e.target.value;
    const selectedUser = usuarios.find((user) => user.idUsuario === selectedUserId);

    if (selectedUser) {
      setEmpresa((prev) => ({
        ...prev,
        idUsuario: selectedUser.idUsuario,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Empresa enviada:', empresa); // Ver lo que se está enviando
    onSubmit(empresa); // Pasamos la empresa con todos los datos
    setEmpresa({
      nombre: '',
      telefono: '',
      direccion: {
        estado: '',
        municipio: '',
        codigoPostal: '',
        colonia: '',
        calle: '',
        numExt: '',
        numInt: '',
        referencia: '',
      },
      idUsuario: '',
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          maxHeight: '80vh', // Altura máxima relativa a la ventana
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: '8px',
          overflowY: 'auto', // Habilitar el desplazamiento vertical
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Agregar Empresa
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Nombre de la Empresa"
            variant="outlined"
            name="nombre"
            value={empresa.nombre}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Teléfono"
            variant="outlined"
            name="telefono"
            value={empresa.telefono}
            onChange={handleChange}
            margin="normal"
            required
          />
          {/* Aquí puedes agregar campos adicionales según sea necesario */}
          
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Usuario Asociado</InputLabel>
            <Select
              label="Usuario Asociado"
              name="idUsuario"
              value={empresa.idUsuario}
              onChange={handleUserSelect}
            >
              {usuarios.map((user) => (
                <MenuItem key={user.idUsuario} value={user.idUsuario}>
                  {user.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Typography variant="h6" gutterBottom>Dirección</Typography>
          <TextField
            fullWidth
            label="Estado"
            variant="outlined"
            name="estado"
            value={empresa.direccion.estado}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Municipio"
            variant="outlined"
            name="municipio"
            value={empresa.direccion.municipio}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Código Postal"
            variant="outlined"
            name="codigoPostal"
            value={empresa.direccion.codigoPostal}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Colonia"
            variant="outlined"
            name="colonia"
            value={empresa.direccion.colonia}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Calle"
            variant="outlined"
            name="calle"
            value={empresa.direccion.calle}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Número Exterior"
            variant="outlined"
            name="numExt"
            value={empresa.direccion.numExt}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Número Interior (opcional)"
            variant="outlined"
            name="numInt"
            value={empresa.direccion.numInt}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Referencia (opcional)"
            variant="outlined"
            name="referencia"
            value={empresa.direccion.referencia}
            onChange={handleChange}
            margin="normal"
          />

          <Box display="flex" justifyContent="space-between" marginTop="20px">
            <Button variant="contained" color="secondary" onClick={onClose}>Cancelar</Button>
            <Button variant="contained" color="primary" type="submit">Guardar Empresa</Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default AddEmpresaModal;
