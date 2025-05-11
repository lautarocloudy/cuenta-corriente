// pages/FacturasCompraPage.jsx
import React, { useState } from 'react';
import FacturaForm from '../components/FacturaForm';

const proveedores = [
    { id: 1, nombre: 'Proveedor X' },
    { id: 2, nombre: 'Proveedor Y' },
  ];

export default function FacturasCompraPage() {
  const [facturas, setFacturas] = useState([]);
  const [editando, setEditando] = useState(null);

  const handleAdd = f => setFacturas([...facturas, { ...f, id: Date.now(), tipo: 'compra' }]);
  const handleUpdate = f => {
    setFacturas(facturas.map(x => x.id === f.id ? f : x));
    setEditando(null);
  };
  const handleDelete = id => window.confirm('Eliminar?') && setFacturas(facturas.filter(x => x.id !== id));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Facturas de Compra</h1>
      <div className="bg-white p-4 rounded shadow mb-6">
        {editando
          ? <FacturaForm key={editando.id} onSubmit={handleUpdate} facturaInicial={editando} onCancel={() => setEditando(null)} entidades={proveedores}/>
          : <FacturaForm key="c" onSubmit={handleAdd} facturaInicial={null} entidades={proveedores} />
        }
      </div>
      <div className="bg-white p-4 rounded shadow">
        <table className="w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Número</th><th className="p-2">Fecha</th><th className="p-2">Subtotal</th><th className="p-2">Total</th><th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {facturas.filter(f => f.tipo==='compra').map(f => (
              <tr key={f.id} className="border-t">
                <td className="p-2">{f.numero}</td>
                <td className="p-2">{f.fecha}</td>
                <td className="p-2">${f.subtotalNeto.toFixed(2)}</td>
                <td className="p-2 font-bold">${f.total.toFixed(2)}</td>
                <td className="p-2 flex gap-2">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => setEditando(f)}>Editar</button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => handleDelete(f.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
            {facturas.filter(f => f.tipo==='compra').length===0 && (
              <tr><td colSpan="5" className="p-2 text-center text-gray-500">No hay facturas de compra.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
