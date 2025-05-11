// components/ReciboForm.jsx
import React, { useEffect, useState } from 'react';

export default function ReciboForm({
  onSubmit,
  reciboInicial,
  onCancel,
  entidades,    // array de clientes o proveedores
  tipoLabel     // 'Cobro' o 'Pago'
}) {
  // — Datos principales —
  const [facturaId, setFacturaId] = useState('');
  const [entidadId, setEntidadId] = useState(entidades[0]?.id || '');

  // — Formas de pago —
  const [efectivo, setEfectivo] = useState(0);
  const [transferencia, setTransferencia] = useState(0);
  const [otros, setOtros] = useState(0);
  const [observaciones, setObservaciones] = useState('');

  // — Detalle de cheques —
  const [cheques, setCheques] = useState([]);
  const [tipoCheque, setTipoCheque] = useState('Propio');
  const [fechaCobro, setFechaCobro] = useState('');
  const [banco, setBanco] = useState('');
  const [numeroCheque, setNumeroCheque] = useState('');
  const [montoCheque, setMontoCheque] = useState(0);

  // Cargue inicial si estamos editando
  useEffect(() => {
    if (reciboInicial) {
      setFacturaId(reciboInicial.facturaId);
      setEntidadId(reciboInicial.entidadId);
      setEfectivo(reciboInicial.efectivo);
      setTransferencia(reciboInicial.transferencia);
      setOtros(reciboInicial.otros);
      setObservaciones(reciboInicial.observaciones);
      setCheques(reciboInicial.cheques);
    }
  }, [reciboInicial]);

  // Cálculo de montos de cheques
  const totalChequesPropios = cheques
    .filter(c => c.tipo === 'Propio')
    .reduce((sum, c) => sum + c.monto, 0);

  const totalChequesTerceros = cheques
    .filter(c => c.tipo === 'Tercero')
    .reduce((sum, c) => sum + c.monto, 0);

  // Total general de pago
  const totalPago = efectivo
    + totalChequesPropios
    + totalChequesTerceros
    + transferencia
    + otros;

  // Agregar un cheque al detalle
  const agregarCheque = () => {
    if (!fechaCobro || !banco || !numeroCheque || montoCheque <= 0) {
      return alert('Completa todos los campos del cheque correctamente.');
    }
    setCheques([
      ...cheques,
      { tipo: tipoCheque, fechaCobro, banco, numero: numeroCheque, monto: montoCheque }
    ]);
    // Limpiar inputs de cheque
    setTipoCheque('Propio');
    setFechaCobro('');
    setBanco('');
    setNumeroCheque('');
    setMontoCheque(0);
  };

  // Envío del formulario
  const handleSubmit = e => {
    e.preventDefault();
    if (!facturaId) return alert('Ingresa el número de factura.');
    if (!entidadId) return alert(`Selecciona un ${tipoLabel.toLowerCase()}.`);
    if (totalPago <= 0) return alert('El total de pago debe ser mayor a cero.');

    const payload = {
      facturaId,
      entidadId,
      efectivo,
      chequePropio: totalChequesPropios,
      chequeTercero: totalChequesTerceros,
      transferencia,
      otros,
      observaciones,
      cheques,
      totalPago
    };

    onSubmit(reciboInicial
      ? { ...payload, id: reciboInicial.id }
      : { ...payload, id: Date.now() }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Datos del Recibo */}
      <div className="border p-4 rounded">
        <h2 className="font-semibold mb-2">Datos del Recibo</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm">Número de Factura</label>
            <input
              value={facturaId}
              onChange={e => setFacturaId(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label className="block text-sm">
              {tipoLabel === 'Cobro' ? 'Cliente' : 'Proveedor'}
            </label>
            <select
              value={entidadId}
              onChange={e => setEntidadId(+e.target.value)}
              className="border p-2 w-full"
            >
              {entidades.map(ent => (
                <option key={ent.id} value={ent.id}>
                  {ent.nombre} (ID: {ent.id})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Formas de Pago */}
      <div className="border p-4 rounded">
        <h2 className="font-semibold mb-2">Formas de Pago</h2>
        <div className="grid grid-cols-5 gap-4">
          <div>
            <label className="block text-sm">Efectivo</label>
            <input
              type="number" min="0" step="0.01"
              value={efectivo}
              onChange={e => setEfectivo(+e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label className="block text-sm">Cheque Propio</label>
            <input
              type="text"
              readOnly
              value={totalChequesPropios.toFixed(2)}
              className="border p-2 w-full bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm">Cheque Tercero</label>
            <input
              type="text"
              readOnly
              value={totalChequesTerceros.toFixed(2)}
              className="border p-2 w-full bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm">Transferencia</label>
            <input
              type="number" min="0" step="0.01"
              value={transferencia}
              onChange={e => setTransferencia(+e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label className="block text-sm">Otros</label>
            <input
              type="number" min="0" step="0.01"
              value={otros}
              onChange={e => setOtros(+e.target.value)}
              className="border p-2 w-full"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm">Observaciones</label>
          <textarea
            value={observaciones}
            onChange={e => setObservaciones(e.target.value)}
            className="border p-2 w-full"
            rows={2}
          />
        </div>
        <p className="text-right font-medium mt-2">Total Pago: ${totalPago.toFixed(2)}</p>
      </div>

      {/* Detalle de Cheques */}
      <div className="border p-4 rounded">
        <h2 className="font-semibold mb-2">Detalle de Cheques</h2>

        {/* Tabla de cheques */}
        <table className="w-full table-auto mb-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Tipo</th>
              <th className="p-2">Fecha de Cobro</th>
              <th className="p-2">Banco</th>
              <th className="p-2">Número</th>
              <th className="p-2">Monto</th>
            </tr>
          </thead>
          <tbody>
            {cheques.map((c, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{c.tipo}</td>
                <td className="p-2">{c.fechaCobro}</td>
                <td className="p-2">{c.banco}</td>
                <td className="p-2">{c.numero}</td>
                <td className="p-2">${c.monto.toFixed(2)}</td>
              </tr>
            ))}
            {cheques.length === 0 && (
              <tr>
                <td colSpan="5" className="p-2 text-center text-gray-500">
                  No hay cheques cargados.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Formulario para agregar un cheque */}
        <div className="grid grid-cols-6 gap-2 items-end">
          <div>
            <label className="block text-sm">Tipo</label>
            <select
              value={tipoCheque}
              onChange={e => setTipoCheque(e.target.value)}
              className="border p-2 w-full"
            >
              <option>Propio</option>
              <option>Tercero</option>
            </select>
          </div>
          <div>
            <label className="block text-sm">Fecha Cobro</label>
            <input
              type="date"
              value={fechaCobro}
              onChange={e => setFechaCobro(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label className="block text-sm">Banco</label>
            <input
              value={banco}
              onChange={e => setBanco(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label className="block text-sm">Número Cheque</label>
            <input
              value={numeroCheque}
              onChange={e => setNumeroCheque(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label className="block text-sm">Monto</label>
            <input
              type="number" min="0" step="0.01"
              value={montoCheque}
              onChange={e => setMontoCheque(+e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <div>
            <button
              type="button"
              onClick={agregarCheque}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Agregar Cheque
            </button>
          </div>
        </div>
      </div>

      {/* Botones finales */}
      <div className="flex justify-end gap-2">
        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded"
        >
          {reciboInicial ? 'Actualizar' : 'Guardar'}
        </button>
        {reciboInicial && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
