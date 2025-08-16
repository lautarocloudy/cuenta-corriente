import React, { useEffect, useState } from 'react';
import ReciboForm from '../components/ReciboForm';
import Global from '../utils/global';

export default function RecibosCobroPage() {
  const [clientes, setClientes] = useState([]);
  const [recibos, setRecibos] = useState([]);
  const [editando, setEditando] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      const resClientes = await fetch(Global.url+'clientes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!resClientes.ok) throw new Error('Error al cargar clientes');
      const clientesData = await resClientes.json();
      setClientes(clientesData);

      await fetchRecibos(); // Traigo los recibos
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  fetchData();
}, [token]);

  const handleAdd = async (recibo) => {
  try {
    const res = await fetch(Global.url + 'recibos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        ...recibo,
        tipo: 'cobro',
        fecha: recibo.fecha || new Date().toISOString().split('T')[0],
      }),
    });
    const data = await res.json();
    if (res.ok) {
      // Vuelvo a traer todos los recibos
      fetchRecibos();
    } else {
      alert(data.error || 'Error al guardar el recibo');
    }
  } catch (err) {
    console.error(err);
    alert('Error al guardar');
  }
};

// Función que trae los recibos
const fetchRecibos = async () => {
  try {
    const res = await fetch(Global.url+'recibos?tipo=cobro', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Error al cargar recibos');
    const recibosData = await res.json();
    setRecibos(recibosData);
  } catch (err) {
    console.error(err);
    setError(err.message);
  }
};


  const handleUpdate = async (recibo) => {
    try {
      const res = await fetch(`${Global.url}recibos/${recibo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...recibo,
          tipo: 'cobro',
          cliente_id: recibo.entidadId,
          fecha: recibo.fecha || new Date().toISOString().split('T')[0],
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setRecibos(prev => prev.map(r => r.id === recibo.id ? recibo : r));
        setEditando(null);
      } else {
        alert(data.error || 'Error al actualizar el recibo');
      }
    } catch (err) {
      console.error(err);
      alert('Error al actualizar');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este recibo de cobro?')) return;
    try {
      const res = await fetch(`${Global.url}recibos/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setRecibos(prev => prev.filter(r => r.id !== id));
      } else {
        alert(data.error || 'Error al eliminar');
      }
    } catch (err) {
      console.error(err);
      alert('Error al eliminar');
    }
  };

  if (loading) {
    return <div className="p-4">Cargando datos...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Recibos de Cobro</h1>

      <div className="bg-white p-4 rounded shadow mb-6">
        {editando ? (
          <ReciboForm
            key={editando.id}
            onSubmit={handleUpdate}
            reciboInicial={editando}
            onCancel={() => setEditando(null)}
            entidades={clientes}
            tipoLabel="cobro"
          />
        ) : (
          <ReciboForm
            key="nuevo"
            onSubmit={handleAdd}
            reciboInicial={null}
            entidades={clientes}
            tipoLabel="cobro"
          />
        )}
      </div>

      <div className="bg-white p-4 rounded shadow overflow-x-auto">
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
            {recibos.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-2 text-center text-gray-500">
                  No hay recibos de cobro.
                </td>
              </tr>
            ) : (
              recibos.map(r => (
                <tr key={r.id} className="border-t">
                  <td className="p-2">{r.fecha}</td>
                  <td className="p-2">{r.cliente_nombre || clientes.find(c => c.id === r.cliente_id)?.nombre || 'N/A'}</td>
                  <td className="p-2">${parseFloat(r.total).toFixed(2)}</td>
                  <td className="p-2">{r.observaciones}</td>
                  <td className="p-2 flex gap-2">
                    {/* <button
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                      onClick={() => setEditando(r)}
                    >
                      Editar
                    </button> */}
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => handleDelete(r.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
