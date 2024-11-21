import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import NavBar from './components/nav-bar/nav-var';
import Index from './Components/Index/Index';
import './App.css';
import { useState } from 'react';
import VentasList from './components/VentasList/VentasList';
import Pagina404 from './components/Pagina404/pagina404';
import Login from './pages/Login';

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
          <Route path="*" element={<Pagina404 />} />
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
