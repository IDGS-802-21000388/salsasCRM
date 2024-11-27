import { toast } from "react-toastify";
import PropTypes from "prop-types";
import {
  Input,
  Button,
  Dialog,
  Typography,
  DialogBody,
  DialogHeader,
  DialogFooter,
  Textarea,
} from "@material-tailwind/react";
import { useState } from "react";
import { createEmpresa } from "../../services/EmpresaService";

export const AddEmpresaModal = ({ open, onClose, onSuccess}) => {
  const [empresa, setEmpresa] = useState({
    nombre: "",
    telefono: "",
    direccion: {
      estado: "",
      municipio: "",
      codigoPostal: "",
      colonia: "",
      calle: "",
      numExt: "",
      numInt: "",
      referencia: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "telefono") {
      // Limitar a 10 dígitos numéricos
      if (/^\d*$/.test(value) && value.length <= 10) {
        setEmpresa((prev) => ({ ...prev, [name]: value }));
      }
    } else if (name === "direccion.codigoPostal") {
      // Limitar a 5 dígitos numéricos
      if (/^\d*$/.test(value) && value.length <= 5) {
        setEmpresa((prev) => ({
          ...prev,
          direccion: { ...prev.direccion, codigoPostal: value },
        }));
      }
    } else if (name.startsWith("direccion.")) {
      const field = name.split(".")[1];
      setEmpresa((prev) => ({
        ...prev,
        direccion: { ...prev.direccion, [field]: value },
      }));
    } else {
      setEmpresa((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateFields = () => {
    const { nombre, telefono, direccion } = empresa;
    const requiredFields = [
      { name: "Nombre", value: nombre },
      { name: "Teléfono", value: telefono },
      { name: "Estado", value: direccion.estado },
      { name: "Municipio", value: direccion.municipio },
      { name: "Código Postal", value: direccion.codigoPostal },
      { name: "Colonia", value: direccion.colonia },
      { name: "Calle", value: direccion.calle },
      { name: "Número Exterior", value: direccion.numExt },
    ];

    for (let field of requiredFields) {
      if (!field.value.trim()) {
        toast.error(`El campo ${field.name} es obligatorio.`);
        return false;
      }
    }

    if (telefono.length !== 10) {
      toast.error("El teléfono debe tener exactamente 10 dígitos.");
      return false;
    }

    if (direccion.codigoPostal.length !== 5) {
      toast.error("El código postal debe tener exactamente 5 dígitos.");
      return false;
    }

    return true;
  };

  const handleCreate = async () => {
    if (!validateFields()) return;

    try {
      await createEmpresa(empresa);
      toast.success("Empresa creada exitosamente.");
      onClose();
      setEmpresa({
        nombre: "",
        telefono: "",
        direccion: {
          estado: "",
          municipio: "",
          codigoPostal: "",
          colonia: "",
          calle: "",
          numExt: "",
          numInt: "",
          referencia: "",
        },
      });
      if (onSuccess) {
        onSuccess(); // Llamar al callback para recargar datos
      }
    } catch (error) {
      console.error("Error al crear la empresa:", error);
      toast.error("Ocurrió un error al crear la empresa.");
    }
  };

  return (
    <Dialog open={open} handler={onClose} size="lg" className="space-y-4 pb-6 overflow-y-auto max-h-[70vh]">
      <DialogHeader>
        <Typography variant="h4" color="blue-gray">
          Añadir Empresa
        </Typography>
      </DialogHeader>
      <DialogBody className="space-y-4 pb-6">
        <Input
          label="Nombre de la Empresa"
          name="nombre"
          value={empresa.nombre}
          onChange={handleChange}
        />
        <Input
          label="Teléfono"
          name="telefono"
          value={empresa.telefono}
          type="number"
          onChange={handleChange}
        />
        <Input
          label="Estado"
          name="direccion.estado"
          value={empresa.direccion.estado}
          onChange={handleChange}
        />
        <Input
          label="Municipio"
          name="direccion.municipio"
          value={empresa.direccion.municipio}
          onChange={handleChange}
        />
        <Input
          label="Código Postal"
          name="direccion.codigoPostal"
          value={empresa.direccion.codigoPostal}
          type="number"
          onChange={handleChange}
        />
        <Input
          label="Colonia"
          name="direccion.colonia"
          value={empresa.direccion.colonia}
          onChange={handleChange}
        />
        <Input
          label="Calle"
          name="direccion.calle"
          value={empresa.direccion.calle}
          onChange={handleChange}
        />
        <div className="flex gap-4">
          <Input
            label="Número Exterior"
            name="direccion.numExt"
            value={empresa.direccion.numExt}
            onChange={handleChange}
          />
          <Input
            label="Número Interior (Opcional)"
            name="direccion.numInt"
            value={empresa.direccion.numInt}
            onChange={handleChange}
          />
        </div>
        <Textarea
          label="Referencia (Opcional)"
          name="direccion.referencia"
          value={empresa.direccion.referencia}
          onChange={handleChange}
        />
      </DialogBody>
      <DialogFooter>
        <Button variant="text" color="red" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="filled" color="blue" onClick={handleCreate}>
          Crear Empresa
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

AddEmpresaModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess : PropTypes.func.isRequired,

};
