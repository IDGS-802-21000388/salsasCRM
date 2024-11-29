import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import NavBar from './components/nav-bar/nav-var';
import Index from './Components/Index/Index';
import './App.css';
import { useState } from 'react';
import VentasList from './components/VentasList/VentasList';
import ClientCatalog from './components/CatalogoClientes/ClientCatalog';
import EmpresaList from './components/CatalogoEmpresas/EmpresaList';
import Login from './pages/Login';
//import Home from './pages/Home';
import Promociones from './pages/Promociones';
import Pagina404 from './components/Pagina404/pagina404';
import Dashboard from './pages/Dashboard';
import ContactoCliente from './pages/ContactoCliente';
import QuejasScreen from './components/Quejas/QuejasScreen';

function AppContent() {
  const [menuOpen, setMenuOpen] = useState(true);
  const location = useLocation();

  const isLoginRoute = location.pathname === '/';

  return (
    <div className={`app-container ${isLoginRoute ? '' : menuOpen ? 'menu-open' : 'menu-closed'}`}>
      {!isLoginRoute && <NavBar setMenuOpen={setMenuOpen} menuOpen={menuOpen} />}
      
      <div className={`content ${isLoginRoute ? '' : 'content-style'}`}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/inicio" element={<Index />} />
          <Route path="/ventas" element={<VentasList />} />
          <Route path="/clientes" element={<ClientCatalog/>} />
          <Route path="/empresas" element={<EmpresaList/>} />
          <Route path="/promociones" element={<Promociones />} />
          <Route path="/inicio" element={<Index />} />
          <Route path="/ventas" element={<VentasList/>} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/contactoCliente" element={<ContactoCliente />} />
          <Route path="*" element={<Pagina404 />} />
          <Route path="/quejas" element={<QuejasScreen/>} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;