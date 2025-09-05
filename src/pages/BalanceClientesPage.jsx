import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Global from '../utils/global';

export default function BalanceClientesPage() {
  const [balances, setBalances] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const token = localStorage.getItem('token');

  const cargarTodos = () => {
    fetch(Global.url + 'balance/clientes', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setBalances(data))
      .catch((err) => console.error('Error al cargar balance de clientes', err));
  };

  useEffect(() => {
    cargarTodos();
  }, []);

  const buscarCliente = () => {
    if (!busqueda.trim()) {
      cargarTodos();
      return;
    }

    fetch(Global.url + 'balance/clientes/buscar/' + encodeURIComponent(busqueda.trim()), {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setBalances(data))
      .catch((err) => console.error('Error buscando cliente', err));
  };
  const totalSaldo = balances.reduce((acc, c) => acc + c.saldo, 0);

  // 📄 Función general para exportar (download/print)
  const generarPDF = (accion = "download") => {
    const pdf = new jsPDF({ orientation: 'landscape' });

    pdf.setFontSize(16);
    pdf.text("Resumen Total", 14, 15);

    autoTable(pdf, {
      startY: 25,
      head: [['Cliente', 'Facturado', 'Cobrado', 'Saldo']],
      body: balances.map(c => [
        c.nombre,
        `$${c.total_facturado.toFixed(2)}`,
        `$${c.total_cobrado.toFixed(2)}`,
        `$${c.saldo.toFixed(2)}`
      ]),
      // Fila de total
        ['Total', '', '', `$${totalSaldo.toFixed(2)}`]
      styles: { fontSize: 10 },
    });

    if (accion === "download") {
      pdf.save("balance_clientes.pdf");
    } else if (accion === "print") {
      pdf.autoPrint();
      window.open(pdf.output("bloburl"), "_blank");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Resumen Total</h1>

      {/* 🔍 Buscador */}
      {/* <div className="mb-4 flex items-center space-x-2">
        <input
          type="text"
          placeholder="Buscar cliente..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1"
        />
        <button
          onClick={buscarCliente}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Buscar
        </button>
        <button
          onClick={() => {
            setBusqueda('');
            cargarTodos();
          }}
          className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
        >
          Limpiar
        </button>
      </div> */}

      {/* 📄 Botones PDF */}
      <div className="mb-4 space-x-2">
        <button
          onClick={() => generarPDF("download")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Descargar PDF
        </button>
        <button
          onClick={() => generarPDF("print")}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Imprimir PDF
        </button>
      </div>

      {/* 📊 Tabla de resultados */}
      <div className="overflow-auto">
        <table className="w-full table-auto border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Cliente</th>
              <th className="p-2 border">Facturado</th>
              <th className="p-2 border">Cobrado</th>
              <th className="p-2 border">Saldo</th>
            </tr>
          </thead>
          <tbody>
            {balances.map((c) => (
              <tr key={c.id}>
                <td className="p-2 border">{c.nombre}</td>
                <td className="p-2 border">${c.total_facturado.toFixed(2)}</td>
                <td className="p-2 border">${c.total_cobrado.toFixed(2)}</td>
                <td className="p-2 border font-bold">${c.saldo.toFixed(2)}</td>
              </tr>
            ))}
            {/* Fila de Total */}
            <tr className="bg-gray-200 font-bold">
              <td className="p-2 border text-right" colSpan={3}>Total:</td>
              <td className="p-2 border">${totalSaldo.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
