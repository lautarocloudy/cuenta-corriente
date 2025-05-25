import React, { useEffect, useState } from 'react';

export default function BalanceClientesPage() {
  const [balances, setBalances] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('http://localhost:4000/api/balance/clientes', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setBalances(data))
      .catch(err => console.error('Error al cargar balance de clientes', err));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Balance de Clientes</h1>
      <table className="w-full table-auto border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Cliente</th>
            <th className="p-2 border">Facturado</th>
            <th className="p-2 border">Cobrado</th>
            <th className="p-2 border">Saldo</th>
          </tr>
        </thead>
        <tbody>
          {balances.map((c) => (
            <tr key={c.id}>
              <td className="p-2 border">{c.nombre}</td>
              <td className="p-2 border">${c.total_facturado.toFixed(2)}</td>
              <td className="p-2 border">${c.total_cobrado.toFixed(2)}</td>
              <td className="p-2 border font-bold">${c.saldo.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
