import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const [menuAbierto, setMenuAbierto] = useState(null); // 'clientes' | 'proveedores' | null

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/');
  };

  const toggleMenu = (tipo) => {
    setMenuAbierto(menuAbierto === tipo ? null : tipo);
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-blue-700 text-white shadow-md z-50">
      <div className="max-w-screen-xl mx-auto px-4 h-full flex items-center justify-between">
        <h1 className="text-xl font-semibold">Cuenta Corriente</h1>
        <ul className="flex gap-6 text-sm font-medium relative">

          {/* Menú Clientes */}
          <li className="relative">
            <button onClick={() => toggleMenu('clientes')} className="hover:underline">Clientes</button>
            {menuAbierto === 'clientes' && (
              <ul className="absolute bg-white text-black mt-2 rounded shadow">
                <li><Link to="/clientes" className="block px-4 py-2 hover:bg-gray-200">Clientes</Link></li>
                <li><Link to="/balance/clientes" className="block px-4 py-2 hover:bg-gray-200">Balance</Link></li>
              </ul>
            )}
          </li>

          {/* Menú Proveedores */}
          <li className="relative">
            <button onClick={() => toggleMenu('proveedores')} className="hover:underline">Proveedores</button>
            {menuAbierto === 'proveedores' && (
              <ul className="absolute bg-white text-black mt-2 rounded shadow">
                <li><Link to="/proveedores" className="block px-4 py-2 hover:bg-gray-200">Proveedores</Link></li>
                <li><Link to="/balance/proveedores" className="block px-4 py-2 hover:bg-gray-200">Balance</Link></li>
              </ul>
            )}
          </li>

          <li><Link to="/facturas/venta" className="hover:underline">Facturas Venta</Link></li>
          <li><Link to="/facturas/compra" className="hover:underline">Facturas Compra</Link></li>
          <li><Link to="/recibos/cobro" className="hover:underline">Cobros</Link></li>
          <li><Link to="/recibos/pago" className="hover:underline">Pagos</Link></li>

          {usuario && (
            <>
              <span className="text-sm">{usuario.nombre}</span>
              <button
                onClick={handleLogout}
                className="ml-2 px-3 py-1 bg-red-600 rounded hover:bg-red-700"
              >
                Cerrar sesión
              </button>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
