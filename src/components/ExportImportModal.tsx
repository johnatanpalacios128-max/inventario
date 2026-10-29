import React, { useState } from 'react';
import { X, Download, FileSpreadsheet, RotateCcw, Printer, Check, AlertCircle } from 'lucide-react';
import { InventoryItem, LoanRecord } from '../types/inventory';
import { exportInventoryToCSV, exportLoansToCSV } from '../utils/storage';

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: InventoryItem[];
  loans: LoanRecord[];
  onResetDefaults: () => void;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  isOpen,
  onClose,
  items,
  loans,
  onResetDefaults
}) => {
  const [resetSuccess, setResetSuccess] = useState(false);

  if (!isOpen) return null;

  const handleReset = () => {
    if (window.confirm('¿Está seguro de que desea restablecer el inventario y préstamos a los datos de ejemplo iniciales? Se perderán las modificaciones locales.')) {
      onResetDefaults();
      setResetSuccess(true);
      setTimeout(() => {
        setResetSuccess(false);
        onClose();
      }, 1000);
    }
  };

  const handlePrintFullInventory = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden my-8">
        <div className="px-6 py-4 bg-[#0e2a47] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-amber-300" />
            <h2 className="text-base font-bold">Exportación e Información de Datos</h2>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Export section */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Descargar Planillas de Cálculo (CSV / Excel)
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => exportInventoryToCSV(items)}
                className="p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left transition-colors flex items-start gap-3"
              >
                <FileSpreadsheet className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-xs text-slate-900 block">
                    Inventario de Bienes
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {items.length} artículos con todos sus campos
                  </span>
                </div>
              </button>

              <button
                onClick={() => exportLoansToCSV(loans)}
                className="p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left transition-colors flex items-start gap-3"
              >
                <FileSpreadsheet className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-xs text-slate-900 block">
                    Registro de Préstamos
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {loans.length} registros (formato plantilla)
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Print Catalog */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Reporte para Imprimir o Guardar en PDF
            </h3>
            <button
              onClick={handlePrintFullInventory}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Reporte Institucional del Inventario</span>
            </button>
          </div>

          {/* Reset to defaults */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-rose-800">
              Datos de Demostración
            </h3>
            <p className="text-xs text-slate-500">
              Restaure los ejemplos predeterminados escolares en cualquier momento si desea probar con datos nuevos.
            </p>
            <button
              onClick={handleReset}
              className="w-full py-2 px-3 border border-slate-300 text-slate-700 hover:text-rose-700 hover:bg-rose-50 text-xs font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restablecer Datos de Ejemplo</span>
            </button>
            {resetSuccess && (
              <p className="text-xs text-emerald-600 font-medium text-center">
                ¡Datos restablecidos con éxito!
              </p>
            )}
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
