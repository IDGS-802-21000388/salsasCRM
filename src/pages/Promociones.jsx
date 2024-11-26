import { useState, useEffect } from "react";
import { Typography, Button } from "@material-tailwind/react";
import { toast } from "react-toastify";
import axios from "axios";
import {
  asignarCodigoAUsuarios,
  createPromocion,
  getAllCodigos,
  updatePromocion,
  cambiarEstatusCodigo,
  fetchUsuariosConCodigo,
} from "../services/promoService";

// Importación de los componentes creados
import PromoForm from "../components/PromoForm";
import PromoList from "../components/PromoList";
import InactivePromosCollapse from "../components/InactivePromosCollapse";

const Promociones = () => {
  const [promociones, setPromociones] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [selectedUsuarios, setSelectedUsuarios] = useState([]);
  const [currentPageUsuarios, setCurrentPageUsuarios] = useState(1);
  const [usuariosPerPage] = useState(5);
  const [paginaPromociones, setPaginaPromociones] = useState(1);
  const [promocionesPorPagina] = useState(3);
  const [usuariosConCodigo, setUsuariosConCodigo] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
  const [showInactive, setShowInactive] = useState(false);

  useEffect(() => {
    fetchPromociones();
    fetchUsuarios();
  }, []);

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

  const handleEdit = (promo) => {
    console.log("Promo a editar:", promo);

    const formattedPromo = {
      ...promo,
      fechaInicio: promo.fechaInicio.split("T")[0],
      fechaFin: promo.fechaFin.split("T")[0],
    };

    setForm(formattedPromo);
    setEditing(true);
  };

  const handleChangeStatus = async (idCodigo, estatus) => {
    try {
      await cambiarEstatusCodigo(idCodigo, estatus);
      toast.success(
        `El estatus de la promoción ha sido cambiado a ${
          estatus ? "activo" : "inactivo"
        }.`
      );
      setPromociones((prevPromociones) =>
        prevPromociones.map((promo) =>
          promo.idCodigo === idCodigo ? { ...promo, estatus } : promo
        )
      );
      fetchPromociones();
    } catch (error) {
      console.error(
        "Error al cambiar estatus:",
        error.response?.data || error.message
      );
      toast.error("Error al cambiar el estatus de la promoción.");
    }
  };

  const handleAsignar = async (idCodigo) => {
    try {
      setIsLoading(true);
      const usuariosParaAsignar = selectedUsuarios.filter(
        (idUsuario) => !usuariosConCodigo.includes(idUsuario)
      );
      if (usuariosParaAsignar.length === 0) {
        setIsLoading(false);
        toast.info(
          "Todos los usuarios seleccionados ya tienen este código asignado."
        );
        return;
      }
      await asignarCodigoAUsuarios(idCodigo, usuariosParaAsignar);
      toast.success("Código asignado a los usuarios con éxito.");
      setSelectedUsuarios([]);
      const usuariosAsignados = await fetchUsuariosConCodigo(idCodigo);
      setUsuariosConCodigo(usuariosAsignados);
      setSelectedUsuarios(usuariosAsignados);
      setIsLoading(false);
    } catch (error) {
      console.error(
        "Error al asignar código a usuarios:",
        error.response?.data || error.message
      );
      toast.error("Error al asignar el código a los usuarios.");
    }
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
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  // Paginación para promociones
  const promocionesActivas = promociones.filter((promo) => promo.estatus);
  const indexOfLastPromocion = paginaPromociones * promocionesPorPagina;
  const indexOfFirstPromocion = indexOfLastPromocion - promocionesPorPagina;
  const promocionesPaginaActual = promocionesActivas.slice(
    indexOfFirstPromocion,
    indexOfLastPromocion
  );

  // Paginación para usuarios
  const indexOfLastUser = currentPageUsuarios * usuariosPerPage;
  const indexOfFirstUser = indexOfLastUser - usuariosPerPage;
  const currentUsuarios = usuarios.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="p-6 min-h-screen">
      <Typography
        variant="h2"
        className="text-center text-[#217765] font-bold mb-6"
      >
        Gestión de Promociones
      </Typography>

      <PromoForm
        form={form}
        editing={editing}
        handleChange={handleChange}
        handleSave={handleSave}
      />

      <PromoList
        promociones={promocionesPaginaActual}
        openDetails={openDetails}
        toggleDetails={toggleDetails}
        handleEdit={handleEdit}
        handleAsignar={handleAsignar}
        isLoading={isLoading}
        handleChangeStatus={handleChangeStatus}
        selectedUsuarios={selectedUsuarios}
        handleSelectUsuario={(id) =>
          setSelectedUsuarios((prev) =>
            prev.includes(id)
              ? prev.filter((userId) => userId !== id)
              : [...prev, id]
          )
        }
        currentUsuarios={currentUsuarios}
        usuarios={usuarios}
        handlePageChange={setCurrentPageUsuarios}
        currentPage={currentPageUsuarios}
        usuariosPerPage={usuariosPerPage}
        formatDate={formatDate}
      />

      <div className="flex justify-center mt-4">
        {Array.from(
          {
            length: Math.ceil(promocionesActivas.length / promocionesPorPagina),
          },
          (_, index) => (
            <Button
              key={index + 1}
              onClick={() => setPaginaPromociones(index + 1)}
              className={`mx-1 ${
                paginaPromociones === index + 1
                  ? "bg-[#217765] text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {index + 1}
            </Button>
          )
        )}
      </div>

      <InactivePromosCollapse
        showInactive={showInactive}
        setShowInactive={setShowInactive}
        inactivePromociones={promociones.filter((promo) => !promo.estatus)}
        handleChangeStatus={handleChangeStatus}
        formatDate={formatDate}
      />
    </div>
  );
};

export default Promociones;
