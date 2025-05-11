// components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-blue-700 text-white shadow-md z-50">
      <div className="max-w-screen-xl mx-auto px-4 h-full flex items-center justify-between">
        <h1 className="text-xl font-semibold">Cuenta Corriente</h1>
        <ul className="flex gap-6 text-sm font-medium">
          <li><Link to="/clientes" className="hover:underline">Clientes</Link></li>
          <li><Link to="/proveedores" className="hover:underline">Proveedores</Link></li>
          <li><Link to="/facturas/venta" className="hover:underline">Facturas Venta</Link></li>
          <li><Link to="/facturas/compra" className="hover:underline">Facturas Compra</Link></li>
          <li><Link to="/recibos/cobro" className="hover:underline">Cobros</Link></li>
          <li><Link to="/recibos/pago" className="hover:underline">Pagos</Link></li>
          <li><Link to="/balance" className="hover:underline">Balance</Link></li>
        </ul>
      </div>
    </nav>
  );
}
