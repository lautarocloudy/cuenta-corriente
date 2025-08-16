import React, { useEffect, useState } from 'react';
import FacturaForm from '../components/FacturaForm';
import Global from '../utils/global';

export default function FacturasVentaPage() {
  const [facturas, setFacturas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [editando, setEditando] = useState(null);
  const token = localStorage.getItem('token');

  // 🔄 Cargar clientes desde backend
  const fetchClientes = async () => {
    try {
      const res = await fetch(Global.url+'clientes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setClientes(data);
    } catch (err) {
      console.error('Error al cargar clientes:', err);
    }
  };

  // 🔄 Cargar facturas de venta
  const fetchFacturas = async () => {
    try {
      const res = await fetch(Global.url+'facturas?tipo=venta', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      console.log(data)
      setFacturas(data);
    } catch (err) {
      console.error('Error al cargar facturas:', err);
    }
  };

  useEffect(() => {
    fetchClientes();
    fetchFacturas();
  }, []);

  // ➕ Crear nueva factura
  const handleAdd = async (factura) => {
    try {
      const res = await fetch(Global.url+'facturas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...factura,
          tipo: 'venta',
          cliente_id: factura.entidadId,
          proveedor_id: null
        })
      });
      if (!res.ok) throw new Error((await res.json()).error);
      fetchFacturas();
    } catch (err) {
      alert('Error al guardar factura: ' + err.message);
    }
  };

  // ✏️ Actualizar factura existente
  const handleUpdate = async (factura) => {
    try {
      const res = await fetch(`${Global.url}facturas/${factura.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...factura,
          tipo: 'venta',
          cliente_id: factura.entidadId,
          proveedor_id: null
        })
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setEditando(null);
      fetchFacturas();
    } catch (err) {
      alert('Error al actualizar factura: ' + err.message);
    }
  };

  // 🗑️ Eliminar factura
  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar factura?')) return;
    try {
      const res = await fetch(`${Global.url}facturas/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error((await res.json()).error);
      fetchFacturas();
    } catch (err) {
      alert('Error al eliminar factura: ' + err.message);
    }
  };

  // 🔍 Editar factura (trae ítems reales y adapta al formulario)
  const handleEditar = async (id) => {
    try {
      const res = await fetch(`${Global.url}facturas/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const factura = await res.json();

      factura.entidadId = factura.proveedor_id || factura.cliente_id;

      factura.detalles = (factura.detalles || []).map((d) => ({
        descripcion: d.descripcion,
        cantidad: d.cantidad,
        precio: Number(d.precio_unitario)
      }));

      factura.retenciones = factura.retenciones || [];

      setEditando(factura);
    } catch (err) {
      alert('Error al cargar factura: ' + err.message);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Facturas de Venta</h1>

      {/* Formulario */}
      <div className="bg-white p-4 rounded shadow mb-6">
        {editando
          ? <FacturaForm key={editando.id} onSubmit={handleUpdate} facturaInicial={editando} onCancel={() => setEditando(null)} entidades={clientes} />
          : <FacturaForm key="nueva" onSubmit={handleAdd} facturaInicial={null} entidades={clientes} />
        }
      </div>

      {/* Tabla de facturas */}
      <div className="bg-white p-4 rounded shadow">
        <table className="w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Tipo</th>
              <th className="p-2">Tipo</th>
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
                <td className="p-2">{f.tipo_f}</td>
                <td className="p-2">{f.cliente_nombre}</td>
                <td className="p-2">{f.numero}</td>
                <td className="p-2">{new Date(f.fecha).toLocaleDateString()}</td>
                <td className="p-2">${Number(f.subtotal).toFixed(2)}</td>
                <td className="p-2 font-bold">${Number(f.total).toFixed(2)}</td>
                <td className="p-2 flex gap-2">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => handleEditar(f.id)}>Editar</button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => handleDelete(f.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
            {facturas.length === 0 && (
              <tr>
                <td colSpan="5" className="p-2 text-center text-gray-500">No hay facturas de venta.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
