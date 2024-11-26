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
import { Bounce, toast } from "react-toastify";
//import CreditCardIcon from '@mui/icons-material/CreditCard';
import { EyeIcon, EyeSlashIcon, CreditCardIcon  } from "@heroicons/react/24/outline";

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
  const [correoUsuarioV, setCorreoUsuarioV] = useState(null);
  const [compraV, setCompraV] = useState(null);
  const [ultimaEncuestaV, setUltimaEncuestaV] = useState(null);
  const [nombreUsuarioV, setNombreUsuarioV] = useState(null);


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
      if (usuario) {
        detalle.correoUsuario = usuario.correo;
        setCorreoUsuarioV(usuario.correo);
        setNombreUsuarioV(usuario.nombre);
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
  
      const compra = {
        cantidad: detalle.cantidad,
        total: detalle.total,
        productos: [{ nombreProducto: producto.nombreProducto, precioUnitario: producto.precioVenta }],
      };
  
      setCompraV(compra);
  
      const ultimaEncuesta = encuestasUsuario.length > 0
        ? encuestasUsuario.sort((a, b) => new Date(b.fechaEncuesta) - new Date(a.fechaEncuesta))[0]
        : null;
      setUltimaEncuestaV(ultimaEncuesta);
  
      setEncuestas(ultimaEncuesta ? [ultimaEncuesta] : []);
      setDetalleVenta(detalle);
      setCanSendEmail(true);
  
      handleOpen();
    } catch (error) {
      console.error("Error al cargar detalles de la venta:", error);
    }
  };
  
  const sendEmail = async () => {

    const email = correoUsuarioV;
    const compra = compraV;
    const encuesta = ultimaEncuestaV;
    const usuario = nombreUsuarioV;

    if (!email) {
      console.error("No se proporcionó un correo electrónico.");
      return;
    }
  
    if (!compra || !compra.cantidad || !compra.total || !compra.productos) {
      console.error("Información de la compra incompleta.");
      return;
    }
  
    if (!encuesta) {
      console.error("No se encontró ninguna encuesta asociada.");
      return;
    }
  
    const logoUrl = `https://drive.google.com/uc?export=view&id=1NjIiYJWBDYkn8DhVzyXuqciEETddfa8M`;
  
    const renderStars = (rating) => {
      return "★".repeat(rating) + "☆".repeat(5 - rating);
    };
  
    const htmlMessage = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f7f7f7; margin: 0; padding: 0;">
          <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="${logoUrl}" alt="Salsas Reni" style="width: 150px;" />
            </div>
            <h1 style="color: #c31a23; text-align: center;">¡Gracias por tu compra, ${usuario}!</h1>
            <p style="text-align: center; color: #333;">Estos son los detalles de tu pedido:</p>
            <div style="background-color: #f9f9f9; margin-top: 20px; padding: 15px; border-radius: 8px;">
              <p style="font-weight: bold; color: #333;">Cantidad de productos:</p>
              <p style="color: #555;">${compra.cantidad}</p>
              <p style="font-weight: bold; color: #333;">Total:</p>
              <p style="color: #555;">$${compra.total.toFixed(2)}</p>
            </div>
            <h3 style="color: #c31a23; text-align: center; margin-top: 20px;">Productos adquiridos</h3>
            <div style="margin-top: 20px;">
              ${compra.productos
                .map(
                  (p) => `
                  <div style="display: flex; align-items: center; margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">
                    <p style="font-weight: bold; color: #333;">${p.nombreProducto}</p>
                  </div>`
                )
                .join("")}
            </div>
            <h3 style="color: #c31a23; text-align: center; margin-top: 20px;">Encuesta de Satisfacción</h3>
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px;">
              <p><strong>Proceso de Compra:</strong> ${encuesta.procesoCompra} ${renderStars(encuesta.procesoCompra)}</p>
              <p><strong>Sabor del Producto:</strong> ${encuesta.saborProducto} ${renderStars(encuesta.saborProducto)}</p>
              <p><strong>Entrega del Producto:</strong> ${encuesta.entregaProducto} ${renderStars(encuesta.entregaProducto)}</p>
              <p><strong>Presentación del Producto:</strong> ${encuesta.presentacionProducto} ${renderStars(encuesta.presentacionProducto)}</p>
              <p><strong>Facilidad de Uso de la Página:</strong> ${encuesta.facilidadUsoPagina} ${renderStars(encuesta.facilidadUsoPagina)}</p>
            </div>
            <div style="text-align: center; margin-top: 20px;">
              <p style="color: #333;">Si tienes alguna duda o necesitas más información, no dudes en contactarnos.</p>
              <p style="color: #555;">¡Gracias por elegir Salsas Reni!</p>
            </div>
          </div>
        </body>
      </html>
    `;
  
    const emailBody = {
      emails: [email],
      mensaje: htmlMessage,
    };

    try {
      const response = await fetch("http://localhost:7215/api/PromoPorTipo/enviar-ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailBody),
      });
  
      if (response.ok) {
        console.log("Correo enviado exitosamente.");
        toast.success("Envio de ticket exitosa.", {
          position: "bottom-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      } else {
        console.error("Error al enviar el correo:", await response.json());
        toast.error(
          "Error al enviar el ticket. Por favor, verifica los datos.",
          {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          }
        );
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
    toast.success("Descarga exitosa.", {
      position: "bottom-center",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
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
                              <CreditCardIcon className="w-5 h-5" />
                            </div>
                          ) : (
                            <div className="text-gray-400 cursor-not-allowed">
                              <CreditCardIcon className="w-5 h-5" />
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
