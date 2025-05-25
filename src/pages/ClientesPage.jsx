// pages/ClientesPage.jsx
import React, { useEffect, useState } from 'react';
import ClienteForm from '../components/ClienteForm';

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [editando, setEditando] = useState(null);

  const token = localStorage.getItem('token'); // o localStorage si usás ese

  // Traer clientes desde la API
  const fetchClientes = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/clientes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setClientes(data);
    } catch (err) {
      console.error('Error al cargar clientes:', err);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  // Crear o actualizar
  const handleGuardar = async (cliente) => {
    try {
      const metodo = editando ? 'PUT' : 'POST';
      const url = editando
        ? `http://localhost:4000/api/clientes/${cliente.id}`
        : 'http://localhost:4000/api/clientes';

      const res = await fetch(url, {
        method: metodo,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(cliente)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al guardar cliente');

      fetchClientes();
      setEditando(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar cliente?')) return;
    try {
      const res = await fetch(`http://localhost:4000/api/clientes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al eliminar cliente');

      fetchClientes();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Clientes</h1>

      <ClienteForm
        onSubmit={handleGuardar}
        clienteInicial={editando}
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
          {clientes.map((cli) => (
            <tr key={cli.id}>
              <td className="p-2 border">{cli.nombre}</td>
              <td className="p-2 border">{cli.domicilio}</td>
              <td className="p-2 border">{cli.cuit}</td>
              <td className="p-2 border">{cli.email}</td>
              <td className="p-2 border">{cli.telefono}</td>
              <td className="p-2 border flex gap-2">
                <button onClick={() => setEditando(cli)} className="text-blue-600">Editar</button>
                <button onClick={() => handleEliminar(cli.id)} className="text-red-600">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
