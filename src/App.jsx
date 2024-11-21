import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './Components/nav-bar/nav-var';
import Index from './Components/Index/Index';
import './App.css';
import { useState } from 'react';
import VentasList from './components/VentasList/VentasList';
import ClientCatalog from './components/CatalogoClientes/ClientCatalog';
import EmpresaList from './components/CatalogoEmpresas/EmpresaList';

function App() {
  const [menuOpen, setMenuOpen] = useState(true);

  return (
    <Router>
      <div className={`app-container ${menuOpen ? 'menu-open' : 'menu-closed'}`}>
        <NavBar setMenuOpen={setMenuOpen} menuOpen={menuOpen} />
        
        <div className="content">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/ventas" element={<VentasList/>} />
            <Route path="/clientes" element={<ClientCatalog/>} />
            <Route path="/empresas" element={<EmpresaList/>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
