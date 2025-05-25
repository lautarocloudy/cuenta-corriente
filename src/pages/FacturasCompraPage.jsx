import React, { useEffect, useState } from 'react';
import FacturaForm from '../components/FacturaForm';

export default function FacturasCompraPage() {
  const [facturas, setFacturas] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [editando, setEditando] = useState(null);
  const token = localStorage.getItem('token');

  // Traer proveedores
  const fetchProveedores = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/proveedores', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setProveedores(data);
    } catch (err) {
      console.error('Error al cargar proveedores:', err);
    }
  };

  // Traer facturas tipo 'compra'
  const fetchFacturas = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/facturas?tipo=compra', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setFacturas(data);
    } catch (err) {
      console.error('Error al cargar facturas:', err);
    }
  };

  useEffect(() => {
    fetchProveedores();
    fetchFacturas();
  }, []);

  // Guardar nueva factura
  const handleAdd = async (factura) => {
    try {
      const res = await fetch('http://localhost:4000/api/facturas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...factura,
          tipo: 'compra',
          proveedor_id: factura.entidadId,
          cliente_id: null
        })
      });
      if (!res.ok) throw new Error((await res.json()).error);
      fetchFacturas();
    } catch (err) {
      alert('Error al guardar factura: ' + err.message);
    }
  };

  // Actualizar factura
  const handleUpdate = async (factura) => {
    try {
      const res = await fetch(`http://localhost:4000/api/facturas/${factura.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...factura,
          tipo: 'compra',
          proveedor_id: factura.entidadId,
          cliente_id: null
        })
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setEditando(null);
      fetchFacturas();
    } catch (err) {
      alert('Error al actualizar factura: ' + err.message);
    }
  };

  // Eliminar factura
  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar factura?')) return;
    try {
      const res = await fetch(`http://localhost:4000/api/facturas/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error((await res.json()).error);
      fetchFacturas();
    } catch (err) {
      alert('Error al eliminar factura: ' + err.message);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Facturas de Compra</h1>
      <div className="bg-white p-4 rounded shadow mb-6">
        {editando
          ? <FacturaForm key={editando.id} onSubmit={handleUpdate} facturaInicial={editando} onCancel={() => setEditando(null)} entidades={proveedores} />
          : <FacturaForm key="nueva" onSubmit={handleAdd} facturaInicial={null} entidades={proveedores} />
        }
      </div>
      <div className="bg-white p-4 rounded shadow">
        <table className="w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Número</th>
              <th className="p-2">Fecha</th>
              <th className="p-2">Subtotal</th>
              <th className="p-2">Total</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {facturas.map(f => (
              <tr key={f.id} className="border-t">
                <td className="p-2">{f.numero}</td>
                <td className="p-2">{new Date(f.fecha).toLocaleDateString()}</td>
                <td className="p-2">${Number(f.subtotal).toFixed(2)}</td>
                <td className="p-2 font-bold">${Number(f.total).toFixed(2)}</td>
                <td className="p-2 flex gap-2">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => setEditando(f)}>Editar</button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => handleDelete(f.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
            {facturas.length === 0 && (
              <tr>
                <td colSpan="5" className="p-2 text-center text-gray-500">No hay facturas de compra.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
