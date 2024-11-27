import { toast } from "react-toastify";
import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  Typography,
  DialogBody,
  DialogHeader,
  DialogFooter,
  Select,
  Option,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { getEmpresas } from "../../services/EmpresaService";
import { getUsers } from "../../services/UsuarioService";
import { createEmpresaUsuario, getAllEmpresaUsuarios } from "../../services/EmpresaService";

export const AddEmpresaUsuarioModal = ({ open, onClose, onSuccess }) => {
  const [empresas, setEmpresas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [empresaUsuarios, setEmpresaUsuarios] = useState([]);
  const [form, setForm] = useState({
    idEmpresa: "",
    idUsuario: "",
  });

  // Cargar datos al abrir el modal
  useEffect(() => {
    if (open) {
      fetchEmpresas();
      fetchUsuarios();
      fetchEmpresaUsuarios();
    }
  }, [open]);

  // Obtener empresas
  const fetchEmpresas = async () => {
    try {
      const data = await getEmpresas();
      setEmpresas(data);
    } catch (error) {
      console.error("Error fetching empresas:", error);
      toast.error("Error al cargar las empresas.");
    }
  };

  // Obtener usuarios con filtrado de roles
  const fetchUsuarios = async () => {
    try {
      const data = await getUsers();
      const filteredUsers = data.filter(
        (user) => ["cliente", "hotel", "restaurante"].includes(user.rol) && !user.idEmpresa
      );
      setUsuarios(filteredUsers);
    } catch (error) {
      console.error("Error fetching usuarios:", error);
      toast.error("Error al cargar los usuarios.");
    }
  };

  // Obtener usuarios ya asignados a empresas
  const fetchEmpresaUsuarios = async () => {
    try {
      const data = await getAllEmpresaUsuarios();
      setEmpresaUsuarios(data);
    } catch (error) {
      console.error("Error fetching empresa usuarios:", error);
      toast.error("Error al cargar las relaciones Empresa-Usuario.");
    }
  };

  // Crear relación Empresa-Usuario
  const handleCreate = async () => {
    const { idEmpresa, idUsuario } = form;

    if (!idEmpresa || !idUsuario) {
      toast.error("Debe seleccionar una empresa y un usuario.");
      return;
    }

    // Validar si el usuario ya está asignado a la empresa
    const usuarioAsignado = empresaUsuarios.find(
      (eu) => eu.idEmpresa === parseInt(idEmpresa, 10) && eu.idUsuario === parseInt(idUsuario, 10)
    );

    if (usuarioAsignado) {
      toast.error("Este usuario ya está asignado a esta empresa.");
      return;
    }

    try {
      await createEmpresaUsuario({
        idEmpresaUsuario: 0,
        idEmpresa: parseInt(idEmpresa, 10),
        idUsuario: parseInt(idUsuario, 10),
      });
      toast.success("Relación Empresa-Usuario creada exitosamente.");
      onClose(); // Cerrar el modal
      setForm({ idEmpresa: "", idUsuario: "" }); // Resetear formulario
      if (onSuccess) {
        onSuccess(); // Llamar al callback para recargar datos
      }
    } catch (error) {
      console.error("Error al crear la relación Empresa-Usuario:", error);
      toast.error("Ocurrió un error al crear la relación.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={open} handler={onClose} size="lg" className="space-y-4 pb-6">
      <DialogHeader>
        <Typography variant="h4" color="blue-gray">
          Asignar Usuario a Empresa
        </Typography>
      </DialogHeader>
      <DialogBody>
        <div className="mb-4">
          <Select
            label="Seleccionar Empresa"
            name="idEmpresa"
            value={form.idEmpresa.toString()}
            onChange={(value) => handleChange({ target: { name: "idEmpresa", value } })}
          >
            {empresas.map((empresa) => (
              <Option key={empresa.idEmpresa} value={empresa.idEmpresa.toString()}>
                {empresa.nombre}
              </Option>
            ))}
          </Select>
        </div>
        <div className="mb-4">
          <Select
            label="Seleccionar Usuario"
            name="idUsuario"
            value={form.idUsuario.toString()}
            onChange={(value) => handleChange({ target: { name: "idUsuario", value } })}
          >
            {usuarios.map((usuario) => (
              <Option key={usuario.idUsuario} value={usuario.idUsuario.toString()}>
                {usuario.nombre} - {usuario.rol}
              </Option>
            ))}
          </Select>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button variant="outlined" color="red" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={handleCreate} color="green">
          Asignar
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

AddEmpresaUsuarioModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess : PropTypes.func.isRequired,
};
