// pages/ProveedoresPage.jsx
import React, { useState } from 'react';
import ProveedorForm from '../components/ProveedorForm';

export default function ProveedoresPage() {
  const [proveedores, setProveedores] = useState([]);
  const [proveedorEditando, setProveedorEditando] = useState(null);

  const agregarProveedor = (nuevo) => {
    setProveedores([...proveedores, { ...nuevo, id: Date.now() }]);
  };

  const actualizarProveedor = (actualizado) => {
    setProveedores(proveedores.map(p => p.id === actualizado.id ? actualizado : p));
    setProveedorEditando(null);
  };

  const eliminarProveedor = (id) => {
    if (confirm("¿Eliminar este proveedor?")) {
      setProveedores(proveedores.filter(p => p.id !== id));
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Proveedores</h1>

      <div className="bg-white p-4 rounded shadow mb-6">
        {proveedorEditando ? (
          <ProveedorForm
            key={proveedorEditando.id}
            onSubmit={actualizarProveedor}
            proveedorInicial={proveedorEditando}
            onCancel={() => setProveedorEditando(null)}
          />
        ) : (
          <ProveedorForm
            key="nuevo"
            onSubmit={agregarProveedor}
            proveedorInicial={null}
          />
        )}
      </div>

      <div className="bg-white p-4 rounded shadow">
        <table className="w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Nombre</th>
              <th className="p-2 text-left">Domicilio</th>
              <th className="p-2 text-left">CUIT</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Teléfono</th>
              <th className="p-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proveedores.map(p => (
              <tr key={p.id} className="border-t">
                <td className="p-2">{p.nombre}</td>
                <td className="p-2">{p.domicilio}</td>
                <td className="p-2">{p.cuit}</td>
                <td className="p-2">{p.email}</td>
                <td className="p-2">{p.telefono}</td>
                <td className="p-2 flex gap-2">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => setProveedorEditando(p)}>Editar</button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => eliminarProveedor(p.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
            {proveedores.length === 0 && (
              <tr>
                <td colSpan="6" className="p-2 text-center text-gray-500">No hay proveedores cargados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
