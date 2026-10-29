import React from 'react';
import { Table, Layers, Plus, FileSpreadsheet, Printer, RotateCcw } from 'lucide-react';

interface HeaderProps {
  activeTab: 'table' | 'inventory';
  setActiveTab: (tab: 'table' | 'inventory') => void;
  onAddRow: () => void;
  onOpenNewItem: () => void;
  onExportTable: () => void;
  onPrint: () => void;
  tableRowsCount: number;
  inventoryCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onAddRow,
  onOpenNewItem,
  onExportTable,
  onPrint,
  tableRowsCount,
  inventoryCount
}) => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-[#0e2a47] flex items-center justify-center text-white shadow-xs">
              <Table className="w-5 h-5 text-amber-300" />
            </div>
            <a
              href="#table"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('table');
              }}
              className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:text-[#0e2a47] transition-colors"
            >
              Control Escolar <span className="text-xs font-semibold text-slate-500 font-mono ml-1">· Planilla Oficial</span>
            </a>
          </div>

          {/* Nav Tabs */}
          <nav className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('table')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'table'
                  ? 'bg-[#0e2a47] text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Table className="w-4 h-4" />
              <span>Tabla de Préstamo de Prendas</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                activeTab === 'table' ? 'bg-[#1a3a5e] text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {tableRowsCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'inventory'
                  ? 'bg-[#0e2a47] text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Inventario Escolar</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                activeTab === 'inventory' ? 'bg-[#1a3a5e] text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {inventoryCount}
              </span>
            </button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {activeTab === 'table' ? (
              <>
                <button
                  onClick={onExportTable}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap"
                  title="Exportar a archivo Excel"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Excel</span>
                </button>
                <button
                  onClick={onAddRow}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0e2a47] hover:bg-[#163a61] rounded-md transition-colors shadow-xs whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Agregar Fila</span>
                </button>
              </>
            ) : (
              <button
                onClick={onOpenNewItem}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0e2a47] hover:bg-[#163a61] rounded-md transition-colors shadow-xs whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>+ Nuevo Artículo</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
