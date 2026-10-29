import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Printer,
  FileSpreadsheet,
  RotateCcw,
  PenTool,
  Check,
  Search,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { TableRowRecord } from '../types/inventory';
import { exportTableToCSV } from '../utils/storage';

interface ExcelTableViewProps {
  rows: TableRowRecord[];
  onUpdateRows: (rows: TableRowRecord[]) => void;
  onOpenSignature: (rowId: string, personName: string) => void;
}

export const ExcelTableView: React.FC<ExcelTableViewProps> = ({
  rows,
  onUpdateRows,
  onOpenSignature
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Add an empty row ready to fill
  const handleAddRow = () => {
    const newRow: TableRowRecord = {
      id: `row-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      nombre: '',
      contacto: '',
      tipoPrenda: '',
      estadoAlPrestar: '',
      fechaPrestamo: new Date().toISOString().slice(0, 10),
      fechaDevolucion: '',
      estadoAlDevolver: '',
      firma: ''
    };
    onUpdateRows([...rows, newRow]);
  };

  // Add multiple empty rows at once (e.g. 5 blank rows)
  const handleAddMultipleEmptyRows = (count: number = 5) => {
    const newRows: TableRowRecord[] = [];
    for (let i = 0; i < count; i++) {
      newRows.push({
        id: `row-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
        nombre: '',
        contacto: '',
        tipoPrenda: '',
        estadoAlPrestar: '',
        fechaPrestamo: '',
        fechaDevolucion: '',
        estadoAlDevolver: '',
        firma: ''
      });
    }
    onUpdateRows([...rows, ...newRows]);
  };

  // Update specific field in a row
  const handleFieldChange = (id: string, field: keyof TableRowRecord, value: string) => {
    const updated = rows.map((r) => (r.id === id ? { ...r, [field]: value } : r));
    onUpdateRows(updated);
  };

  // Delete row
  const handleDeleteRow = (id: string) => {
    onUpdateRows(rows.filter((r) => r.id !== id));
  };

  // Clear all rows to make it completely empty
  const handleClearAll = () => {
    if (rows.length === 0) return;
    if (window.confirm('¿Desea vaciar completamente todas las filas de la tabla?')) {
      onUpdateRows([]);
    }
  };

  // Filtered rows
  const displayRows = rows.filter((r) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      r.nombre.toLowerCase().includes(term) ||
      r.contacto.toLowerCase().includes(term) ||
      r.tipoPrenda.toLowerCase().includes(term) ||
      r.estadoAlPrestar.toLowerCase().includes(term) ||
      r.estadoAlDevolver.toLowerCase().includes(term)
    );
  });

  // Minimum visible rows for blank sheet aesthetic (like in the user's screenshot)
  const minRows = 12;
  const emptyRowsCount = Math.max(0, minRows - displayRows.length);

  return (
    <div className="space-y-4">
      {/* Top Action & Control Ribbon (hidden during print) */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs no-print space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Planilla Oficial de Control y Préstamo de Prendas</span>
              <span className="text-xs font-mono font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                {rows.length} {rows.length === 1 ? 'registro' : 'registros'}
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Edite directamente sobre cada celda de la tabla. Puede agregar filas, capturar firmas digitales e imprimir o exportar a Excel.
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={handleAddRow}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#0e2a47] hover:bg-[#163a61] rounded-md transition-colors shadow-xs whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>+ Agregar Fila</span>
            </button>

            <button
              onClick={() => handleAddMultipleEmptyRows(5)}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap"
              title="Agregar 5 renglones vacíos a la tabla"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+5 Filas</span>
            </button>

            <button
              onClick={() => exportTableToCSV(rows)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap"
              title="Descargar archivo en formato Excel / CSV"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Exportar Excel</span>
            </button>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap"
              title="Imprimir planilla física"
            >
              <Printer className="w-4 h-4 text-slate-700" />
              <span>Imprimir</span>
            </button>

            {rows.length > 0 && (
              <button
                onClick={handleClearAll}
                className="inline-flex items-center gap-1 px-2.5 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-md transition-colors whitespace-nowrap"
                title="Vaciar tabla por completo"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Vaciar</span>
              </button>
            )}
          </div>
        </div>

        {/* Search filter if there are rows */}
        {rows.length > 0 && (
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filtrar por nombre, prenda, contacto..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-2 focus:ring-[#0e2a47]"
              />
            </div>
            {searchTerm && (
              <span className="text-xs text-slate-500">
                Mostrando {displayRows.length} de {rows.length} filas
              </span>
            )}
          </div>
        )}
      </div>

      {/* Main Excel-style Spreadsheet Table Container */}
      <div className="bg-white rounded-lg border-2 border-slate-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-black text-xs">
            <thead>
              {/* Exact Header matching user's reference image */}
              <tr className="bg-[#0e2a47] text-white">
                <th className="py-3 px-3 font-bold text-center border border-black uppercase tracking-wider text-[11px] whitespace-nowrap min-w-[140px]">
                  Nombre
                </th>
                <th className="py-3 px-3 font-bold text-center border border-black uppercase tracking-wider text-[11px] whitespace-nowrap min-w-[130px]">
                  Contacto
                </th>
                <th className="py-3 px-3 font-bold text-center border border-black uppercase tracking-wider text-[11px] whitespace-nowrap min-w-[150px]">
                  Tipo de prenda
                </th>
                <th className="py-3 px-3 font-bold text-center border border-black uppercase tracking-wider text-[11px] whitespace-nowrap min-w-[140px]">
                  Estado al prestar
                </th>
                <th className="py-3 px-3 font-bold text-center border border-black uppercase tracking-wider text-[11px] whitespace-nowrap min-w-[125px]">
                  Fecha de préstamo
                </th>
                <th className="py-3 px-3 font-bold text-center border border-black uppercase tracking-wider text-[11px] whitespace-nowrap min-w-[125px]">
                  Fecha de devolución
                </th>
                <th className="py-3 px-3 font-bold text-center border border-black uppercase tracking-wider text-[11px] whitespace-nowrap min-w-[140px]">
                  Estado al devolver
                </th>
                <th className="py-3 px-3 font-bold text-center border border-black uppercase tracking-wider text-[11px] whitespace-nowrap min-w-[120px]">
                  Firma
                </th>
                <th className="py-3 px-2 font-bold text-center border border-black uppercase tracking-wider text-[10px] w-10 no-print">
                  
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Existing user rows */}
              {displayRows.map((row) => (
                <tr key={row.id} className="hover:bg-sky-50/40 transition-colors">
                  {/* 1. Nombre */}
                  <td className="p-0 border border-black">
                    <input
                      type="text"
                      value={row.nombre}
                      onChange={(e) => handleFieldChange(row.id, 'nombre', e.target.value)}
                      placeholder="Nombre..."
                      className="w-full px-2.5 py-2 text-xs bg-transparent focus:bg-white focus:outline-hidden font-medium text-slate-900"
                    />
                  </td>

                  {/* 2. Contacto */}
                  <td className="p-0 border border-black">
                    <input
                      type="text"
                      value={row.contacto}
                      onChange={(e) => handleFieldChange(row.id, 'contacto', e.target.value)}
                      placeholder="Teléfono / Email..."
                      className="w-full px-2.5 py-2 text-xs bg-transparent focus:bg-white focus:outline-hidden text-slate-700"
                    />
                  </td>

                  {/* 3. Tipo de prenda */}
                  <td className="p-0 border border-black">
                    <input
                      type="text"
                      value={row.tipoPrenda}
                      onChange={(e) => handleFieldChange(row.id, 'tipoPrenda', e.target.value)}
                      placeholder="Prenda o artículo..."
                      className="w-full px-2.5 py-2 text-xs bg-transparent focus:bg-white focus:outline-hidden font-medium text-slate-900"
                    />
                  </td>

                  {/* 4. Estado al prestar */}
                  <td className="p-0 border border-black">
                    <input
                      type="text"
                      value={row.estadoAlPrestar}
                      onChange={(e) => handleFieldChange(row.id, 'estadoAlPrestar', e.target.value)}
                      placeholder="Ej. Excelente / Bueno..."
                      className="w-full px-2.5 py-2 text-xs bg-transparent focus:bg-white focus:outline-hidden text-slate-700"
                    />
                  </td>

                  {/* 5. Fecha de préstamo */}
                  <td className="p-0 border border-black text-center">
                    <input
                      type="date"
                      value={row.fechaPrestamo}
                      onChange={(e) => handleFieldChange(row.id, 'fechaPrestamo', e.target.value)}
                      className="w-full px-2 py-2 text-xs font-mono text-center bg-transparent focus:bg-white focus:outline-hidden text-slate-700"
                    />
                  </td>

                  {/* 6. Fecha de devolución */}
                  <td className="p-0 border border-black text-center">
                    <input
                      type="date"
                      value={row.fechaDevolucion}
                      onChange={(e) => handleFieldChange(row.id, 'fechaDevolucion', e.target.value)}
                      className="w-full px-2 py-2 text-xs font-mono text-center bg-transparent focus:bg-white focus:outline-hidden text-slate-700"
                    />
                  </td>

                  {/* 7. Estado al devolver */}
                  <td className="p-0 border border-black">
                    <input
                      type="text"
                      value={row.estadoAlDevolver}
                      onChange={(e) => handleFieldChange(row.id, 'estadoAlDevolver', e.target.value)}
                      placeholder="Ej. Pendiente / Devuelto..."
                      className="w-full px-2.5 py-2 text-xs bg-transparent focus:bg-white focus:outline-hidden text-slate-700"
                    />
                  </td>

                  {/* 8. Firma */}
                  <td className="p-1 border border-black text-center">
                    {row.firma ? (
                      <div className="flex items-center justify-center gap-1 group relative">
                        <img
                          src={row.firma}
                          alt="Firma"
                          className="h-7 max-w-[90px] object-contain mx-auto"
                        />
                        <button
                          type="button"
                          onClick={() => onOpenSignature(row.id, row.nombre)}
                          className="text-[10px] text-slate-400 hover:text-slate-700 underline no-print"
                          title="Cambiar firma"
                        >
                          Editar
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onOpenSignature(row.id, row.nombre)}
                        className="px-2 py-1 text-[11px] font-medium text-slate-500 hover:text-[#0e2a47] hover:bg-slate-100 rounded border border-dashed border-slate-300 w-full transition-colors no-print"
                      >
                        <PenTool className="w-3 h-3 inline mr-1 text-slate-400" />
                        <span>Firmar</span>
                      </button>
                    )}
                  </td>

                  {/* Delete button (no print) */}
                  <td className="p-1 border border-black text-center no-print">
                    <button
                      type="button"
                      onClick={() => handleDeleteRow(row.id)}
                      className="p-1 text-slate-300 hover:text-rose-600 rounded transition-colors"
                      title="Eliminar fila"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}

              {/* Blank empty rows to match the user's empty table template format */}
              {Array.from({ length: emptyRowsCount }).map((_, idx) => (
                <tr
                  key={`empty-${idx}`}
                  onClick={handleAddRow}
                  className="h-9 hover:bg-slate-50 cursor-pointer transition-colors"
                  title="Haga clic para comenzar a escribir en esta fila"
                >
                  <td className="border border-black text-center text-slate-300 text-[11px] select-none">
                    {displayRows.length === 0 && idx === 0 ? '+ Clic aquí para escribir nombre' : ''}
                  </td>
                  <td className="border border-black"></td>
                  <td className="border border-black"></td>
                  <td className="border border-black"></td>
                  <td className="border border-black"></td>
                  <td className="border border-black"></td>
                  <td className="border border-black"></td>
                  <td className="border border-black"></td>
                  <td className="border border-black no-print"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom indicator */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 no-print gap-2">
          <span>
            {rows.length === 0 ? (
              <span className="text-slate-600 font-medium">
                La tabla está completamente vacía como se solicitó. Haga clic en <strong>+ Agregar Fila</strong> o directamente en cualquier celda para comenzar a registrar.
              </span>
            ) : (
              <span>
                Total de registros: <strong className="font-mono text-slate-900">{rows.length}</strong>
              </span>
            )}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAddRow}
              className="text-xs font-semibold text-[#0e2a47] hover:underline"
            >
              + Agregar nueva fila
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
