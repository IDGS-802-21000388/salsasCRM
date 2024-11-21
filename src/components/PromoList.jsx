/* eslint-disable react/prop-types */
import { Card, Button, Typography, Checkbox } from "@material-tailwind/react";

const PromoList = ({
  promociones,
  openDetails,
  toggleDetails,
  handleEdit,
  handleAsignar,
  handleChangeStatus,
  selectedUsuarios,
  handleSelectUsuario,
  currentUsuarios,
  handlePageChange,
  currentPage,
  usuariosPerPage,
  usuarios,
  formatDate,
  isLoading,
}) => {
  return (
    <div className="max-w-4xl mx-auto">
      <Typography variant="h4" className="text-[#217765] font-bold mb-4">
        Lista de Promociones
      </Typography>
      {promociones.map((promo) => (
        <Card
          key={promo.idCodigo}
          className="p-4 mb-4 bg-white shadow-lg rounded-lg"
        >
          <div className="flex justify-between items-center">
            <div>
              <Typography variant="h5" className="text-[#217765] font-bold">
                {promo.codigo} - {promo.descripcion}
              </Typography>
              <Typography className="text-gray-500">
                Descuento:{" "}
                {promo.descuentoPorcentaje || `$${promo.descuentoMonto}`} |
                Vigencia: {formatDate(promo.fechaInicio)} -{" "}
                {formatDate(promo.fechaFin)}
              </Typography>
            </div>
            <Button
              onClick={() => toggleDetails(promo.idCodigo)}
              className="bg-[#217765] hover:bg-[#c31a23] text-white"
            >
              {openDetails === promo.idCodigo
                ? "Cerrar Detalles"
                : "Abrir Detalles"}
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
                  (_, index) => {
                    return (
                      <Button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={`mx-1 ${
                          currentPage === index + 1
                            ? "bg-[#217765] text-white"
                            : "bg-gray-200 text-black"
                        }`}
                      >
                        {index + 1}
                      </Button>
                    );
                  }
                )}
              </div>
            </div>
          )}
          <div className="flex mt-4 gap-2">
            <Button
              onClick={() => handleAsignar(promo.idCodigo)}
              className="bg-[#217765] hover:bg-[#c31a23] text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="animate-pulse text-white">Asignando...</span>
              ) : (
                "Asignar"
              )}
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
  );
};

export default PromoList;
