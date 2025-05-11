// pages/ClientesPage.jsx
import React, { useState } from 'react';
import ClienteForm from '../components/ClienteForm';

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [clienteEditando, setClienteEditando] = useState(null);

  const agregarCliente = (nuevo) => {
    setClientes([...clientes, { ...nuevo, id: Date.now() }]);
  };

  const actualizarCliente = (clienteActualizado) => {
    setClientes(clientes.map(c => c.id === clienteActualizado.id ? clienteActualizado : c));
    setClienteEditando(null);
  };

  const eliminarCliente = (id) => {
    if (confirm("¿Estás seguro que querés eliminar este cliente?")) {
      setClientes(clientes.filter(c => c.id !== id));
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Clientes</h1>

      <div className="bg-white p-4 rounded shadow mb-6">
  {clienteEditando ? (
    <ClienteForm
      key={clienteEditando.id}
      onSubmit={actualizarCliente}
      clienteInicial={clienteEditando}
      onCancel={() => setClienteEditando(null)}
    />
  ) : (
    <ClienteForm
      key="nuevo"
      onSubmit={agregarCliente}
      clienteInicial={null}
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
            {clientes.map(cliente => (
              <tr key={cliente.id} className="border-t">
                <td className="p-2">{cliente.nombre}</td>
                <td className="p-2">{cliente.domicilio}</td>
                <td className="p-2">{cliente.cuit}</td>
                <td className="p-2">{cliente.email}</td>
                <td className="p-2">{cliente.telefono}</td>
                <td className="p-2 flex gap-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                    onClick={() => setClienteEditando(cliente)}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => eliminarCliente(cliente.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {clientes.length === 0 && (
              <tr>
                <td className="p-2 text-center text-gray-500" colSpan="6">No hay clientes cargados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
