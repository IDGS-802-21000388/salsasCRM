import { Link, useNavigate } from "react-router-dom";
import "../../css/nav-var.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useState, useEffect } from "react";
import logo from "../../assets/logo.png";

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ nombreUsuario: "", rol: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const parsedToken = JSON.parse(token);
      setUserData({
        nombreUsuario: parsedToken.nombreUsuario,
        rol: parsedToken.rol,
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div
      id="nav-bar"
      className={menuOpen ? "open" : "closed"}
      onMouseEnter={() => setMenuOpen(true)}
      onMouseLeave={() => setMenuOpen(false)}
    >
      <div id="nav-header">
        <Link id="nav-title" to="/inicio">
          {menuOpen ? (
            "C R M"
          ) : (
            <img src={logo} alt="Logo" className="nav-logo" />
          )}
        </Link>
        <hr />
      </div>
      <div id="nav-content">
        <Link to="/inicio" className="nav-button">
          <i className="fas fa-home"></i>
          <span>Inicio</span>
        </Link>
        <Link to="/ventas" className="nav-button">
          <i className="fas fa-receipt"></i>
          <span>Historial de Ventas</span>
        </Link>
        <Link to="/clientes" className="nav-button">
          <i className="fas fa-user-friends"></i>
          <span>Clientes</span>
        </Link>
        <Link to="/empresas" className="nav-button">
          <i className="fas fa-building"></i>
          <span>Empresas</span>
        </Link>
        <Link to="/promociones" className="nav-button">
          <i className="fas fa-tags"></i>
          <span>Promociones</span>
        </Link>
        <Link to="/dashboard" className="nav-button">
          <i className="fas fa-tachometer-alt"></i>
          <span>Dashboard</span>
        </Link>
        <Link to="/contactoCliente" className="nav-button">
          <i className="fas fa-envelope"></i>
          <span>Historial de Contacto</span>
        </Link>
        <Link to="/quejas" className="nav-button">
          <i className="fas fa-exclamation-triangle"></i>
          <span>Quejas y Comentarios</span>
        </Link>
        <div id="nav-content-highlight"></div>
      </div>
      <button
        id="logout-button"
        onClick={handleLogout}
        className="nav-logout-button"
      >
        <i className="fas fa-sign-out-alt"></i>
        <span>Cerrar Sesión</span>
      </button>
      <div id="nav-footer">
        <div id="nav-footer-heading">
          <div id="nav-footer-avatar">
            <img src={logo} alt="Avatar" />
          </div>
          <div id="nav-footer-titlebox">
            <Link id="nav-footer-title">{userData.nombreUsuario}</Link>
            <span id="nav-footer-subtitle">{userData.rol}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
