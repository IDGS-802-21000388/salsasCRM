import { useState, useEffect } from "react";
import {
  Button,
  Input,
  Card,
  Typography,
  Checkbox,
} from "@material-tailwind/react";
import { toast } from "react-toastify";
import axios from "axios";
import {
  asignarCodigoAUsuarios,
  createPromocion,
  getAllCodigos,
  updatePromocion,
  cambiarEstatusCodigo,
} from "../services/promoService";

const Promociones = () => {
  const [promociones, setPromociones] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [selectedUsuarios, setSelectedUsuarios] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usuariosPerPage] = useState(5);
  const [usuariosConCodigo, setUsuariosConCodigo] = useState([]);
  const [form, setForm] = useState({
    codigo: "",
    descripcion: "",
    descuentoPorcentaje: "",
    descuentoMonto: "",
    fechaInicio: "",
    fechaFin: "",
  });
  const [editing, setEditing] = useState(false);
  const [openDetails, setOpenDetails] = useState(null);

  const fetchPromociones = async () => {
    try {
      const data = await getAllCodigos();
      setPromociones(data);
    } catch (error) {
      console.error("Error al cargar promociones:", error);
      toast.error("Error al cargar las promociones.");
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get("http://localhost:7215/api/Usuarios");
      setUsuarios(response.data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      toast.error("Error al cargar los usuarios.");
    }
  };

  const fetchUsuariosConCodigo = async (idCodigo) => {
    try {
      const response = await axios.get(
        `http://localhost:7215/api/CodigosDescuento/${idCodigo}/usuarios/`
      );
      return response.data;
    } catch (error) {
      console.error("Error al cargar usuarios con código asignado:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchPromociones();
    fetchUsuarios();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validateDiscount = () => {
    if (form.descuentoPorcentaje && form.descuentoMonto) {
      toast.error("Solo uno de los campos de descuento puede tener valor.");
      return false;
    }
    return true;
  };

  const handleSelectUsuario = (id) => {
    if (selectedUsuarios.includes(id)) {
      setSelectedUsuarios(selectedUsuarios.filter((userId) => userId !== id));
    } else {
      setSelectedUsuarios([...selectedUsuarios, id]);
    }
  };

  const indexOfLastUser = currentPage * usuariosPerPage;
  const indexOfFirstUser = indexOfLastUser - usuariosPerPage;
  const currentUsuarios = usuarios.slice(indexOfFirstUser, indexOfLastUser);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSave = async () => {
    if (!validateDiscount()) {
      return;
    }
    const promocion = {
      ...form,
      descuentoPorcentaje: form.descuentoPorcentaje || null,
      descuentoMonto: form.descuentoMonto || null,
    };
    try {
      if (editing) {
        await updatePromocion(form.idCodigo, promocion);
        toast.success("Promoción actualizada con éxito.");
      } else {
        await createPromocion(promocion);
        toast.success("Promoción creada con éxito.");
      }
      fetchPromociones();
      resetForm();
    } catch (error) {
      console.error("Error al guardar:", error.response?.data || error.message);
      toast.error("Error al guardar la promoción.");
    }
  };  

  const handleChangeStatus = async (idCodigo, estatus) => {
    try {
      await cambiarEstatusCodigo(idCodigo, estatus);
      toast.success(
        `El estatus de la promoción ha sido cambiado a ${
          estatus ? "activo" : "inactivo"
        }.`
      );
      fetchPromociones();
    } catch (error) {
      console.error("Error al cambiar estatus:", error.response?.data || error.message);
      toast.error("Error al cambiar el estatus de la promoción.");
    }
  };

  const handleAsignar = async (idCodigo) => {
    try {
      const usuariosParaAsignar = selectedUsuarios.filter(
        (idUsuario) => !usuariosConCodigo.includes(idUsuario)
      );
      if (usuariosParaAsignar.length === 0) {
        toast.info("Todos los usuarios seleccionados ya tienen este código asignado.");
        return;
      }
      await asignarCodigoAUsuarios(idCodigo, usuariosParaAsignar);
      toast.success("Código asignado a los usuarios con éxito.");
      setSelectedUsuarios([]);
      const usuariosAsignados = await fetchUsuariosConCodigo(idCodigo);
      setUsuariosConCodigo(usuariosAsignados);
      setSelectedUsuarios(usuariosAsignados);
    } catch (error) {
      console.error("Error al asignar código a usuarios:", error.response?.data || error.message);
      toast.error("Error al asignar el código a los usuarios.");
    }
  };
  
  const handleEdit = (promo) => {
    setForm(promo);
    setEditing(true);
  };

  const resetForm = () => {
    setForm({
      codigo: "",
      descripcion: "",
      descuentoPorcentaje: "",
      descuentoMonto: "",
      fechaInicio: "",
      fechaFin: "",
    });
    setEditing(false);
  };

  const toggleDetails = async (idCodigo) => {
    if (openDetails === idCodigo) {
      setOpenDetails(null);
      setSelectedUsuarios([]);
      setUsuariosConCodigo([]);
    } else {
      try {
        const usuariosAsignados = await fetchUsuariosConCodigo(idCodigo);
        setUsuariosConCodigo(usuariosAsignados);
        setSelectedUsuarios(usuariosAsignados);
        setOpenDetails(idCodigo);
      } catch (error) {
        console.error("Error al cargar usuarios con código asignado:", error);
        toast.error("Error al cargar usuarios con código asignado.");
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };  
  
  return (
    <div className="p-6 min-h-screen">
      <Typography variant="h2" className="text-center text-[#217765] font-bold mb-6">
        Gestión de Promociones
      </Typography>

      <Card className="p-6 bg-white shadow-lg rounded-lg mb-6 max-w-4xl mx-auto">
        <Typography variant="h4" className="text-[#217765] font-bold mb-4">
          {editing ? "Editar Promoción" : "Crear Nueva Promoción"}
        </Typography>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Código"
            name="codigo"
            value={form.codigo}
            onChange={handleChange}
            color="teal"
          />
          <Input
            label="Descripción"
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            color="teal"
          />
          <Input
            label="Porcentaje de Descuento (%)"
            name="descuentoPorcentaje"
            value={form.descuentoPorcentaje}
            onChange={handleChange}
            type="number"
            color="teal"
          />
          <Input
            label="Monto de Descuento ($)"
            name="descuentoMonto"
            value={form.descuentoMonto}
            onChange={handleChange}
            type="number"
            color="teal"
          />
          <Input
            label="Fecha de Inicio"
            name="fechaInicio"
            value={form.fechaInicio}
            onChange={handleChange}
            type="date"
            color="teal"
          />
          <Input
            label="Fecha de Fin"
            name="fechaFin"
            value={form.fechaFin}
            onChange={handleChange}
            type="date"
            color="teal"
          />
        </div>
        <Button
          onClick={handleSave}
          className="mt-4 bg-[#217765] hover:bg-[#c31a23] text-white"
        >
          {editing ? "Actualizar Promoción" : "Crear Promoción"}
        </Button>
      </Card>

      {/* Lista de promociones */}
      <div className="max-w-4xl mx-auto">
        <Typography variant="h4" className="text-[#217765] font-bold mb-4">
          Lista de Promociones
        </Typography>
        {promociones.map((promo) => (
          <Card key={promo.idCodigo} className="p-4 mb-4 bg-white shadow-lg rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <Typography variant="h5" className="text-[#217765] font-bold">
                  {promo.codigo} - {promo.descripcion}
                </Typography>
                <Typography className="text-gray-500">
                  Descuento: {promo.descuentoPorcentaje || `$${promo.descuentoMonto}`}{" "}
                  | Vigencia: {formatDate(promo.fechaInicio)} - {formatDate(promo.fechaFin)}
                </Typography>
              </div>
              <Button
                onClick={() => toggleDetails(promo.idCodigo)}
                className="bg-[#217765] hover:bg-[#c31a23] text-white"
              >
                {openDetails === promo.idCodigo ? "Cerrar Detalles" : "Abrir Detalles"}
              </Button>
            </div>
            {openDetails === promo.idCodigo && (
              <div className="mt-4">
                <Typography className="text-[#217765] font-bold mb-2">
                  Asignar a Usuarios
                </Typography>
                <div>
                  {currentUsuarios.map((user) => (
                    <div key={user.idUsuario} className="flex items-center mb-2">
                      <Checkbox
                        id={`user-${user.idUsuario}`}
                        checked={selectedUsuarios.includes(user.idUsuario)}
                        disabled={selectedUsuarios.includes(user.idUsuario)} // Deshabilitar si ya está asignado
                        onChange={() => handleSelectUsuario(user.idUsuario)}
                      />
                      <label htmlFor={`user-${user.idUsuario}`} className="ml-2">
                        {user.nombre} ({user.correo})
                      </label>
                    </div>
                  ))}
                </div>
                {/* Paginación */}
                <div className="flex justify-center mt-4">
                  {Array.from(
                    { length: Math.ceil(usuarios.length / usuariosPerPage) },
                    (_, index) => (
                      <Button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={`mx-1 ${
                          currentPage === index + 1 ? "bg-[#217765]" : "bg-gray-200"
                        }`}
                      >
                        {index + 1}
                      </Button>
                    )
                  )}
                </div>
              </div>
            )}
            <div className="flex mt-4 gap-2">
              <Button
                onClick={() => handleAsignar(promo.idCodigo)}
                className="bg-[#217765] hover:bg-[#c31a23] text-white"
              >
                Asignar
              </Button>
              <Button
                onClick={() => handleEdit(promo)}
                className="bg-[#e4007c] hover:bg-[#c31a23] text-white"
              >
                Editar
              </Button>
              <Button
                onClick={() => handleChangeStatus(promo.idCodigo, !promo.estatus)}
                className="bg-red-500 hover:bg-red-700 text-white"
              >
                {promo.estatus ? "Desactivar" : "Activar"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Promociones;
