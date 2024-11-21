import '../../css/pagina404.css';
import imagenlogo from "../../assets/logo.png"

const Pagina404 = () => {

    return (
        <div className="pagina404-container">
            <div className="pagina404-content">
                <img
                    src={imagenlogo}
                    alt="Logo Salsas Reni"
                    className="pagina404-logo"
                />
                <h1 className="pagina404-title">¡Ups! Página no encontrada</h1>
                <p className="pagina404-description">Lo sentimos, la página que buscas no existe.</p>
                <p className="pagina404-subtext">Vuelve a nuestra página principal y explora más.</p>
            </div>
        </div>
    );
}

export default Pagina404;
