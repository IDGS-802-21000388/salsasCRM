import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './Components/nav-bar/nav-var';
import Index from './Components/Index/Index';
import './App.css';
import { useState } from 'react';
import VentasList from './components/VentasList/VentasList';
import Dashboard from './pages/Dashboard';
import ContactoCliente from './pages/ContactoCliente';

function App() {
  const [menuOpen, setMenuOpen] = useState(true);

  return (
    <Router>
      <div className="app-container">
        <NavBar setMenuOpen={setMenuOpen} menuOpen={menuOpen} />
        
        <div className={`content ${menuOpen ? 'menu-open' : 'menu-closed'}`}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/ventas" element={<VentasList />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/contactoCliente" element={<ContactoCliente />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;