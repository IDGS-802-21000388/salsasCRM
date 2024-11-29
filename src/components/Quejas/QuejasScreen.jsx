import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useQuejasViewModel from '../../components/Quejas/useQuejasViewModel';
import './../../css/QuejasScreen.css';

const QuejasScreen = () => {
  const { quejas, loading, error, responderQueja, finalizarQueja } = useQuejasViewModel();
  const [accion, setAccion] = useState('');
  const [comentario, setComentario] = useState('');
  const [expandedQuejaId, setExpandedQuejaId] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    nuevas: false,
    enProceso: false,
    resueltas: false,
  });

  const sanitizeInput = (input) => /^[a-zA-Z0-9\s.,!?ñÑáéíóúÁÉÍÓÚ]+$/.test(input);

  const handleResponder = async (id) => {
    if (!accion.trim() || !comentario.trim()) {
      toast.error('Acción y comentario no pueden estar vacíos.');
      return;
    }
    if (!sanitizeInput(accion) || !sanitizeInput(comentario)) {
      toast.error('La entrada contiene caracteres no permitidos.');
      return;
    }

    toast.info('Enviando seguimiento...');
    try {
      await responderQueja(id, accion, comentario);
      toast.success('Seguimiento egistrado exitosamente.');
      setAccion('');
      setComentario('');
    } catch {
      toast.error('Error al enviar el seguimiento.');
    }
  };

  
  const handleFinalizar = async (id) => {
    const confirmFinalizar = window.confirm("¿Estás seguro de que deseas finalizar esta queja?");
  
    if (confirmFinalizar) {
      toast.info('Finalizando queja...');
      try {
        await finalizarQueja(id);
        toast.success('Queja marcada como resuelta.');
      } catch {
        toast.error('Error al finalizar la queja.');
      }
    } else {
      toast.info('Finalización cancelada.');
    }
  };

  const toggleExpandQueja = (id) => setExpandedQuejaId((prevId) => (prevId === id ? null : id));

  const toggleSection = (section) =>
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));

  if (loading) return <p className="loading">Cargando...</p>;
  if (error) return <p className="error">{error}</p>;

  const renderQuejas = (quejasFiltradas, estadoTitulo, sectionKey) => (
    <div className="quejas-section">
      <button
        className="btn btn-toggle-section"
        onClick={() => toggleSection(sectionKey)}
      >
        {expandedSections[sectionKey] ? `Contraer ${estadoTitulo}` : `Expandir ${estadoTitulo}`}
      </button>
      {expandedSections[sectionKey] && (
        <div className="quejas-list">
          {quejasFiltradas.length > 0 ? (
            quejasFiltradas.map((queja) => (
              <div
  key={queja.id}
  className="queja-card"
  onClick={(e) => {
    // Evitar que el formulario cierre el card al hacer clic
    if (e.target.closest('.form-seguimiento')) return; // Si es dentro del formulario, no hacer nada
    toggleExpandQueja(queja.id); // Solo expandir si es fuera del formulario
  }}
>
  <div className="queja-info">
    <h1><strong>{queja.contenido}</strong></h1>
    <p><i className="fas fa-user"></i> <strong>Nombre:</strong> {queja.usuarioN}</p>
    <p><i className="fas fa-user"></i> <strong>Usuario:</strong> {queja.usuarioNombre}</p>
    <h3><i className="fas fa-info-circle"></i> <strong>Estado:</strong> {queja.estado}</h3>
    <p><i className="fas fa-calendar-alt"></i> <strong>Fecha:</strong> {queja.fechaCreacion}</p>
    <p><i class="fa-solid fa-envelope"></i> <strong>Correo: </strong>{queja.usuarioCorreo}</p>
    <p><i class="fa-solid fa-phone"></i> <strong>Telefono: </strong>{queja.usuarioTelefono}</p>

  </div>
  
  {expandedQuejaId === queja.id && (
    <div className="seguimiento-section">
      <div className="seguimientos">
        <h4>Seguimiento</h4>
        <br></br>
        {queja.seguimientos.length > 0 ? (
          <ul>
            {queja.seguimientos.map((seguimiento) => (
              <li key={seguimiento.id}>
                <p><i class="fa-solid fa-headset"></i> <strong>Acción:</strong> {seguimiento.accion}</p>
                <p><i class="fa-regular fa-pen-to-square"></i> <strong>Comentario:</strong> {seguimiento.comentario}</p>
                <p><i className="fas fa-calendar-alt"></i> <strong>Fecha:</strong> {seguimiento.fechaAccion}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay seguimientos registrados.</p>
        )}
      </div>

      <div className="form-seguimiento">
        <h4>Agregar Seguimiento:</h4>
        <input
          type="text"
          placeholder="Acción realizada..."
          value={accion}
          onChange={(e) => setAccion(e.target.value)}
        />
        <textarea
          placeholder="Escribe un comentario..."
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
        />
        <button className="btn btn-responder" onClick={() => handleResponder(queja.id)}>
          Registrar Seguimiento
        </button>
      </div>
    </div>
  )}
  
  <div className="actions">
    {queja.estado !== 'Resuelta' && (
      <button className="btn btn-finalizar" onClick={() => handleFinalizar(queja.id)}>
        Finalizar
      </button>
    )}
  </div>
</div>

            ))
          ) : (
            <p>No hay quejas o comentarios en esta categoría.</p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="quejas-container">
      <ToastContainer />
      <h1 className="header">Gestión de Quejas y Comentarios</h1>
      {renderQuejas(quejas.filter((q) => q.estado === 'Nueva'), 'Quejas/Comentarios Nuevos', 'nuevas')}
      {renderQuejas(quejas.filter((q) => q.estado === 'En Proceso'), 'Quejas/Comentarios En Proceso', 'enProceso')}
      {renderQuejas(quejas.filter((q) => q.estado === 'Resuelta'), 'Quejas/Comentarios Resueltos', 'resueltas')}
    </div>
  );
};

export default QuejasScreen;
