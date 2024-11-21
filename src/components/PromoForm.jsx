/* eslint-disable react/prop-types */
import { Button, Input, Typography, Card } from "@material-tailwind/react";

const PromoForm = ({ form, editing, handleChange, handleSave }) => {
  return (
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
  );
};

export default PromoForm;
