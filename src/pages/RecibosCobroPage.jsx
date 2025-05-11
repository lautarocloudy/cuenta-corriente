// pages/RecibosCobroPage.jsx
import React, { useState } from 'react';
import ReciboForm from '../components/ReciboForm';

// Simulación de clientes; reemplazá por tu estado o llamada al backend
const clientes = [
  { id: 1, nombre: 'Cliente A' },
  { id: 2, nombre: 'Cliente B' },
];

export default function RecibosCobroPage() {
  const [recibos, setRecibos] = useState([]);
  const [editando, setEditando] = useState(null);

  const handleAdd = r => setRecibos([...recibos, { ...r, id: Date.now() }]);
  const handleUpdate = r => {
    setRecibos(recibos.map(x => x.id === r.id ? r : x));
    setEditando(null);
  };
  const handleDelete = id =>
    window.confirm('Eliminar este recibo de cobro?') &&
    setRecibos(recibos.filter(x => x.id !== id));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Recibos de Cobro</h1>

      <div className="bg-white p-4 rounded shadow mb-6">
        {editando ? (
          <ReciboForm
            key={editando.id}
            onSubmit={handleUpdate}
            reciboInicial={editando}
            onCancel={() => setEditando(null)}
            entidades={clientes}
            tipoLabel="Cobro"
          />
        ) : (
          <ReciboForm
            key="nuevo"
            onSubmit={handleAdd}
            reciboInicial={null}
            entidades={clientes}
            tipoLabel="Cobro"
          />
        )}
      </div>

      <div className="bg-white p-4 rounded shadow">
        <table className="w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Fecha</th>
              <th className="p-2">Cliente</th>
              <th className="p-2">Monto</th>
              <th className="p-2">Observaciones</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {recibos.map(r => (
              <tr key={r.id} className="border-t">
                <td className="p-2">{r.fecha}</td>
                <td className="p-2">{clientes.find(c => c.id === r.entidadId)?.nombre}</td>
                <td className="p-2">${r.totalPago.toFixed(2)}</td>
                <td className="p-2">{r.observaciones}</td>
                <td className="p-2 flex gap-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                    onClick={() => setEditando(r)}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => handleDelete(r.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {recibos.length === 0 && (
              <tr>
                <td colSpan="5" className="p-2 text-center text-gray-500">
                  No hay recibos de cobro.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
