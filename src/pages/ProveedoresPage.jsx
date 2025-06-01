import React, { useEffect, useState } from 'react';
import ProveedorForm from '../components/ProveedorForm'; // o usá el mismo de ClienteForm con props si es genérico
import Global from '../utils/global';

export default function ProveedoresPage() {
  const [proveedores, setProveedores] = useState([]);
  const [editando, setEditando] = useState(null);
  const token = localStorage.getItem('token');

  const fetchProveedores = async () => {
    try {
      const res = await fetch(Global.url+'proveedores', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setProveedores(data);
    } catch (err) {
      console.error('Error al cargar proveedores:', err);
    }
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  const handleGuardar = async (proveedor) => {
    try {
      const metodo = editando ? 'PUT' : 'POST';
      const url = editando
        ? `${Global.url}proveedores/${proveedor.id}`
        : Global.url+'proveedores';

      const res = await fetch(url, {
        method: metodo,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(proveedor)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al guardar proveedor');

      fetchProveedores();
      setEditando(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar proveedor?')) return;
    try {
      const res = await fetch(`${Global.url}proveedores/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al eliminar proveedor');

      fetchProveedores();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Proveedores</h1>

      <ProveedorForm
        onSubmit={handleGuardar}
        proveedorInicial={editando}
        onCancel={() => setEditando(null)}
      />

      <table className="w-full border mt-4 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Nombre</th>
            <th className="p-2">Domicilio</th>
            <th className="p-2">CUIT</th>
            <th className="p-2">Email</th>
            <th className="p-2">Teléfono</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {proveedores.map((p) => (
            <tr key={p.id}>
              <td className="p-2 border">{p.nombre}</td>
              <td className="p-2 border">{p.domicilio}</td>
              <td className="p-2 border">{p.cuit}</td>
              <td className="p-2 border">{p.email}</td>
              <td className="p-2 border">{p.telefono}</td>
              <td className="p-2 border flex gap-2">
                <button onClick={() => setEditando(p)} className="text-blue-600">Editar</button>
                <button onClick={() => handleEliminar(p.id)} className="text-red-600">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
