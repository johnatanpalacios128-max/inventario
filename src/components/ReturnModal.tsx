import React, { useState } from 'react';
import { X, Check, ArrowDownLeft, AlertCircle } from 'lucide-react';
import { LoanRecord } from '../types/inventory';

interface ReturnModalProps {
  isOpen: boolean;
  onClose: () => void;
  loan: LoanRecord | null;
  onConfirmReturn: (loanId: string, estadoAlDevolver: string, fechaDevolucionReal: string, observaciones?: string) => void;
}

export const ReturnModal: React.FC<ReturnModalProps> = ({
  isOpen,
  onClose,
  loan,
  onConfirmReturn
}) => {
  if (!isOpen || !loan) return null;

  const [estadoAlDevolver, setEstadoAlDevolver] = useState('Devuelto en excelente estado');
  const [fechaDevolucionReal, setFechaDevolucionReal] = useState(new Date().toISOString().slice(0, 10));
  const [observaciones, setObservaciones] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmReturn(loan.id, estadoAlDevolver, fechaDevolucionReal, observaciones);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 bg-[#0e2a47] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowDownLeft className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold">Registrar Devolución</h2>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Solicitante:</span>
              <span className="font-semibold text-slate-800">{loan.nombre}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Artículo / Prenda:</span>
              <span className="font-semibold text-slate-800">{loan.tipoPrenda}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Estado al prestar:</span>
              <span className="text-slate-700">{loan.estadoAlPrestar}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Fecha préstamo / límite:</span>
              <span className="font-mono text-slate-700">{loan.fechaPrestamo} → {loan.fechaDevolucion}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Fecha Real de Devolución
            </label>
            <input
              type="date"
              value={fechaDevolucionReal}
              onChange={(e) => setFechaDevolucionReal(e.target.value)}
              className="w-full px-3 py-2 text-sm font-mono bg-white border border-slate-300 rounded-md shadow-xs focus:ring-2 focus:ring-[#0e2a47]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Estado al Devolver <span className="text-red-500">*</span>
            </label>
            <select
              value={estadoAlDevolver}
              onChange={(e) => setEstadoAlDevolver(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md shadow-xs focus:ring-2 focus:ring-[#0e2a47]"
            >
              <option value="Devuelto en excelente estado">Devuelto en excelente estado</option>
              <option value="Devuelto en buen estado con desgaste normal">Devuelto en buen estado con desgaste normal</option>
              <option value="Devuelto con observaciones / Requiere tintorería o limpieza">Devuelto con observaciones / Requiere tintorería o limpieza</option>
              <option value="Devuelto dañado / Requiere reparación o reposición">Devuelto dañado / Requiere reparación o reposición</option>
              <option value="Extraviado / Reportado perdido">Extraviado / Reportado perdido</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Observaciones del Almacenero / Custodio
            </label>
            <textarea
              rows={2}
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Detalles de la entrega, verificación de botones, cables, accesorios..."
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md shadow-xs focus:ring-2 focus:ring-[#0e2a47]"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md shadow-xs"
            >
              <Check className="w-4 h-4" />
              <span>Confirmar Recepción</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
