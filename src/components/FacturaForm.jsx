// components/FacturaForm.jsx
import React, { useEffect, useState } from 'react';

export default function FacturaForm({ onSubmit, facturaInicial, onCancel, entidades }) {
  const [numero, setNumero] = useState('');
  const [fecha, setFecha] = useState('');
  const [entidadId, setEntidadId] = useState('');  
  const [detalles, setDetalles] = useState([]);
  const [descDet, setDescDet] = useState('');
  const [cantDet, setCantDet] = useState(1);
  const [precioDet, setPrecioDet] = useState(0);

  const [ivaAlicuota, setIvaAlicuota] = useState(21);
  const [impuestosInternos, setImpuestosInternos] = useState(0);
  const [noGravado, setNoGravado] = useState(0);
  const [exento, setExento] = useState(0);
  const [comision, setComision] = useState(0);
  const [fletes, setFletes] = useState(0);

  const [retTipo, setRetTipo] = useState('IIBB');
  const provincias = [ 'Buenos Aires','CABA','Córdoba', /*...*/ ];
  const [retProvincia, setRetProvincia] = useState(provincias[0]);
  const [retMonto, setRetMonto] = useState(0);
  const [retenciones, setRetenciones] = useState([]);

  // Cálculos
const subtotalNeto = (detalles || []).reduce((sum, d) => sum + d.cantidad * d.precio, 0);
  const montoIVA = subtotalNeto * (ivaAlicuota/100);
  const subtotalOtros = impuestosInternos + noGravado + exento + comision + fletes;
const subtotalRetenciones = (retenciones || []).reduce((sum, r) => sum + r.monto, 0);
  const total = subtotalNeto + montoIVA + subtotalOtros - subtotalRetenciones;

  // Si estamos editando, cargamos valores iniciales
  useEffect(() => {
  if (facturaInicial) {
    setNumero(facturaInicial.numero || '');
    setFecha(facturaInicial.fecha || '');

    // Adaptar cliente/proveedor_id como entidadId
    setEntidadId(facturaInicial.entidadId || facturaInicial.proveedor_id || facturaInicial.cliente_id || '');

    setDetalles(facturaInicial.detalles || []);
    setIvaAlicuota(facturaInicial.ivaAlicuota ?? facturaInicial.iva ?? 21);
    setImpuestosInternos(facturaInicial.impuestosInternos ?? 0);
    setNoGravado(facturaInicial.noGravado ?? 0);
    setExento(facturaInicial.exento ?? 0);
    setComision(facturaInicial.comision ?? 0);
    setFletes(facturaInicial.fletes ?? 0);
    setRetenciones(facturaInicial.retenciones || []);
  }
}, [facturaInicial]);


  const agregarDetalle = () => {
    setDetalles([...detalles, { descripcion: descDet, cantidad: cantDet, precio: precioDet }]);
    setDescDet(''); setCantDet(1); setPrecioDet(0);
  };

  const agregarRet = () => {
    setRetenciones([...retenciones, { tipo: retTipo, provincia: retTipo==='IIBB'?retProvincia:'', monto: retMonto }]);
    setRetMonto(0);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!numero||!fecha) return alert('Número y fecha obligatorios.');
    const payload = {
      id: facturaInicial?.id,
      numero, fecha, entidadId,
      detalles, ivaAlicuota,
      impuestosInternos, noGravado, exento, comision, fletes,
      retenciones,
      subtotalNeto, montoIVA, subtotalOtros, subtotalRetenciones, total
    };
    onSubmit(facturaInicial ? payload : { ...payload, id: Date.now() });
     if (!facturaInicial) {
    setNumero('');
    setFecha('');
    setEntidadId(entidades[0]?.id || '');
    setDetalles([]);
    setDescDet('');
    setCantDet(1);
    setPrecioDet(0);
    setIvaAlicuota(21);
    setImpuestosInternos(0);
    setNoGravado(0);
    setExento(0);
    setComision(0);
    setFletes(0);
    setRetenciones([]);
    setRetTipo('IIBB');
    setRetProvincia(provincias[0]);
    setRetMonto(0);
  }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Datos principales */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label>Número (XXXXX-XXXXXXXX):</label>
          <input value={numero} onChange={e=>setNumero(e.target.value)} className="border p-1 w-full" />
        </div>
        <div>
          <label>Fecha:</label>
          <input type="date" value={fecha} onChange={e=>setFecha(e.target.value)} className="border p-1 w-full" />
        </div>
        <div>
          <label>Cliente/Proveedor:</label>
          <select value={entidadId} onChange={e => setEntidadId(+e.target.value)} className="border p-1 w-full">
          {entidades.map(e => (
          <option key={e.id} value={e.id}>{e.nombre}</option>
        ))}          
        </select>
        </div>
      </div>

      {/* Detalle de productos */}
      <div className="border p-3">
        <h2 className="font-semibold mb-2">Detalle de Productos</h2>
        <div className="flex gap-2 mb-2">
          <input placeholder="Descripción" value={descDet} onChange={e=>setDescDet(e.target.value)} className="border p-1 flex-1" />
          <input type="number" min="1" placeholder="Cantidad" value={cantDet} onChange={e=>setCantDet(+e.target.value)} className="border p-1 w-24" />
          <input type="number" min="0" step="0.01" placeholder="Precio" value={precioDet} onChange={e=>setPrecioDet(+e.target.value)} className="border p-1 w-24" />
          <button type="button" onClick={agregarDetalle} className="bg-blue-500 text-white px-3 rounded">Agregar</button>
        </div>
        <table className="w-full table-auto mb-2">
          <thead className="bg-gray-100"><tr>
            <th className="p-1">Descripción</th><th className="p-1">Cantidad</th><th className="p-1">Precio</th><th className="p-1">Neto</th>
          </tr></thead>
          <tbody>
            {detalles.map((d,i)=>(
              <tr key={i}>
                <td className="p-1">{d.descripcion}</td>
                <td className="p-1">{d.cantidad}</td>
                <td className="p-1">{d.precio.toFixed(2)}</td>
                <td className="p-1">{(d.cantidad*d.precio).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-right">Subtotal Neto: ${subtotalNeto.toFixed(2)}</p>
      </div>

      {/* IVA */}
      <div className="border p-3">
        <h2 className="font-semibold mb-2">Alícuota IVA</h2>
        <div className="flex items-center gap-4">
          {[10.5,21,27].map(a=>(
            <label key={a}>
              <input
                type="radio"
                checked={ivaAlicuota===a}
                onChange={()=>setIvaAlicuota(a)}
              /> {a}%
            </label>
          ))}
          <span>Monto IVA: ${montoIVA.toFixed(2)}</span>
        </div>
      </div>

      {/* Otros conceptos */}
      <div className="border p-3">
        <h2 className="font-semibold mb-2">Otros Conceptos</h2>
        <div className="grid grid-cols-5 gap-2">
          <div>
            <label>Impuestos Internos</label>
            <input type="number" min="0" step="0.01" value={impuestosInternos} onChange={e=>setImpuestosInternos(+e.target.value)} className="border p-1 w-full"/>
          </div>
          <div>
            <label>No Gravado</label>
            <input type="number" min="0" step="0.01" value={noGravado} onChange={e=>setNoGravado(+e.target.value)} className="border p-1 w-full"/>
          </div>
          <div>
            <label>Exento</label>
            <input type="number" min="0" step="0.01" value={exento} onChange={e=>setExento(+e.target.value)} className="border p-1 w-full"/>
          </div>
          <div>
            <label>Comisión</label>
            <input type="number" min="0" step="0.01" value={comision} onChange={e=>setComision(+e.target.value)} className="border p-1 w-full"/>
          </div>
          <div>
            <label>Fletes</label>
            <input type="number" min="0" step="0.01" value={fletes} onChange={e=>setFletes(+e.target.value)} className="border p-1 w-full"/>
          </div>
        </div>
        <p className="text-right mt-2">Subtotal Otros: ${subtotalOtros.toFixed(2)}</p>
      </div>

      {/* Retenciones */}
      <div className="border p-3">
        <h2 className="font-semibold mb-2">Retenciones / Percepciones</h2>
        <div className="flex gap-2 mb-2 items-end">
          <div>
            <label>Tipo</label>
            <select value={retTipo} onChange={e=>setRetTipo(e.target.value)} className="border p-1">
              <option>IIBB</option><option>IVA</option><option>Ganancias</option><option>SUSS</option>
            </select>
          </div>
          {retTipo==='IIBB' && (
            <div>
              <label>Provincia</label>
              <select value={retProvincia} onChange={e=>setRetProvincia(e.target.value)} className="border p-1">
                {provincias.map(p=><option key={p}>{p}</option>)}
              </select>
            </div>
          )}
          <div>
            <label>Monto</label>
            <input type="number" min="0" step="0.01" value={retMonto} onChange={e=>setRetMonto(+e.target.value)} className="border p-1"/>
          </div>
          <button type="button" onClick={agregarRet} className="bg-blue-500 text-white px-3 rounded">Agregar</button>
        </div>
        <table className="w-full table-auto mb-2">
          <thead className="bg-gray-100"><tr>
            <th className="p-1">Tipo</th><th className="p-1">Provincia</th><th className="p-1">Monto</th>
          </tr></thead>
          <tbody>
            {retenciones.map((r,i)=>(
              <tr key={i}>
                <td className="p-1">{r.tipo}</td>
                <td className="p-1">{r.provincia}</td>
                <td className="p-1">{r.monto.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-right">Subtotal Retenciones: ${subtotalRetenciones.toFixed(2)}</p>
      </div>

      {/* Total y botones */}
      <div className="text-right space-x-2">
        <span className="font-bold text-lg">Total: ${total.toFixed(2)}</span>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          {facturaInicial ? 'Actualizar' : 'Guardar'}
        </button>
        {facturaInicial && (
          <button type="button" onClick={onCancel} className="bg-gray-400 text-white px-4 py-2 rounded">
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
