import { useEffect, useState } from "react";
import { Card, CardHeader, Typography, CardBody, Input } from "@material-tailwind/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { getUsers } from "../../services/UsuarioService";
import { getAgentesVenta } from "../../services/AgentesVentaService";
import { getEmpresasConUsuarios } from "../../services/EmpresaService";

const TABLE_HEAD = [
  "Nombre",
  "Rol",
  "Dirección",
  "Correo",
  "Teléfono",
  "Redes Sociales",
  "¿Cómo llegó?",
  "Comunicación Preferida",
  "Grupos/Asociaciones",
];

const ClientCatalog = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [agentesVenta, setAgentesVenta] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  
  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5; // Número de usuarios por página

  useEffect(() => {
    const fetchUsersAndAgentesAndEmpresas = async () => {
      try {
        const usersData = await getUsers();
        const agentesData = await getAgentesVenta();
        const empresasData = await getEmpresasConUsuarios();

        const filteredUsers = usersData.filter((user) =>
          ["cliente", "hotel", "restaurante"].includes(user.rol.toLowerCase())
        );

        setUsers(filteredUsers);
        setFilteredUsers(filteredUsers);
        setAgentesVenta(agentesData);
        setEmpresas(empresasData);

      } catch (error) {
        console.error("Error fetching users, agentes de venta, or empresas:", error);
      }
    };

    fetchUsersAndAgentesAndEmpresas();
  }, []);

  // Filtrar los usuarios por búsqueda
  useEffect(() => {
    setFilteredUsers(
      users.filter(
        (user) =>
          user.nombre.toLowerCase().includes(search.toLowerCase()) ||
          user.correo.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, users]);

  // Función para obtener los usuarios visibles según la página actual
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Función para determinar "Cómo llegó"
  const getComoLlegó = (userId) => {
    const agente = agentesVenta.find((agente) => agente.idCliente === userId);
    if (agente) {
      return "Agente de Venta";
    }
    return "Página Web";
  };

  // Función para obtener las empresas asociadas a un usuario
  const getEmpresasAsociadas = (userId) => {
    const empresasAsociadas = empresas.filter((empresa) =>
      empresa.usuarios.some((usuario) => usuario.idUsuario === userId)
    );

    if (empresasAsociadas.length > 0) {
      return empresasAsociadas.map((empresa) => empresa.nombre).join(", ");
    }
    return "N/A"; // Si no tiene empresas asociadas
  };

  // Cambiar página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Número total de páginas
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredUsers.length / usersPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <Typography variant="h5" color="blue-gray">
              Catálogo de Clientes
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              Lista de clientes, hoteles y restaurantes registrados
            </Typography>
          </div>
          <div className="flex w-full shrink-0 gap-2 md:w-max">
            <div className="w-full md:w-72">
              <Input
                label="Buscar"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
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
                <th key={head} className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
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
            {currentUsers.map((user, index) => {
              const address = `${user.direccion.calle} ${user.direccion.numExt}${
                user.direccion.numInt ? `, ${user.direccion.numInt}` : ""
              }, ${user.direccion.colonia}, ${user.direccion.municipio}, ${user.direccion.estado}, CP ${user.direccion.codigoPostal}`;

              const preferredCommunication = user.correo || user.telefono || "N/A";

              const isLast = index === currentUsers.length - 1;
              const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

              return (
                <tr key={user.idUsuario}>
                  <td className={classes}>
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {user.nombre}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography variant="small" color="blue-gray" className="font-normal capitalize">
                      {user.rol}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {address}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {user.correo}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {user.telefono}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {user.redesSociales ? `${user.redesSociales}, ${user.nombreUsuario}` : user.nombreUsuario || "N/A"}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {getComoLlegó(user.idUsuario)}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {preferredCommunication}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {getEmpresasAsociadas(user.idUsuario)}
                    </Typography>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardBody>

      {/* Paginación */}
      <div className="flex justify-center py-4">
        <nav>
          <ul className="flex space-x-2">
            {pageNumbers.map((number) => (
              <li key={number}>
                <button
                  onClick={() => paginate(number)}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === number ? "bg-blue-500 text-white" : "bg-gray-200"
                  }`}
                >
                  {number}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </Card>
  );
};

export default ClientCatalog;
