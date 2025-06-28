import React, { useEffect, useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import Global from '../utils/global';

export default function CuentaCorrienteCliente() {
  const [facturas, setFacturas] = useState([]);
  const [recibos, setRecibos] = useState([]);
  const [tipo, setTipo] = useState('venta'); // o 'compra'
  const [nombre, setNombre] = useState('');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const token = localStorage.getItem('token');
  const tableRef = useRef();

  const buscarFacturas = async () => {
    const params = new URLSearchParams();
    params.append('tipo', tipo);
    if (nombre.trim()) params.append('nombre', nombre.trim());
    if (desde) params.append('desde', desde);
    if (hasta) params.append('hasta', hasta);

    try {
      const res = await fetch(Global.url + 'facturas/buscar?' + params.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setFacturas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error buscando facturas', err);
    }
  };

  const buscarRecibos = async () => {
    const params = new URLSearchParams();
    const tipoRecibo = tipo === 'venta' ? 'cobro' : 'pago';
    params.append('tipo', tipoRecibo);
    if (nombre.trim()) params.append('nombre', nombre.trim());
    if (desde) params.append('desde', desde);
    if (hasta) params.append('hasta', hasta);

    try {
      const res = await fetch(Global.url + 'recibos/buscar?' + params.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRecibos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error buscando recibos', err);
    }
  };

  const buscarTodo = () => {
    buscarFacturas();
    buscarRecibos();
  };

  const limpiar = () => {
    setNombre('');
    setDesde('');
    setHasta('');
    buscarTodo();
  };

  const applyCompatibleColors = (element) => {
    if (!element) return;
    element.style.backgroundColor = '#fff';
    element.style.color = '#000';
    element.style.borderColor = '#ccc';
    element.querySelectorAll('*').forEach((el) => {
      el.style.backgroundColor = '#fff';
      el.style.color = '#000';
      el.style.borderColor = '#ccc';
    });
  };

  const saveOriginalStyles = (element, originalStyles) => {
    originalStyles.set(element, {
      backgroundColor: element.style.backgroundColor,
      color: element.style.color,
      borderColor: element.style.borderColor,
    });
  };

  const downloadPDF = async () => {
    const tableElement = tableRef.current;
    if (!tableElement) return;
    const originalStyles = new Map();
    saveOriginalStyles(tableElement, originalStyles);
    tableElement.querySelectorAll('*').forEach((el) => saveOriginalStyles(el, originalStyles));
    applyCompatibleColors(tableElement);

    try {
      const canvas = await html2canvas(tableElement, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'landscape' });
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('cuenta_corriente.pdf');
    } catch (error) {
      console.error('Error generando PDF', error);
    } finally {
      originalStyles.forEach((style, el) => {
        el.style.backgroundColor = style.backgroundColor;
        el.style.color = style.color;
        el.style.borderColor = style.borderColor;
      });
    }
  };

  const printPDF = async () => {
    const tableElement = tableRef.current;
    if (!tableElement) return;
    const originalStyles = new Map();
    saveOriginalStyles(tableElement, originalStyles);
    tableElement.querySelectorAll('*').forEach((el) => saveOriginalStyles(el, originalStyles));
    applyCompatibleColors(tableElement);

    try {
      const canvas = await html2canvas(tableElement, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'landscape' });
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.autoPrint();
      const pdfBlobUrl = pdf.output('bloburl');
      window.open(pdfBlobUrl);
    } catch (error) {
      console.error('Error generando PDF para imprimir', error);
    } finally {
      originalStyles.forEach((style, el) => {
        el.style.backgroundColor = style.backgroundColor;
        el.style.color = style.color;
        el.style.borderColor = style.borderColor;
      });
    }
  };

  useEffect(() => {
    buscarTodo();
  }, [tipo]);

  const calcularBalance = () => {
  let total = 0;

  // Sumamos o restamos facturas según el tipo_f
  facturas.forEach((f) => {
    const tipoF = (f.tipo_f || '').toLowerCase();
    if (['factura', 'nota de débito', 'saldo inicial'].includes(tipoF)) {
      total += f.total;
    } else if (tipoF === 'nota de crédito') {
      total -= f.total;
    }
  });

  // Restamos los recibos (son cobros o pagos)
  recibos.forEach((r) => {
    total -= r.total || 0;
  });

  return total;
};

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Cuenta corriente {tipo === 'venta' ? 'Clientes' : 'Proveedores'}</h1>

      <div className="mb-4 flex flex-wrap gap-2 items-center">
        <input
          type="text"
          placeholder={`Buscar ${tipo === 'venta' ? 'cliente' : 'proveedor'}...`}
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="border px-3 py-1 rounded"
        />
        <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} className="border px-3 py-1 rounded" />
        <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} className="border px-3 py-1 rounded" />
        <button onClick={buscarTodo} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Buscar</button>
        <button onClick={limpiar} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">Limpiar</button>
      </div>

      <div className="mb-4 space-x-2">
        <button onClick={downloadPDF} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Descargar PDF</button>
        <button onClick={printPDF} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Imprimir PDF</button>
      </div>

      {/* Tablas Facturas + Recibos */}
      <div ref={tableRef} className="overflow-auto space-y-8">

        {/* FACTURAS */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Facturas</h2>
          <table className="w-full table-auto border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Fecha</th>
                <th className="p-2 border">Nro</th>
                <th className="p-2 border">Tipo F</th>
                <th className="p-2 border">{tipo === 'venta' ? 'Cliente' : 'Proveedor'}</th>
                <th className="p-2 border text-right">Subtotal</th>
                <th className="p-2 border text-right">IVA</th>
                <th className="p-2 border text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {facturas.map((f) => (
                <tr key={f.id}>
                  <td className="p-2 border">{f.fecha}</td>
                  <td className="p-2 border">{f.numero}</td>
                  <td className="p-2 border">{f.tipo_f}</td>
                  <td className="p-2 border">{tipo === 'venta' ? f.cliente_nombre : f.proveedor_nombre}</td>
                  <td className="p-2 border text-right">${f.subtotal.toFixed(2)}</td>
                  <td className="p-2 border text-right">${f.iva.toFixed(2)}</td>
                  <td className="p-2 border text-right font-bold">${f.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* RECIBOS */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Recibos</h2>
          <table className="w-full table-auto border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Fecha</th>
                <th className="p-2 border">Nro</th>
                <th className="p-2 border">{tipo === 'venta' ? 'Cliente' : 'Proveedor'}</th>
                <th className="p-2 border text-right">Efectivo</th>
                <th className="p-2 border text-right">Transferencia</th>
                <th className="p-2 border text-right">Otros</th>
                <th className="p-2 border text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {recibos.map((r) => (
                <tr key={r.id}>
                  <td className="p-2 border">{r.fecha}</td>
                  <td className="p-2 border">{r.numero}</td>
                  <td className="p-2 border">{tipo === 'venta' ? r.cliente_nombre : r.proveedor_nombre}</td>
                  <td className="p-2 border text-right">${r.efectivo?.toFixed(2)}</td>
                  <td className="p-2 border text-right">${r.transferencia?.toFixed(2)}</td>
                  <td className="p-2 border text-right">${r.otros?.toFixed(2)}</td>
                  <td className="p-2 border text-right font-bold">${r.total?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        
          <div className="mt-6 text-right text-xl font-bold">
  Total a cobrar ${calcularBalance().toFixed(2)}
</div>

        

      </div>
    </div>
  );
}
