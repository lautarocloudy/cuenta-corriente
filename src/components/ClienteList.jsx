import React from 'react';

export default function ClienteList({ clientes }) {
  return (
    <table className="w-full border border-gray-300">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2">Nombre</th>
          <th className="p-2">Domicilio</th>
          <th className="p-2">CUIT</th>
          <th className="p-2">Email</th>
          <th className="p-2">Teléfono</th>
        </tr>
      </thead>
      <tbody>
        {clientes.map(cliente => (
          <tr key={cliente.id}>
            <td className="p-2 border">{cliente.nombre}</td>
            <td className="p-2 border">{cliente.domicilio}</td>
            <td className="p-2 border">{cliente.cuit}</td>
            <td className="p-2 border">{cliente.email}</td>
            <td className="p-2 border">{cliente.telefono}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}