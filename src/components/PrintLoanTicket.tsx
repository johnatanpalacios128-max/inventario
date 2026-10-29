import React from 'react';
import { X, Printer, CheckCircle, ShieldCheck } from 'lucide-react';
import { LoanRecord } from '../types/inventory';

interface PrintLoanTicketProps {
  isOpen: boolean;
  onClose: () => void;
  loan: LoanRecord | null;
}

export const PrintLoanTicket: React.FC<PrintLoanTicketProps> = ({
  isOpen,
  onClose,
  loan
}) => {
  if (!isOpen || !loan) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden my-8">
        {/* Modal Controls (Hidden when printing) */}
        <div className="px-6 py-4 bg-[#0e2a47] text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-amber-300" />
            <h2 className="text-base font-bold">Comprobante Oficial de Préstamo</h2>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 space-y-6 text-slate-800 bg-white">
          {/* Institutional School Letterhead */}
          <div className="text-center border-b-2 border-slate-900 pb-4">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500 block">
              INSTITUCIÓN EDUCATIVA DEPARTAMENTAL
            </span>
            <h1 className="text-lg font-bold text-slate-900 uppercase tracking-tight">
              Acta de Préstamo y Custodia de Bienes Escolares
            </h1>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Folio Nº: {loan.id.toUpperCase()} · Emisión: {new Date().toLocaleDateString('es-ES')}
            </p>
          </div>

          {/* Recipient and details */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-slate-500 font-semibold uppercase block">Beneficiario / Solicitante:</span>
              <p className="font-bold text-sm text-slate-900">{loan.nombre}</p>
              <p className="text-slate-600">Contacto: {loan.contacto}</p>
            </div>
            <div className="space-y-1 text-right">
              <span className="text-slate-500 font-semibold uppercase block">Fechas Pactadas:</span>
              <p className="font-mono text-slate-700">Préstamo: <strong>{loan.fechaPrestamo}</strong></p>
              <p className="font-mono text-slate-700">Devolución: <strong>{loan.fechaDevolucion}</strong></p>
            </div>
          </div>

          {/* Loaned Item Table */}
          <div className="border border-slate-300 rounded-lg overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-[#0e2a47] text-white">
                <tr>
                  <th className="py-2 px-3">Tipo de Prenda / Artículo</th>
                  <th className="py-2 px-3 text-center">Cant.</th>
                  <th className="py-2 px-3">Estado al Prestar</th>
                  <th className="py-2 px-3">Estado Devolución</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-3 px-3 font-semibold text-slate-900">{loan.tipoPrenda}</td>
                  <td className="py-3 px-3 text-center font-mono font-bold">{loan.cantidadPrestada}</td>
                  <td className="py-3 px-3 text-slate-700">{loan.estadoAlPrestar}</td>
                  <td className="py-3 px-3 text-slate-700">{loan.estadoAlDevolver}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {loan.observaciones && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs">
              <span className="font-bold text-slate-700">Motivo / Observaciones: </span>
              <span className="text-slate-600">{loan.observaciones}</span>
            </div>
          )}

          {/* Commitment text */}
          <div className="text-[11px] text-slate-500 leading-relaxed border-t border-slate-200 pt-3">
            El solicitante declara recibir en las condiciones descritas el bien o prenda escolar institucional, comprometiéndose a velar por su conservación, buen uso, y a efectuar la devolución puntual en la fecha señalada. En caso de pérdida, deterioro grave o daño por negligencia, asume la reposición del mismo.
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-10 text-center text-xs">
            <div className="border-t border-slate-400 pt-2">
              <p className="font-semibold text-slate-900">{loan.nombre}</p>
              <p className="text-[11px] text-slate-500">Firma del Solicitante</p>
              <p className="text-[10px] text-slate-400 font-mono">DNI / Doc. Identidad: ________________</p>
            </div>

            <div className="border-t border-slate-400 pt-2">
              <p className="font-semibold text-slate-900">Encargado de Inventario / Almacén</p>
              <p className="text-[11px] text-slate-500">Firma y Sello de Entrega</p>
              <p className="text-[10px] text-slate-400 font-mono">Fecha Recepción: ____/____/202__</p>
            </div>
          </div>

          {/* Controls to print (hidden during actual printing) */}
          <div className="pt-6 border-t border-slate-200 flex items-center justify-end gap-3 no-print">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md"
            >
              Cerrar
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0e2a47] hover:bg-[#163a61] rounded-md shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Documento</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
