import React, { useEffect, useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import Global from '../utils/global';

export default function BalanceProveedoresPage() {
  const [balances, setBalances] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const token = localStorage.getItem('token');
  const tableRef = useRef();

  const fetchBalances = async () => {
    try {
      const res = await fetch(Global.url + 'balance/proveedores', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setBalances(data);
    } catch (err) {
      console.error('Error al cargar balance de proveedores', err);
    }
  };

  const buscarProveedor = async () => {
    if (!busqueda.trim()) {
      fetchBalances();
      return;
    }

    try {
      const res = await fetch(
        Global.url + 'balance/proveedores/buscar/' + encodeURIComponent(busqueda.trim()),
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setBalances(data);
    } catch (err) {
      console.error('Error al buscar proveedor', err);
    }
  };

  useEffect(() => {
    fetchBalances();
  }, []);

  function applyCompatibleColors(element) {
    if (!element) return;

    element.style.backgroundColor = '#fff';
    element.style.color = '#000';
    element.style.borderColor = '#ccc';

    element.querySelectorAll('*').forEach((el) => {
      el.style.backgroundColor = '#fff';
      el.style.color = '#000';
      el.style.borderColor = '#ccc';
    });
  }

  function saveOriginalStyles(element, originalStyles) {
    originalStyles.set(element, {
      backgroundColor: element.style.backgroundColor,
      color: element.style.color,
      borderColor: element.style.borderColor,
    });
  }

  const generatePDF = async () => {
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
      pdf.save('balance_proveedores.pdf');
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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Cuentas Corrientes de Proveedores</h1>

      {/* 🔍 Buscador */}
      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Buscar proveedor..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="border px-3 py-1 rounded"
        />
        <button
          onClick={buscarProveedor}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Buscar
        </button>
        <button
          onClick={() => {
            setBusqueda('');
            fetchBalances();
          }}
          className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
        >
          Limpiar
        </button>
      </div>

      <div className="mb-4 space-x-2">
        <button
          onClick={generatePDF}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Descargar PDF
        </button>
        <button
          onClick={printPDF}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Imprimir PDF
        </button>
      </div>

      <div ref={tableRef} className="overflow-auto">
        <table className="w-full table-auto border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Proveedor</th>
              <th className="p-2 border">Facturado</th>
              <th className="p-2 border">Pagado</th>
              <th className="p-2 border">Saldo</th>
            </tr>
          </thead>
          <tbody>
            {balances.map((p) => (
              <tr key={p.id}>
                <td className="p-2 border">{p.nombre}</td>
                <td className="p-2 border">${p.total_facturado.toFixed(2)}</td>
                <td className="p-2 border">${p.total_pagado.toFixed(2)}</td>
                <td className="p-2 border font-bold">${p.saldo.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
