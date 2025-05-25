import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ClientesPage from './pages/ClientesPage';
import ProveedoresPage from './pages/ProveedoresPage';
import RecibosCobroPage from './pages/RecibosCobroPage';
import RecibosPagoPage from './pages/RecibosPagoPage';
import BalancePage from './pages/BalancePage';
import FacturasCompraPage from './pages/FacturasCompraPage';
import FacturasVentaPage from './pages/FacturasVentaPage';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './components/PrivateRoute';

export default function App() {
  return (
    <Router>
      <Navbar />
      <div className="pt-16 bg-gray-100 min-h-screen flex justify-center">
        <div className="w-full max-w-5xl mt-6 px-4">
          <main className="bg-white p-6 rounded shadow-md">
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/clientes" element={<PrivateRoute><ClientesPage /> </PrivateRoute>} />
              <Route path="/proveedores" element={<PrivateRoute><ProveedoresPage /></PrivateRoute>} />
              <Route path="/facturas/venta" element={<PrivateRoute><FacturasVentaPage /></PrivateRoute>} />
              <Route path="/facturas/compra" element={<PrivateRoute><FacturasCompraPage /></PrivateRoute>} />
              <Route path="/recibos/cobro" element={<PrivateRoute><RecibosCobroPage /></PrivateRoute>} />
              <Route path="/recibos/pago" element={<PrivateRoute><RecibosPagoPage /></PrivateRoute>} />
              <Route path="/balance" element={<PrivateRoute><BalancePage /></PrivateRoute>} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}