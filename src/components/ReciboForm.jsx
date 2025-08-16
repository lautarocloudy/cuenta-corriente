import React, { useEffect, useState } from 'react';

export default function ReciboForm({ tipoLabel, entidades, onSubmit, onCancel, reciboInicial }) {
  const [numero, setNumero] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [entidadId, setEntidadId] = useState('');
  const [efectivo, setEfectivo] = useState(0);
  const [transferencia, setTransferencia] = useState(0);
  const [otros, setOtros] = useState(0);
  const [observaciones, setObservaciones] = useState('');
  const [cheque, setCheque] = useState([]);

  useEffect(() => {
    if (reciboInicial) {
      setNumero(reciboInicial.numero || '');
      setFecha(reciboInicial.fecha ? reciboInicial.fecha.slice(0,10) : new Date().toISOString().slice(0,10));
      setEntidadId(tipoLabel === 'pago' ? reciboInicial.proveedor_id || '' : reciboInicial.cliente_id || '');
      setEfectivo(reciboInicial.efectivo || 0);
      setTransferencia(reciboInicial.transferencia || 0);
      setOtros(reciboInicial.otros || 0);
      setObservaciones(reciboInicial.observaciones || '');
      setCheque(reciboInicial.cheques || []);
    } else {
      setNumero('');
      setFecha(new Date().toISOString().slice(0,10));
      setEntidadId('');
      setEfectivo(0);
      setTransferencia(0);
      setOtros(0);
      setObservaciones('');
      setCheque([]);
    }
  }, [reciboInicial, tipoLabel]);

const totalPago = 
  Number(efectivo) + 
  Number(transferencia) + 
  Number(otros) + 
  cheque.reduce((acc, c) => acc + (parseFloat(c.monto) || 0), 0);

  const agregarCheque = () => {
    setCheque([
      ...cheque,
      { tipo: 'Cheque', fechaCobro: fecha, banco: '', numero: '', monto: 0 },
    ]);
  };

  const actualizarCheque = (index, campo, valor) => {
    const nuevosCheques = [...cheque];
nuevosCheques[index][campo] = campo === 'monto' ? parseFloat(valor) || 0 : valor;
    setCheque(nuevosCheques);
  };

  const eliminarCheque = (index) => {
    setCheque(cheque.filter((_, i) => i !== index));
  };

const handleSubmit = (e) => {
  e.preventDefault();

  const entidadIdNum = Number(entidadId);

  if (!numero) return alert('Ingresá el número del recibo.');
  if (!entidadIdNum) return alert(`Seleccioná un ${tipoLabel.toLowerCase()}.`);
  if (!fecha) return alert('Seleccioná una fecha.');
  if (totalPago <= 0) return alert('El total debe ser mayor a cero.');

  const payload = {
    numero,
    fecha,
    tipo: tipoLabel.toLowerCase(),
    factura_id: null,
    efectivo: Number(efectivo),
    transferencia: Number(transferencia),
    otros: Number(otros),
    observaciones,
    cheque,
  };

  if (tipoLabel === 'cobro') payload.cliente_id = entidadIdNum;
  if (tipoLabel === 'pago') payload.proveedor_id = entidadIdNum;

  if (reciboInicial && reciboInicial.id) {
    onSubmit({ ...payload, id: reciboInicial.id });
  } else {
    onSubmit(payload);
  }

  // Limpiar todos los campos después de guardar
  setNumero('');
  setFecha(new Date().toISOString().slice(0,10));
  setEntidadId('');
  setEfectivo(0);
  setTransferencia(0);
  setOtros(0);
  setObservaciones('');
  setCheque([]);
};



  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded shadow">
      <div>
        <label className="block font-semibold">Número</label>
        <input
          type="text"
          value={numero}
          onChange={e => setNumero(e.target.value)}
          className="border p-2 w-full"
          required
        />
      </div>

      <div>
        <label className="block font-semibold">Fecha</label>
        <input
          type="date"
          value={fecha}
          onChange={e => setFecha(e.target.value)}
          className="border p-2 w-full"
          required
        />
      </div>

      <div>
        <label className="block font-semibold">{tipoLabel}</label>
       <select
  value={entidadId}
  onChange={e => setEntidadId(e.target.value)}
  className="border p-2 w-full"
  required
>
  <option value="">-- Seleccione --</option>
  {entidades.map(e => (
    <option key={e.id} value={e.id}>
      {e.nombre}
    </option>
  ))}
</select>

      </div>

      <div>
        <label className="block font-semibold">Efectivo</label>
        <input
          type="number"
          value={efectivo}
          onChange={e => setEfectivo(Number(e.target.value))}
          min="0"
          step="0.01"
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label className="block font-semibold">Transferencia</label>
        <input
          type="number"
          value={transferencia}
          onChange={e => setTransferencia(Number(e.target.value))}
          min="0"
          step="0.01"
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label className="block font-semibold">Otros</label>
        <input
          type="number"
          value={otros}
          onChange={e => setOtros(Number(e.target.value))}
          min="0"
          step="0.01"
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label className="block font-semibold">Cheques</label>
        {cheque.length === 0 && (
          <p className="mb-2 text-gray-600">No hay cheques agregados.</p>
        )}
        {cheque.map((cheque, i) => (
          <div key={i} className="border p-2 mb-2 rounded">
            <div className="flex gap-2 mb-1">
              <label className="flex flex-col flex-grow">
                Tipo
                <select
  name="tipo"
  value={cheque.tipo}
onChange={(e) => actualizarCheque(i, 'tipo', e.target.value)}
>
  <option value="">Seleccionar tipo</option>
  <option value="Propio">Propio</option>
  <option value="Tercero">Tercero</option>
</select>

              </label>
              <label className="flex flex-col flex-grow">
                Fecha Cobro
                <input
                  type="date"
                  value={cheque.fechaCobro}
                  onChange={e => actualizarCheque(i, 'fechaCobro', e.target.value)}
                  className="border p-1"
                />
              </label>
            </div>
            <div className="flex gap-2 mb-1">
              <label className="flex flex-col flex-grow">
                Banco
                <input
                  type="text"
                  value={cheque.banco}
                  onChange={e => actualizarCheque(i, 'banco', e.target.value)}
                  className="border p-1"
                />
              </label>
              <label className="flex flex-col flex-grow">
                Número
                <input
                  type="text"
                  value={cheque.numero}
                  onChange={e => actualizarCheque(i, 'numero', e.target.value)}
                  className="border p-1"
                />
              </label>
              <label className="flex flex-col flex-grow">
                Monto
                <input
                  type="number"
                  value={cheque.monto}
                  onChange={e => actualizarCheque(i, 'monto', e.target.value)}
                  min="0"
                  step="0.01"
                  className="border p-1"
                />
              </label>
            </div>
            <button
              type="button"
              onClick={() => eliminarCheque(i)}
              className="text-red-600"
            >
              Eliminar cheque
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={agregarCheque}
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          Agregar cheque
        </button>
      </div>

      <div>
        <label className="block font-semibold">Observaciones</label>
        <textarea
          value={observaciones}
          onChange={e => setObservaciones(e.target.value)}
          className="border p-2 w-full"
          rows={3}
        />
      </div>

      <div className="font-bold text-lg">
        Total: {totalPago.toFixed(2)}
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Guardar
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-400 px-4 py-2 rounded"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
