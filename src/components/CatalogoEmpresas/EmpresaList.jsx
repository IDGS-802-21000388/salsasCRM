import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  Typography,
  CardBody,
  CardFooter,
  Button,
  Input,
} from "@material-tailwind/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { getEmpresasConUsuarios } from "../../services/EmpresaService";
import { AddEmpresaModal } from "./AddEmpresaModal";
import { AddEmpresaUsuarioModal } from "./AddEmpresaUsuarioModal"; // Importar el nuevo modal

const TABLE_HEAD = ["Nombre", "Teléfono", "Dirección", "Usuarios"];

const EmpresaList = () => {
  const [empresas, setEmpresas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openAddEmpresaModal, setOpenAddEmpresaModal] = useState(false);
  const [openAddEmpresaUsuarioModal, setOpenAddEmpresaUsuarioModal] = useState(false); // Estado para el nuevo modal
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3); // Empresas por página

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const data = await getEmpresasConUsuarios();
        setEmpresas(data);
      } catch (error) {
        console.error("Error al cargar las empresas:", error);
      }
    };
    fetchEmpresas();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleOpenAddEmpresaModal = () => {
    setOpenAddEmpresaModal(true);
  };

  const handleCloseAddEmpresaModal = () => {
    setOpenAddEmpresaModal(false);
  };

  const handleOpenAddEmpresaUsuarioModal = () => {
    setOpenAddEmpresaUsuarioModal(true); // Abrir el nuevo modal
  };

  const handleCloseAddEmpresaUsuarioModal = () => {
    setOpenAddEmpresaUsuarioModal(false); // Cerrar el nuevo modal
  };

  const filteredEmpresas = empresas.filter((empresa) =>
    empresa.nombre.toLowerCase().includes(searchTerm)
  );

  // Lógica para el paginado
  const indexOfLastEmpresa = currentPage * itemsPerPage;
  const indexOfFirstEmpresa = indexOfLastEmpresa - itemsPerPage;
  const currentEmpresas = filteredEmpresas.slice(indexOfFirstEmpresa, indexOfLastEmpresa);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleReloadEmpresas = async () => {
    try {
      const data = await getEmpresasConUsuarios();
      setEmpresas(data);
    } catch (error) {
      console.error("Error al recargar las empresas:", error);
    }
  };

  return (
    <>
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div>
              <Typography variant="h5" color="blue-gray">
                Catálogo de Empresas
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Información de las empresas registradas y sus usuarios
              </Typography>
            </div>
            <div className="flex w-full shrink-0 gap-2 md:w-max">
              <div className="w-full md:w-72">
                <Input
                  label="Buscar por nombre"
                  icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                  onChange={handleSearch}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-scroll px-0">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentEmpresas.map((empresa, index) => (
                <tr key={index} className="hover:bg-blue-gray-50">
                  <td className="p-4 border-b border-blue-gray-50">
                    <Typography variant="small" color="blue-gray">
                      {empresa.nombre}
                    </Typography>
                  </td>
                  <td className="p-4 border-b border-blue-gray-50">
                    <Typography variant="small" color="blue-gray">
                      {empresa.telefono || "N/A"}
                    </Typography>
                  </td>
                  <td className="p-4 border-b border-blue-gray-50">
                    <Typography variant="small" color="blue-gray">
                      {empresa.direccion ? (
                        `${empresa.direccion.estado}, ${empresa.direccion.municipio}, ${empresa.direccion.calle}, ${empresa.direccion.colonia}, ${empresa.direccion.numExt} , ${empresa.direccion.codigoPostal}`
                      ) : "Sin dirección"}
                    </Typography>
                  </td>
                  <td className="p-4 border-b border-blue-gray-50">
                    {empresa.usuarios.length > 0 ? (
                      <ul className="list-disc pl-4">
                        {empresa.usuarios.map((usuario) => (
                          <li key={usuario.idUsuario}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {usuario.nombre} - {usuario.correo} -{" "}
                              {usuario.telefono}
                            </Typography>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <Typography variant="small" color="gray">
                        Sin usuarios asignados
                      </Typography>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Typography variant="small" color="blue-gray" className="font-normal">
            Mostrando {currentEmpresas.length} de {filteredEmpresas.length} empresas
          </Typography>
          <div className="flex gap-2">
            <Button variant="outlined" size="sm" onClick={handleOpenAddEmpresaModal}>
              Añadir nueva empresa
            </Button>
            <Button
              variant="outlined"
              size="sm"
              color="blue"
              onClick={handleOpenAddEmpresaUsuarioModal}
            >
              Añadir empresa-usuario
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Paginación */}
      <div className="flex justify-center mt-4">
        <Button
          variant="outlined"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => paginate(currentPage - 1)}
        >
          Anterior
        </Button>
        <Button
          variant="outlined"
          size="sm"
          disabled={currentPage === Math.ceil(filteredEmpresas.length / itemsPerPage)}
          onClick={() => paginate(currentPage + 1)}
        >
          Siguiente
        </Button>
      </div>

      <AddEmpresaModal
        open={openAddEmpresaModal}
        onClose={handleCloseAddEmpresaModal}
        onSuccess={handleReloadEmpresas} // Callback para recargar datos
      />
      <AddEmpresaUsuarioModal
        open={openAddEmpresaUsuarioModal}
        onClose={handleCloseAddEmpresaUsuarioModal}
        onSuccess={handleReloadEmpresas} // Callback para recargar datos
      />
    </>
  );
};

export default EmpresaList;
