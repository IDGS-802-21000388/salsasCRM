import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './Components/nav-bar/nav-var';
import Index from './Components/Index/Index';
import './App.css';
import { useState } from 'react';
import VentasList from './components/VentasList/VentasList';
import Pagina404 from './components/Pagina404/pagina404';

function App() {
  const [menuOpen, setMenuOpen] = useState(true);

  return (
    <Router>
      <div className={`app-container ${menuOpen ? 'menu-open' : 'menu-closed'}`}>
        <NavBar setMenuOpen={setMenuOpen} menuOpen={menuOpen} />
        
        <div className="content">
          <Routes>
            <Route path="/inicio" element={<Index />} />
            <Route path="/ventas" element={<VentasList/>} />

            <Route path="*" element={<Pagina404/>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
