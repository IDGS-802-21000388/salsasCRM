import '../../css/index.css';
import logo from '/src/Assets/logo.png';

function Index() {
  return (
    <div className="index-container">
      <div className="logo-wrapper">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <h1 className="welcome-text">¡Bienvenido a C R M!</h1>
      <p className="description-text">
        Aquí encontrarás todas las herramientas que necesitas para gestionar tus
        recursos de manera eficiente.
      </p>
    </div>
  );
}

export default Index;
