import React from 'react';

export default function ProveedorList({ proveedores }) {
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
        {proveedores.map(proveedor => (
          <tr key={proveedor.id}>
            <td className="p-2 border">{proveedor.nombre}</td>
            <td className="p-2 border">{proveedor.domicilio}</td>
            <td className="p-2 border">{proveedor.cuit}</td>
            <td className="p-2 border">{proveedor.email}</td>
            <td className="p-2 border">{proveedor.telefono}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}