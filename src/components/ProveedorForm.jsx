// components/ProveedorForm.jsx
import React, { useState, useEffect } from 'react';
import { validarCUIT } from '../utils/validators';

export default function ProveedorForm({ onSubmit, proveedorInicial, onCancel }) {
  const [form, setForm] = useState({
    nombre: '',
    domicilio: '',
    cuit: '',
    email: '',
    telefono: '',
  });

  useEffect(() => {
    if (proveedorInicial) {
      setForm(proveedorInicial);
    } else {
      setForm({ nombre: '', domicilio: '', cuit: '', email: '', telefono: '' });
    }
  }, [proveedorInicial]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.nombre) return alert('El nombre es obligatorio.');
    if (form.cuit && !validarCUIT(form.cuit)) {
      return alert('CUIT inválido. Formato: XX-XXXXXXXX-X');
    }

    if (typeof onSubmit === 'function') {
      if (proveedorInicial) {
        onSubmit({ ...form, id: proveedorInicial.id });
      } else {
        onSubmit({ ...form, id: Date.now() });
      }
    }

    setForm({ nombre: '', domicilio: '', cuit: '', email: '', telefono: '' });

    if (proveedorInicial && typeof onCancel === 'function') {
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
          {proveedorInicial ? 'Actualizar' : 'Agregar'}
        </button>
        {proveedorInicial && (
          <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
