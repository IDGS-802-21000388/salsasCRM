import { useState, useEffect } from "react";
import { Card, CardHeader, Typography, Button, CardBody, CardFooter, Dialog, DialogHeader, DialogBody, DialogFooter, } from "@material-tailwind/react";
import { getSales } from "../../services/ventaService";
import { getUserById } from "../../services/usuarioService";
import { getSaleDetailById } from "../../services/DetalleVentaService";
import { getProducts } from "../../services/ProductoService";
import { getEncuestasByUserId } from "../../services/EncuestaSatisfacionService";
import { getPago } from "../../services/PagoService";
import { getTarjeta } from "../../services/TarjetaService";
import { saveAs } from "file-saver";
//import CreditCardIcon from '@mui/icons-material/CreditCard';
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const TABLE_HEAD = ["Nombre Cliente", "Correo", "Rol", "Tipo Pago", "Fecha Venta", "Total", "Acciones"];

export function VentasList() {
  const [ventas, setVentas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [productos, setProductos] = useState([]);
  const [detalleVenta, setDetalleVenta] = useState(null);
  const [open, setOpen] = useState(false);
  const [canSendEmail, setCanSendEmail] = useState(false);
  const [encuestas, setEncuestas] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [tarjetas, setTarjetas] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSales, setFilteredSales] = useState([]);
  const [openCardModal, setOpenCardModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showSensitiveData, setShowSensitiveData] = useState(false);

  const handleOpen = () => setOpen(!open);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ventasResponse = await getSales();
        setVentas(ventasResponse);
        setFilteredSales(ventasResponse);

        const usuariosPromises = ventasResponse.map((venta) =>
          getUserById(venta.idUsuario)
        );
        const usuariosResponse = await Promise.all(usuariosPromises);
        setUsuarios(usuariosResponse);

        const productosResponse = await getProducts();
        setProductos(productosResponse);

        const pagosResponse = await getPago();
        setPagos(pagosResponse);

        const tarjetasResponse = await getTarjeta();
        setTarjetas(tarjetasResponse);

      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };
    fetchData();
  }, []);

  const showSaleDetails = async (idUsuario) => {
    try {
      const detalle = await getSaleDetailById(idUsuario);

      const producto = productos.find((prod) => prod.idProducto === detalle.idProducto);
      if (producto) {
        detalle.producto = producto.nombreProducto;
        detalle.precioUnitario = producto.precioVenta;
        detalle.fotografia = producto.fotografia;
      }

      const venta = ventas.find((v) => v.idVenta === detalle.idVenta);
      if (venta) {
        detalle.total = venta.total;
      }

      const usuario = usuarios.find((user) => user.idUsuario === idUsuario);
      console.log(usuario);
      if (usuario) {
        detalle.correoUsuario = usuario.correo;
        console.log("Correo API", detalle.correoUsuario);
      } else {
        console.error("Usuario no encontrado para ID:", idUsuario);
      }

      let encuestasUsuario = [];
      try {
        encuestasUsuario = await getEncuestasByUserId(idUsuario);
        if (!encuestasUsuario || encuestasUsuario.length === 0) {
          encuestasUsuario = [];
        }
      } catch (error) {
        console.error("Error al obtener las encuestas:", error);
        encuestasUsuario = [];
      }

      const ultimaEncuesta = encuestasUsuario.length > 0
        ? encuestasUsuario.sort((a, b) => new Date(b.fechaEncuesta) - new Date(a.fechaEncuesta))[0]
        : null;

      setEncuestas(ultimaEncuesta ? [ultimaEncuesta] : []);
      setDetalleVenta(detalle);
      setCanSendEmail(true);
      handleOpen();
    } catch (error) {
      console.error("Error al cargar detalles de la venta:", error);
    }
  };

  const sendEmail = async () => {
    if (!detalleVenta || encuestas.length === 0) {
      console.error("No hay detalles de la venta o encuestas para enviar.");
      return;
    }
    if (!detalleVenta.producto || !detalleVenta.correoUsuario) {
      console.error("Los datos de detalleVenta no están completos.");
      return;
    }

    // Asegurarse de que encuestas tiene datos antes de usarla
    const ultimaEncuesta = encuestas[0];  // ya está ordenada por fecha en el useEffect

    const emailBody = {
      email: detalleVenta.correoUsuario,
      subject: "Ticket de Compra y Encuesta de Satisfacción",
      cantidad: detalleVenta.cantidad,
      total: detalleVenta.total,
      productos: [
        {
          nombreProducto: detalleVenta.producto,
          fotografia: detalleVenta.fotografia || "",
        },
      ],
      // Asignar las respuestas de la última encuesta al cuerpo del correo
      entregaProducto: ultimaEncuesta ? ultimaEncuesta.entregaProducto : 5,
      facilidadUsoPagina: ultimaEncuesta ? ultimaEncuesta.facilidadUsoPagina : 5,
      presentacionProducto: ultimaEncuesta ? ultimaEncuesta.presentacionProducto : 5,
      procesoCompra: ultimaEncuesta ? ultimaEncuesta.procesoCompra : 5,
      saborProducto: ultimaEncuesta ? ultimaEncuesta.saborProducto : 5,
    };

    try {
      const response = await fetch("http://localhost:3000/enviar-correo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailBody),
      });

      if (response.ok) {
        console.log("Correo enviado exitosamente.");
      } else {
        console.error("Error al enviar el correo:", await response.json());
      }
    } catch (error) {
      console.error("Error en la solicitud de envío de correo:", error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (ventas.length === 0 || usuarios.length === 0) return;

    const filtered = ventas.filter((venta) => {
      const usuario = usuarios.find((user) => user.idUsuario === venta.idUsuario);
      const pago = pagos.find((p) => p.idVenta === venta.idVenta);

      const nombreCliente = `${usuario.nombre} ${usuario.apellido}`.toLowerCase();
      const correo = usuario.correo.toLowerCase();
      const rol = usuario.rol.toLowerCase();
      const tipoPago = pago ? pago.metodoPago.toLowerCase() : "";
      const fechaVenta = new Date(venta.fechaVenta).toLocaleDateString().toLowerCase();
      const total = venta.total.toString();

      return (
        nombreCliente.includes(query.toLowerCase()) ||
        correo.includes(query.toLowerCase()) ||
        rol.includes(query.toLowerCase()) ||
        tipoPago.includes(query.toLowerCase()) ||
        fechaVenta.includes(query.toLowerCase()) ||
        total.includes(query.toLowerCase())
      );
    });

    console.log(filtered);
    setFilteredSales(filtered);
  };

  const handleDownload = () => {
    const csvHeaders = ["ID Venta", "Nombre Usuario", "Correo", "Rol", "Método de Pago", "Fecha Venta", "Total", "Detalles Producto", "Número Tarjeta",];

    const csvData = filteredSales.map((sale) => {
      const usuario = usuarios.find((user) => user.idUsuario === sale.idUsuario);
      const pago = pagos.find((p) => p.idVenta === sale.idVenta);
      const tarjeta = pago ? tarjetas.find((t) => t.idPago === pago.idPago) : null;

      const productosDetalles = detalleVenta
        ?.filter((detalle) => detalle.idVenta === sale.idVenta)
        .map(
          (detalle) =>
            `Producto: ${detalle.producto || "N/A"}, Cantidad: ${detalle.cantidad || "N/A"
            }, Precio Unitario: ${detalle.precioUnitario || "N/A"}`
        )
        .join(" | ") || "Sin detalles";

      const tarjetaDetalle = tarjeta
        ? `**** **** **** ${tarjeta.numeroTarjeta.slice(-4)}`
        : "Sin información";

      return [
        sale.idVenta,
        usuario ? `${usuario.nombre} ${usuario.nombreUsuario}` : "Sin usuario",
        usuario ? usuario.correo : "Sin correo",
        usuario ? usuario.rol : "Sin rol",
        pago ? pago.metodoPago : "Sin pago",
        new Date(sale.fechaVenta).toLocaleDateString(),
        `$${sale.total}`,
        productosDetalles,
        tarjetaDetalle,
      ].join(",");
    });

    const csvContent = [csvHeaders.join(","), ...csvData].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "ventas_completas.csv");
  };


  function renderStars(rating) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<span key={i} style={{ color: 'gold' }}>★</span>);
      } else {
        stars.push(<span key={i} style={{ color: 'gray' }}>★</span>);
      }
    }
    return stars;
  }

  const handleCardDetails = (tarjeta) => {
    if (tarjeta) {
      setSelectedCard(tarjeta);
      setOpenCardModal(true);
    }
  };

  const closeCardModal = () => {
    setOpenCardModal(false);
    setSelectedCard(null);
  };

  const toggleSensitiveData = () => {
    setShowSensitiveData(!showSensitiveData);
  };

  const maskCardDetails = (numeroTarjeta) => {
    const maskedNumber = `**** **** **** ${numeroTarjeta.slice(-4)}`;
    const maskedCVV = `***`;
    return { maskedNumber, maskedCVV };
  };

  return (
    <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-4 flex justify-between items-center gap-4">
          <div>
            <Typography variant="h5" color="blue-gray">
              Ventas Recientes
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              Estos son los detalles de las últimas ventas
            </Typography>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Buscar"
              className="p-2 border border-gray-300 rounded-lg"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <Button variant="gradient" size="sm" color="blue" onClick={handleDownload}>
              Descargar
            </Button>
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
            {ventas.length > 0 ? (
              ventas
                .filter((venta) => {
                  const usuario = usuarios.find((user) => user.idUsuario === venta.idUsuario);
                  const pago = pagos.find((p) => p.idVenta === venta.idVenta);

                  const searchTerm = searchQuery.toLowerCase();
                  return (
                    (usuario ? `${usuario.nombre} ${usuario.nombreUsuario}`.toLowerCase().includes(searchTerm) : false) ||
                    (usuario ? usuario.correo.toLowerCase().includes(searchTerm) : false) ||
                    (pago ? pago.metodoPago.toLowerCase().includes(searchTerm) : false) ||
                    new Date(venta.fechaVenta).toLocaleDateString().includes(searchTerm) ||
                    `${venta.total}`.includes(searchTerm)
                  );
                })
                .map((venta, index) => {
                  const usuario = usuarios.find((user) => user.idUsuario === venta.idUsuario);
                  const pago = pagos.find((p) => p.idVenta === venta.idVenta);
                  const tarjeta = pago ? tarjetas.find((t) => t.idPago === pago.idPago) : null;
                  const isLast = index === ventas.length - 1;
                  const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={venta.idVenta}>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-bold">
                          {usuario ? `${usuario.nombre} ${usuario.nombreUsuario}` : "Cargando..."}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {usuario ? usuario.correo : "Cargando..."}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {usuario ? usuario.rol : "Cargando..."}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {pago ? pago.metodoPago : "Cargando..."}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {new Date(venta.fechaVenta).toLocaleDateString()}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          ${venta.total}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <div className="flex space-x-4">
                          <div
                            onClick={() => showSaleDetails(venta.idVenta)}
                            className="cursor-pointer"
                          >
                            <EyeIcon className="w-5 h-5" />
                          </div>

                          {tarjeta ? (
                            <div
                              onClick={() => handleCardDetails(tarjeta)}
                              className="cursor-pointer"
                            >
                              {/* <CreditCardIcon className="w-5 h-5" /> */}
                            </div>
                          ) : (
                            <div className="text-gray-400 cursor-not-allowed">
                              {/* <CreditCardIcon className="w-5 h-5" /> */}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
            ) : (
              <tr>
                <td colSpan="7" className="p-4 text-center">
                  No hay ventas registradas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Button variant="outlined" size="sm">
          Anterior
        </Button>
        <Button variant="outlined" size="sm">
          Siguiente
        </Button>
      </CardFooter>

      <Dialog
        open={open}
        handler={handleOpen}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogHeader>Detalles de la Venta</DialogHeader>
        <DialogBody>
          {detalleVenta ? (
            <div>
              <div className="flex justify-center">
                {/*<img
                  src={`${detalleVenta.fotografia}`}
                  alt={detalleVenta.producto}
                  className="max-w-[150px] max-h-[150px] object-contain"
                />*/}
              </div>

              <Typography variant="small" color="blue-gray">
                <strong>Producto:</strong> {detalleVenta.producto}
              </Typography>
              <Typography variant="small" color="blue-gray">
                <strong>Cantidad:</strong> {detalleVenta.cantidad}
              </Typography>
              <Typography variant="small" color="blue-gray">
                <strong>Precio Unitario:</strong> ${detalleVenta.precioUnitario}
              </Typography>
              <Typography variant="small" color="blue-gray">
                <strong>Total:</strong> ${detalleVenta.total}
              </Typography>

              {encuestas.length > 0 && (
                <div>
                  <Typography variant="small" color="blue-gray" className="mt-4">
                    <strong>Última Encuesta de Satisfacción:</strong>
                  </Typography>
                  <Typography variant="small" color="blue-gray" className="mt-2">
                    <strong>Proceso de Compra:</strong> {renderStars(encuestas[0].procesoCompra)}
                  </Typography>
                  <Typography variant="small" color="blue-gray" className="mt-2">
                    <strong>Sabor del Producto:</strong> {renderStars(encuestas[0].saborProducto)}
                  </Typography>
                  <Typography variant="small" color="blue-gray" className="mt-2">
                    <strong>Presentación del Producto:</strong> {renderStars(encuestas[0].presentacionProducto)}
                  </Typography>
                  <Typography variant="small" color="blue-gray" className="mt-2">
                    <strong>Entrega del Producto:</strong> {renderStars(encuestas[0].entregaProducto)}
                  </Typography>
                  <Typography variant="small" color="blue-gray" className="mt-2">
                    <strong>Facilidad de Uso de la Página:</strong> {renderStars(encuestas[0].facilidadUsoPagina)}
                  </Typography>
                </div>
              )}

              {encuestas.length === 0 && (
                <Typography variant="small" color="blue-gray" className="mt-4">
                  El Usuario no ha respondido la encuesta.
                </Typography>
              )}
            </div>
          ) : (
            "Cargando detalles..."
          )}
        </DialogBody>


        <DialogFooter>
          {canSendEmail && (
            <Button variant="gradient" color="green" onClick={sendEmail} className="mr-2">
              Enviar Correo
            </Button>
          )}
          <Button variant="text" color="red" onClick={handleOpen} className="mr-1">
            Cerrar
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog open={openCardModal} handler={closeCardModal} className="rounded-lg shadow-lg">
        <DialogHeader className="text-center text-blue-gray-700 font-bold text-lg">
          Detalles de la Tarjeta
        </DialogHeader>
        <DialogBody divider className="px-6 py-4">
          {selectedCard ? (
            <>
              <div className="mb-4">
                <Typography variant="small" color="blue-gray" className="font-bold">
                  <strong>Titular:</strong>
                </Typography>
                <Typography variant="small" color="gray" className="ml-2">
                  {selectedCard.nombreTitular}
                </Typography>
              </div>
              <div className="mb-4 flex items-center">
                <Typography variant="small" color="blue-gray" className="font-bold">
                  <strong>Número de tarjeta:</strong>
                </Typography>
                <Typography variant="small" color="gray" className="ml-3">
                  {showSensitiveData
                    ? selectedCard.numeroTarjeta
                    : maskCardDetails(selectedCard.numeroTarjeta, selectedCard.cvv).maskedNumber}
                </Typography>
              </div>
              <div className="mb-4 flex items-center">
                <Typography variant="small" color="blue-gray" className="font-bold">
                  <strong>CVV:</strong>
                </Typography>
                <Typography variant="small" color="gray" className="ml-3">
                  {showSensitiveData
                    ? selectedCard.cvv
                    : maskCardDetails(selectedCard.numeroTarjeta, selectedCard.cvv).maskedCVV}
                </Typography>
                <button
                  className="ml-4 p-2 text-blue-gray-600 hover:text-blue-500"
                  onClick={toggleSensitiveData}
                >
                  {showSensitiveData ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              <div className="mb-4">
                <Typography variant="small" color="blue-gray" className="font-bold">
                  <strong>Fecha de Expiración:</strong>
                </Typography>
                <Typography variant="small" color="gray" className="ml-2">
                  {selectedCard.fechaExpiracion}
                </Typography>
              </div>
            </>
          ) : (
            <Typography variant="small" color="red" className="text-center">
              No hay detalles disponibles.
            </Typography>
          )}
        </DialogBody>
        <DialogFooter className="flex justify-end px-4 py-2">
          <Button variant="text" color="red" onClick={closeCardModal} className="hover:bg-red-50">
            Cerrar
          </Button>
        </DialogFooter>
      </Dialog>
    </Card>
  );
}

export default VentasList;
