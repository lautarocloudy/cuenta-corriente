// components/ClienteForm.jsx
import React, { useEffect, useState } from 'react';
import { validarCUIT } from '../utils/validators';

export default function ClienteForm({ onSubmit, clienteInicial, onCancel }) {
  const [form, setForm] = useState({
    nombre: '',
    domicilio: '',
    cuit: '',
    email: '',
    telefono: '',
  });

  useEffect(() => {
    if (clienteInicial) {
      setForm(clienteInicial);
    } else {
      setForm({ nombre: '', domicilio: '', cuit: '', email: '', telefono: '' });
    }
  }, [clienteInicial]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.nombre) return alert("El nombre es obligatorio.");
    if (form.cuit && !validarCUIT(form.cuit)) {
      return alert("CUIT inválido. Formato: XX-XXXXXXXX-X");
    }

    if (typeof onSubmit === 'function') {
      if (clienteInicial) {
        onSubmit({ ...form, id: clienteInicial.id });
      } else {
        onSubmit({ ...form, id: Date.now() });
      }
    }

    setForm({ nombre: '', domicilio: '', cuit: '', email: '', telefono: '' });

    if (clienteInicial && typeof onCancel === 'function') {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" className="border p-2 w-full" />
      <input name="domicilio" value={form.domicilio} onChange={handleChange} placeholder="Domicilio" className="border p-2 w-full" />
      <input name="cuit" value={form.cuit} onChange={handleChange} placeholder="CUIT (XX-XXXXXXXX-X)" className="border p-2 w-full" />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="border p-2 w-full" />
      <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="Teléfono" className="border p-2 w-full" />
      <div className="flex gap-2">
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          {clienteInicial ? 'Actualizar' : 'Agregar'}
        </button>
        {clienteInicial && (
          <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
