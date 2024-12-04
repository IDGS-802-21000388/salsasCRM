import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { obtenerTodasCotizaciones, cerrarCotizacion } from "../services/dashboardService";

Modal.setAppElement('#root');

const Dashboard = () => {
  const [cotizacionesAbiertas, setCotizacionesAbiertas] = useState([]);
  const [cotizacionesCerradas, setCotizacionesCerradas] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCotizacion, setSelectedCotizacion] = useState(null);

  // Filtros
  const [searchEmail, setSearchEmail] = useState('');

  // Paginación
  const [currentPageAbiertas, setCurrentPageAbiertas] = useState(1);
  const [currentPageCerradas, setCurrentPageCerradas] = useState(1);
  const cotizacionesPerPage = 3;

  useEffect(() => {
    fetchCotizaciones();
  }, []);

  const fetchCotizaciones = async () => {
    try {
      const cotizaciones = await obtenerTodasCotizaciones();
      const agrupadas = agruparCotizaciones(cotizaciones);

      const abiertas = agrupadas.filter((cot) => cot.atendida === 0);
      const cerradas = agrupadas.filter((cot) => cot.atendida === 1);

      setCotizacionesAbiertas(abiertas);
      setCotizacionesCerradas(cerradas);
    } catch (error) {
      console.error('Error al obtener cotizaciones:', error);
    }
  };

  const agruparCotizaciones = (cotizaciones) => {
    const agrupadas = {};

    cotizaciones.forEach((cot) => {
      if (!agrupadas[cot.idCotizacion]) {
        agrupadas[cot.idCotizacion] = {
          ...cot,
          detalles: [],
        };
      }
      agrupadas[cot.idCotizacion].detalles.push({
        descripcion: cot.descripcion,
        cantidad: cot.cantidad,
        precioUnitario: cot.precioUnitario,
        totalDetalle: cot.totalDetalle,
      });
    });

    return Object.values(agrupadas);
  };

  const openModal = (cotizacion) => {
    setSelectedCotizacion(cotizacion);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedCotizacion(null);
    setModalIsOpen(false);
  };

  const handleCerrarCotizacion = async (idCotizacion) => {
    try {
      await cerrarCotizacion(idCotizacion);
      alert('Cotización cerrada correctamente');
      fetchCotizaciones();
    } catch (error) {
      console.error('Error al cerrar la cotización:', error);
    }
  };

  const renderCotizacion = (cotizacion) => (
    <div key={cotizacion.idCotizacion} className="bg-white p-4 rounded-lg shadow mb-4">
      <h3 className="text-xl font-bold text-green-700 mb-2">
        Cotización #{cotizacion.idCotizacion}
      </h3>
      <p>Email Cliente: {cotizacion.emailCliente}</p>
      <p>Fecha Creación: {new Date(cotizacion.fechaCreacion).toLocaleDateString()}</p>
      <p>Subtotal: ${cotizacion.subtotal.toFixed(2)}</p>
      <p>IVA: ${cotizacion.iva.toFixed(2)}</p>
      <p>Total Cotización: ${cotizacion.totalCotizacion.toFixed(2)}</p>
      <button
        className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        onClick={() => openModal(cotizacion)}
      >
        Ver Detalles
      </button>
      {cotizacion.atendida === 0 && (
        <button
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          onClick={() => handleCerrarCotizacion(cotizacion.idCotizacion)}
        >
          Cerrar Cotización
        </button>
      )}
    </div>
  );

  const totalCotizaciones = cotizacionesAbiertas.length + cotizacionesCerradas.length;
  const porcentajeAbiertas =
    totalCotizaciones === 0 ? 0 : (cotizacionesAbiertas.length / totalCotizaciones) * 100;
  const porcentajeCerradas = 100 - porcentajeAbiertas;

  // Filtro aplicado antes de la paginación
  const filteredAbiertas = cotizacionesAbiertas.filter((cot) =>
    cot.emailCliente.toLowerCase().includes(searchEmail.toLowerCase())
  );
  const filteredCerradas = cotizacionesCerradas.filter((cot) =>
    cot.emailCliente.toLowerCase().includes(searchEmail.toLowerCase())
  );

  // Paginación lógica
  const indexOfLastAbierta = currentPageAbiertas * cotizacionesPerPage;
  const indexOfFirstAbierta = indexOfLastAbierta - cotizacionesPerPage;
  const currentAbiertas = filteredAbiertas.slice(indexOfFirstAbierta, indexOfLastAbierta);

  const indexOfLastCerrada = currentPageCerradas * cotizacionesPerPage;
  const indexOfFirstCerrada = indexOfLastCerrada - cotizacionesPerPage;
  const currentCerradas = filteredCerradas.slice(indexOfFirstCerrada, indexOfLastCerrada);

  const handleNextPageAbiertas = () => {
    if (indexOfLastAbierta < filteredAbiertas.length) {
      setCurrentPageAbiertas((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPageAbiertas = () => {
    if (currentPageAbiertas > 1) {
      setCurrentPageAbiertas((prevPage) => prevPage - 1);
    }
  };

  const handleNextPageCerradas = () => {
    if (indexOfLastCerrada < filteredCerradas.length) {
      setCurrentPageCerradas((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPageCerradas = () => {
    if (currentPageCerradas > 1) {
      setCurrentPageCerradas((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Dashboard superior */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow flex items-center justify-center">
          <div className="w-1/2">
            <CircularProgressbar
              value={porcentajeAbiertas}
              text={`${Math.round(porcentajeAbiertas)}%\n(${cotizacionesAbiertas.length})`}
              styles={buildStyles({
                textSize: '12px',
                textColor: '#217765',
                pathColor: '#217765',
                trailColor: '#d6d6d6',
              })}
            />
            <p className="text-center text-green-700 mt-4">Cotizaciones Abiertas</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow flex items-center justify-center">
          <div className="w-1/2">
            <CircularProgressbar
              value={porcentajeCerradas}
              text={`${Math.round(porcentajeCerradas)}%\n(${cotizacionesCerradas.length})`}
              styles={buildStyles({
                textSize: '12px',
                textColor: '#e3342f',
                pathColor: '#e3342f',
                trailColor: '#d6d6d6',
              })}
            />
            <p className="text-center text-red-700 mt-4">Cotizaciones Cerradas</p>
          </div>
        </div>
      </div>

      {/* Filtro de búsqueda */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por email del cliente"
          className="w-full p-2 border rounded"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
        />
      </div>

      {/* Sección inferior con listas filtradas y paginación */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold text-green-700 mb-4">Cotizaciones Abiertas</h2>
          {currentAbiertas.map(renderCotizacion)}
          <div className="flex justify-between mt-4">
            <button
              onClick={handlePrevPageAbiertas}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              disabled={currentPageAbiertas === 1}
            >
              Anterior
            </button>
            <button
              onClick={handleNextPageAbiertas}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              disabled={indexOfLastAbierta >= filteredAbiertas.length}
            >
              Siguiente
            </button>
          </div>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold text-red-700 mb-4">Cotizaciones Cerradas</h2>
          {currentCerradas.map(renderCotizacion)}
          <div className="flex justify-between mt-4">
            <button
              onClick={handlePrevPageCerradas}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              disabled={currentPageCerradas === 1}
            >
              Anterior
            </button>
            <button
              onClick={handleNextPageCerradas}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              disabled={indexOfLastCerrada >= filteredCerradas.length}
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="bg-white p-6 rounded-lg shadow-lg max-w-xl mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        {selectedCotizacion && (
          <>
            <h2 className="text-2xl font-bold text-green-700 mb-4">
              Detalles de Cotización #{selectedCotizacion.idCotizacion}
            </h2>
            <div className="space-y-4">
              {selectedCotizacion.detalles.map((detalle, index) => (
                <div key={index} className="p-4 bg-gray-100 rounded shadow">
                  <p><strong>Descripción:</strong> {detalle.descripcion}</p>
                  <p><strong>Cantidad:</strong> {detalle.cantidad}</p>
                  <p><strong>Precio Unitario:</strong> ${detalle.precioUnitario.toFixed(2)}</p>
                  <p><strong>Total Detalle:</strong> ${detalle.totalDetalle.toFixed(2)}</p>
                </div>
              ))}
            </div>
            <button
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={closeModal}
            >
              Cerrar
            </button>
          </>
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;
