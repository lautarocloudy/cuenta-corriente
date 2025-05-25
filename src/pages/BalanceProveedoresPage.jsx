import React, { useEffect, useState } from 'react';

export default function BalanceProveedoresPage() {
  const [balances, setBalances] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('http://localhost:4000/api/balance/proveedores', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setBalances(data))
      .catch(err => console.error('Error al cargar balance de proveedores', err));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Balance de Proveedores</h1>
      <table className="w-full table-auto border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Proveedor</th>
            <th className="p-2 border">Facturado</th>
            <th className="p-2 border">Pagado</th>
            <th className="p-2 border">Saldo</th>
          </tr>
        </thead>
        <tbody>
          {balances.map((p) => (
            <tr key={p.id}>
              <td className="p-2 border">{p.nombre}</td>
              <td className="p-2 border">${p.total_facturado.toFixed(2)}</td>
              <td className="p-2 border">${p.total_pagado.toFixed(2)}</td>
              <td className="p-2 border font-bold">${p.saldo.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
