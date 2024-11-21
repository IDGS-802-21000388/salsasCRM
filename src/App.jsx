import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './Components/nav-bar/nav-var';
import Index from './Components/Index/Index';
import './App.css';
import { useState } from 'react';
import VentasList from './components/VentasList/VentasList';
import Login from './pages/Login';
//import Home from './pages/Home';
import Promociones from './pages/Promociones';

function App() {
  const [menuOpen, setMenuOpen] = useState(true);

  return (
    <Router>
      <div className={`app-container ${menuOpen ? 'menu-open' : 'menu-closed'}`}>
        <NavBar setMenuOpen={setMenuOpen} menuOpen={menuOpen} />
        
        <div className="content">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/ventas" element={<VentasList/>} />
            <Route path="/home" element={<Index />} />
            <Route path="/promociones" element={<Promociones />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
