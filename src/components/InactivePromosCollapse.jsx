/* eslint-disable react/prop-types */
import { Card, Button, Typography } from "@material-tailwind/react";

const InactivePromosCollapse = ({
  showInactive,
  setShowInactive,
  inactivePromociones,
  handleChangeStatus,
  formatDate,
}) => {
  return (
    <div className="max-w-4xl mx-auto mt-6">
      <Button
        onClick={() => setShowInactive(!showInactive)}
        className={`${
          showInactive ? "bg-[#c31a23]" : "bg-[#217765]"
        } hover:bg-opacity-90 text-white w-full`}
      >
        {showInactive ? "Cerrar Códigos Desactivados" : "Abrir Códigos Desactivados"}
      </Button>
      {showInactive && (
        <div className="mt-4 bg-white shadow-md rounded-lg p-4">
          {inactivePromociones.length === 0 ? (
            <Typography className="text-gray-500 text-center">No hay códigos desactivados.</Typography>
          ) : (
            inactivePromociones.map((promo) => (
              <Card key={promo.idCodigo} className="p-4 mb-4 bg-[#f7f7f7] shadow-lg rounded-lg">
                <Typography variant="h5" className="text-[#217765] font-bold">
                  {promo.codigo} - {promo.descripcion}
                </Typography>
                <Typography className="text-gray-600">
                  Descuento: {promo.descuentoPorcentaje || `$${promo.descuentoMonto}`} | Vigencia:{" "}
                  {formatDate(promo.fechaInicio)} - {formatDate(promo.fechaFin)}
                </Typography>
                <Button
                  onClick={() => handleChangeStatus(promo.idCodigo, true)}
                  className="bg-[#217765] hover:bg-[#1b5d54] text-white mt-2"
                >
                  Activar
                </Button>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default InactivePromosCollapse;
