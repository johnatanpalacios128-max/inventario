import React, { useState } from 'react';
import {
  Search,
  Filter,
  Calendar,
  BookOpen,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileSpreadsheet,
  Printer,
  Edit2,
  Trash2,
  ArrowDownLeft,
  Info
} from 'lucide-react';
import { LoanRecord } from '../types/inventory';
import { exportLoansToCSV } from '../utils/storage';

interface LoansViewProps {
  loans: LoanRecord[];
  onOpenNewLoan: () => void;
  onEditLoan: (loan: LoanRecord) => void;
  onDeleteLoan: (loanId: string) => void;
  onOpenReturnModal: (loan: LoanRecord) => void;
  onPrintTicket: (loan: LoanRecord) => void;
}

export const LoansView: React.FC<LoansViewProps> = ({
  loans,
  onOpenNewLoan,
  onEditLoan,
  onDeleteLoan,
  onOpenReturnModal,
  onPrintTicket
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'overdue' | 'returned'>('all');

  const todayStr = new Date().toISOString().slice(0, 10);

  const filteredLoans = loans.filter((loan) => {
    // Search matching
    const matchSearch =
      loan.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.contacto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.tipoPrenda.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.estadoAlPrestar.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.estadoAlDevolver.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchSearch) return false;

    const isOverdue = !loan.devuelto && loan.fechaDevolucion < todayStr;

    if (statusFilter === 'pending') return !loan.devuelto;
    if (statusFilter === 'overdue') return isOverdue;
    if (statusFilter === 'returned') return loan.devuelto;

    return true;
  });

  const pendingCount = loans.filter((l) => !l.devuelto).length;
  const overdueCount = loans.filter((l) => !l.devuelto && l.fechaDevolucion < todayStr).length;
  const returnedCount = loans.filter((l) => l.devuelto).length;

  return (
    <div className="space-y-6">
      {/* Top Controls Strip */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Control de Préstamos y Asignaciones Escolares
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Registro conforme a la plantilla institucional: prenda/material, fechas de préstamo y devolución, y estados de conservación.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => exportLoansToCSV(loans)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap shrink-0"
              title="Descargar tabla en formato CSV compatible con Microsoft Excel"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Exportar Excel / CSV</span>
            </button>
            <button
              onClick={onOpenNewLoan}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0e2a47] hover:bg-[#163a61] rounded-md transition-colors shadow-xs whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Préstamo</span>
            </button>
          </div>
        </div>

        {/* Filter bar and segmented status controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
          {/* Search box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por solicitante, contacto o prenda..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0e2a47]"
            />
          </div>

          {/* Interactive filter tabs (clean segmented buttons per design constitution) */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos ({loans.length})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                statusFilter === 'pending'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pendientes ({pendingCount})
            </button>
            <button
              onClick={() => setStatusFilter('overdue')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                statusFilter === 'overdue'
                  ? 'bg-red-50 text-red-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Vencidos ({overdueCount})
            </button>
            <button
              onClick={() => setStatusFilter('returned')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                statusFilter === 'returned'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Devueltos ({returnedCount})
            </button>
          </div>
        </div>
      </div>

      {/* Main Table: Exact headers and styling based on user reference screenshot */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {/* Exact Dark Navy Header Row from user's image */}
              <tr className="bg-[#0e2a47] text-white border-b border-[#0e2a47]">
                <th className="py-3.5 px-4 text-xs font-bold tracking-wider text-center border-r border-[#1a3a5e] whitespace-nowrap min-w-[150px]">
                  Nombre
                </th>
                <th className="py-3.5 px-4 text-xs font-bold tracking-wider text-center border-r border-[#1a3a5e] whitespace-nowrap min-w-[150px]">
                  Contacto
                </th>
                <th className="py-3.5 px-4 text-xs font-bold tracking-wider text-center border-r border-[#1a3a5e] whitespace-nowrap min-w-[180px]">
                  Tipo de prenda
                </th>
                <th className="py-3.5 px-4 text-xs font-bold tracking-wider text-center border-r border-[#1a3a5e] whitespace-nowrap min-w-[170px]">
                  Estado al prestar
                </th>
                <th className="py-3.5 px-4 text-xs font-bold tracking-wider text-center border-r border-[#1a3a5e] whitespace-nowrap min-w-[130px]">
                  Fecha de préstamo
                </th>
                <th className="py-3.5 px-4 text-xs font-bold tracking-wider text-center border-r border-[#1a3a5e] whitespace-nowrap min-w-[140px]">
                  Fecha de devolución
                </th>
                <th className="py-3.5 px-4 text-xs font-bold tracking-wider text-center border-r border-[#1a3a5e] whitespace-nowrap min-w-[180px]">
                  Estado al devolver
                </th>
                <th className="py-3.5 px-3 text-xs font-bold tracking-wider text-center whitespace-nowrap min-w-[120px]">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
              {filteredLoans.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-medium text-slate-700">No se encontraron registros de préstamo</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {searchTerm
                        ? 'Pruebe con otros términos de búsqueda o limpie los filtros'
                        : 'Haga clic en "+ Nuevo Préstamo" para agregar el primero'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredLoans.map((loan, idx) => {
                  const isOverdue = !loan.devuelto && loan.fechaDevolucion < todayStr;
                  return (
                    <tr
                      key={loan.id}
                      className={`transition-colors hover:bg-slate-50/80 ${
                        idx % 2 === 1 ? 'bg-slate-50/30' : 'bg-white'
                      }`}
                    >
                      {/* 1. Nombre */}
                      <td className="py-3 px-4 font-semibold text-slate-900 border-r border-slate-200">
                        <div className="flex flex-col">
                          <span>{loan.nombre}</span>
                          {loan.observaciones && (
                            <span className="text-[11px] font-normal text-slate-500 line-clamp-1">
                              {loan.observaciones}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 2. Contacto */}
                      <td className="py-3 px-4 text-slate-600 border-r border-slate-200">
                        <span className="break-words">{loan.contacto}</span>
                      </td>

                      {/* 3. Tipo de prenda */}
                      <td className="py-3 px-4 font-medium text-slate-900 border-r border-slate-200">
                        <div className="flex items-center gap-1.5">
                          <span>{loan.tipoPrenda}</span>
                          {!!loan.cantidadPrestada && loan.cantidadPrestada > 1 && (
                            <span className="font-mono text-[11px] text-slate-500">
                              (x{loan.cantidadPrestada})
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 4. Estado al prestar */}
                      <td className="py-3 px-4 text-slate-700 border-r border-slate-200">
                        <span>{loan.estadoAlPrestar}</span>
                      </td>

                      {/* 5. Fecha de préstamo */}
                      <td className="py-3 px-4 text-center font-mono tabular-nums text-slate-700 border-r border-slate-200">
                        {loan.fechaPrestamo}
                      </td>

                      {/* 6. Fecha de devolución */}
                      <td className="py-3 px-4 text-center border-r border-slate-200">
                        <div className="inline-flex flex-col items-center">
                          <span
                            className={`font-mono tabular-nums font-medium ${
                              isOverdue ? 'text-red-700 font-bold' : 'text-slate-800'
                            }`}
                          >
                            {loan.fechaDevolucion}
                          </span>
                          {isOverdue && (
                            <span className="text-[10px] text-red-600 font-semibold">
                              (Vencido)
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 7. Estado al devolver */}
                      <td className="py-3 px-4 border-r border-slate-200">
                        {loan.devuelto ? (
                          <div className="flex flex-col">
                            <span className="font-medium text-emerald-800 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline shrink-0" />
                              {loan.estadoAlDevolver}
                            </span>
                            {loan.fechaDevolucionReal && (
                              <span className="text-[10px] font-mono text-slate-500">
                                Recibido el: {loan.fechaDevolucionReal}
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`text-xs ${
                                isOverdue
                                  ? 'text-red-600 font-semibold'
                                  : 'text-amber-700 font-medium'
                              }`}
                            >
                              {loan.estadoAlDevolver}
                            </span>
                            <button
                              onClick={() => onOpenReturnModal(loan)}
                              className="px-2 py-1 text-[11px] font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded transition-colors whitespace-nowrap shadow-2xs"
                              title="Registrar devolución de este artículo"
                            >
                              Devolver
                            </button>
                          </div>
                        )}
                      </td>

                      {/* 8. Acciones */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onPrintTicket(loan)}
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                            title="Imprimir Acta de Préstamo con Firmas"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onEditLoan(loan)}
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                            title="Editar registro"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteLoan(loan.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Eliminar registro"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info note referring to the user reference */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-1.5">
            <Info className="w-4 h-4 text-slate-400 shrink-0" />
            <span>
              Mostrando <strong className="text-slate-700 font-mono">{filteredLoans.length}</strong> de <strong className="text-slate-700 font-mono">{loans.length}</strong> registros de préstamo
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Formato fiel al encabezado del sistema de prendas y equipos escolares
          </span>
        </div>
      </div>
    </div>
  );
};
