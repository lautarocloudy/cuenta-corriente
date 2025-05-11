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

export default function App() {
  return (
    <Router>
      <Navbar />
      <div className="pt-16 bg-gray-100 min-h-screen flex justify-center">
  <div className="w-full max-w-5xl mt-6 px-4">
    <main className="bg-white p-6 rounded shadow-md">
        <Routes>
          <Route path="/clientes" element={<ClientesPage />} />
          <Route path="/proveedores" element={<ProveedoresPage />} />
          <Route path="/facturas/venta" element={<FacturasVentaPage />} />
           <Route path="/facturas/compra" element={<FacturasCompraPage />} />
           <Route path="/recibos/cobro" element={<RecibosCobroPage />} />
           <Route path="/recibos/pago" element={<RecibosPagoPage />} />
          <Route path="/balance" element={<BalancePage />} />
        </Routes>
        </main>
        </div>  
      </div>
    </Router>
  );
}