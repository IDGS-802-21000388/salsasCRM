import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import NavBar from './components/nav-bar/nav-var';
import Index from './Components/Index/Index';
import './App.css';
import { useState } from 'react';
import VentasList from './components/VentasList/VentasList';
import ClientCatalog from './components/CatalogoClientes/ClientCatalog';
import EmpresaList from './components/CatalogoEmpresas/EmpresaList';
import Login from './pages/Login';
import Promociones from './pages/Promociones';
import Pagina404 from './components/Pagina404/pagina404';
import Dashboard from './pages/Dashboard';
import ContactoCliente from './pages/ContactoCliente';
import QuejasScreen from './components/Quejas/QuejasScreen';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'; // Importa el componente de rutas protegidas

function AppContent() {
  const [menuOpen, setMenuOpen] = useState(true);
  const location = useLocation();

  const isLoginRoute = location.pathname === '/';

  return (
    <div className={`app-container ${isLoginRoute ? '' : menuOpen ? 'menu-open' : 'menu-closed'}`}>
      {!isLoginRoute && <NavBar setMenuOpen={setMenuOpen} menuOpen={menuOpen} />}
      
      <div className={`content ${isLoginRoute ? '' : 'content-style'}`}>
        <Routes>
          {/* Ruta pública */}
          <Route path="/" element={<Login />} />

          {/* Rutas protegidas */}
          <Route 
            path="/inicio" 
            element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ventas" 
            element={
              <ProtectedRoute>
                <VentasList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/clientes" 
            element={
              <ProtectedRoute>
                <ClientCatalog />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/empresas" 
            element={
              <ProtectedRoute>
                <EmpresaList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/promociones" 
            element={
              <ProtectedRoute>
                <Promociones />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/contactoCliente" 
            element={
              <ProtectedRoute>
                <ContactoCliente />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/quejas" 
            element={
              <ProtectedRoute>
                <QuejasScreen />
              </ProtectedRoute>
            } 
          />

          {/* Ruta de error 404 */}
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
