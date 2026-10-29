import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Filter,
  Layers,
  MapPin,
  Calendar,
  Tag,
  QrCode,
  Edit2,
  Trash2,
  ArrowUpRight,
  BookOpen,
  LayoutGrid,
  List,
  AlertCircle,
  FileSpreadsheet,
  Building,
  Check
} from 'lucide-react';
import { InventoryItem, CATEGORIAS_DEFAULT, UBICACIONES_DEFAULT } from '../types/inventory';
import { exportInventoryToCSV } from '../utils/storage';

interface InventoryViewProps {
  items: InventoryItem[];
  onOpenNewItem: () => void;
  onEditItem: (item: InventoryItem) => void;
  onDeleteItem: (itemId: string) => void;
  onLendItem: (item: InventoryItem) => void;
  onViewDetail: (item: InventoryItem) => void;
  onQuickUpdateQuantity: (itemId: string, newQty: number) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  items,
  onOpenNewItem,
  onEditItem,
  onDeleteItem,
  onLendItem,
  onViewDetail,
  onQuickUpdateQuantity
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState<string>('all');
  const [selectedUbicacion, setSelectedUbicacion] = useState<string>('all');
  const [onlyLowStock, setOnlyLowStock] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [sortBy, setSortBy] = useState<'nombre' | 'cantidad' | 'fecha' | 'categoria'>('nombre');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  // Extract unique categories and locations from items
  const uniqueCategories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((i) => set.add(i.categoria));
    return Array.from(set).sort();
  }, [items]);

  const uniqueLocations = useMemo(() => {
    const set = new Set<string>();
    items.forEach((i) => set.add(i.ubicacion));
    return Array.from(set).sort();
  }, [items]);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchSearch =
        item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.codigoPatrimonial.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ubicacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.responsable && item.responsable.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.notas && item.notas.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!matchSearch) return false;

      if (selectedCategoria !== 'all' && item.categoria !== selectedCategoria) {
        return false;
      }

      if (selectedUbicacion !== 'all' && item.ubicacion !== selectedUbicacion) {
        return false;
      }

      const available = Math.max(0, item.cantidad - (item.unidadesPrestadas || 0));
      if (onlyLowStock && available > 2) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      let comp = 0;
      if (sortBy === 'nombre') {
        comp = a.nombre.localeCompare(b.nombre);
      } else if (sortBy === 'cantidad') {
        comp = a.cantidad - b.cantidad;
      } else if (sortBy === 'fecha') {
        comp = a.fechaAdquisicion.localeCompare(b.fechaAdquisicion);
      } else if (sortBy === 'categoria') {
        comp = a.categoria.localeCompare(b.categoria);
      }
      return sortDir === 'asc' ? comp : -comp;
    });
  }, [items, searchTerm, selectedCategoria, selectedUbicacion, onlyLowStock, sortBy, sortDir]);

  // Overall Statistics Summary
  const stats = useMemo(() => {
    const totalArticulos = items.length;
    const totalUnidades = items.reduce((acc, curr) => acc + curr.cantidad, 0);
    const totalPrestadas = items.reduce((acc, curr) => acc + (curr.unidadesPrestadas || 0), 0);
    const lowStockItems = items.filter(
      (i) => Math.max(0, i.cantidad - (i.unidadesPrestadas || 0)) <= 2
    ).length;

    return { totalArticulos, totalUnidades, totalPrestadas, lowStockItems };
  }, [items]);

  const handleSort = (field: 'nombre' | 'cantidad' | 'fecha' | 'categoria') => {
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('asc');
    }
  };

  // Helper to format date in Spanish
  const formatFriendlyDate = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        return d.toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  // Calculate approximate age
  const calculateAge = (dateStr: string) => {
    try {
      const start = new Date(dateStr).getTime();
      const now = new Date().getTime();
      const diffYears = Math.floor((now - start) / (1000 * 60 * 60 * 24 * 365.25));
      if (diffYears < 1) {
        const diffMonths = Math.floor((now - start) / (1000 * 60 * 60 * 24 * 30));
        return diffMonths <= 1 ? 'Reciente' : `${diffMonths} meses`;
      }
      return `${diffYears} año${diffYears > 1 ? 's' : ''}`;
    } catch {
      return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* 4-Column Stat Metric Strip (Clean layout per frontend-design guidelines) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-medium text-slate-500">Artículos Registrados</p>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {stats.totalArticulos}
            </span>
            <span className="text-xs text-slate-400">ítems únicos</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-medium text-slate-500">Unidades en Existencia</p>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {stats.totalUnidades}
            </span>
            <span className="text-xs text-slate-500">
              {stats.totalUnidades - stats.totalPrestadas} disp.
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-medium text-slate-500">Unidades Prestadas</p>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tabular-nums text-amber-700">
              {stats.totalPrestadas}
            </span>
            <span className="text-xs text-amber-800">en custodia</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-medium text-slate-500">Alerta de Stock Bajo</p>
          <div className="mt-1 flex items-baseline justify-between">
            <span className={`text-2xl font-bold font-mono tabular-nums ${stats.lowStockItems > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
              {stats.lowStockItems}
            </span>
            <span className="text-xs text-slate-400">≤ 2 disponibles</span>
          </div>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Inventario General de Bienes Escolares
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Campos requeridos: Nombre del artículo, Cantidad, Categoría, Ubicación y Fecha de adquisición.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => exportInventoryToCSV(items)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap shrink-0"
              title="Exportar inventario a hoja de cálculo CSV/Excel"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Exportar Inventario</span>
            </button>
            <button
              onClick={onOpenNewItem}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0e2a47] hover:bg-[#163a61] rounded-md transition-colors shadow-xs whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Artículo</span>
            </button>
          </div>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-3 border-t border-slate-100">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, código, responsable..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0e2a47]"
            />
          </div>

          {/* Categoría Filter */}
          <div>
            <select
              value={selectedCategoria}
              onChange={(e) => setSelectedCategoria(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0e2a47]"
            >
              <option value="all">Todas las categorías</option>
              {uniqueCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Ubicación Filter */}
          <div>
            <select
              value={selectedUbicacion}
              onChange={(e) => setSelectedUbicacion(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0e2a47]"
            >
              <option value="all">Todas las ubicaciones</option>
              {uniqueLocations.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Bajo Toggle and View Switcher */}
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => setOnlyLowStock(!onlyLowStock)}
              className={`flex-1 px-2.5 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap text-center ${
                onlyLowStock
                  ? 'bg-rose-50 border-rose-300 text-rose-800'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              {onlyLowStock ? 'Stock bajo (filtro activo)' : 'Stock bajo'}
            </button>

            <div className="flex items-center bg-slate-100 p-0.5 rounded-md shrink-0">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'table' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Vista en tabla"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'grid' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Vista en tarjetas"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Rendering: Table or Grid */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0e2a47] text-white border-b border-[#0e2a47]">
                  <th className="py-3 px-4 text-xs font-bold tracking-wider text-center border-r border-[#1a3a5e] whitespace-nowrap min-w-[120px]">
                    Código
                  </th>
                  <th
                    onClick={() => handleSort('nombre')}
                    className="py-3 px-4 text-xs font-bold tracking-wider text-left border-r border-[#1a3a5e] cursor-pointer hover:bg-[#163a61] transition-colors whitespace-nowrap min-w-[220px]"
                  >
                    Nombre del Artículo {sortBy === 'nombre' && (sortDir === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    onClick={() => handleSort('cantidad')}
                    className="py-3 px-4 text-xs font-bold tracking-wider text-center border-r border-[#1a3a5e] cursor-pointer hover:bg-[#163a61] transition-colors whitespace-nowrap min-w-[130px]"
                  >
                    Cantidad {sortBy === 'cantidad' && (sortDir === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    onClick={() => handleSort('categoria')}
                    className="py-3 px-4 text-xs font-bold tracking-wider text-left border-r border-[#1a3a5e] cursor-pointer hover:bg-[#163a61] transition-colors whitespace-nowrap min-w-[170px]"
                  >
                    Categoría {sortBy === 'categoria' && (sortDir === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="py-3 px-4 text-xs font-bold tracking-wider text-left border-r border-[#1a3a5e] whitespace-nowrap min-w-[170px]">
                    Ubicación
                  </th>
                  <th
                    onClick={() => handleSort('fecha')}
                    className="py-3 px-4 text-xs font-bold tracking-wider text-center border-r border-[#1a3a5e] cursor-pointer hover:bg-[#163a61] transition-colors whitespace-nowrap min-w-[150px]"
                  >
                    Fecha Adquisición {sortBy === 'fecha' && (sortDir === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="py-3 px-4 text-xs font-bold tracking-wider text-center border-r border-[#1a3a5e] whitespace-nowrap min-w-[110px]">
                    Estado
                  </th>
                  <th className="py-3 px-3 text-xs font-bold tracking-wider text-center whitespace-nowrap min-w-[130px]">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500">
                      <Layers className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="font-medium text-slate-700">No se encontraron artículos</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Ajuste los filtros o registre un nuevo artículo con el botón superior.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item, idx) => {
                    const disponibles = Math.max(0, item.cantidad - (item.unidadesPrestadas || 0));
                    const isLow = disponibles <= 2;
                    return (
                      <tr
                        key={item.id}
                        className={`transition-colors hover:bg-slate-50/80 ${
                          idx % 2 === 1 ? 'bg-slate-50/30' : 'bg-white'
                        }`}
                      >
                        {/* Código */}
                        <td className="py-3 px-4 font-mono text-center tabular-nums text-slate-600 border-r border-slate-200">
                          <button
                            onClick={() => onViewDetail(item)}
                            className="hover:underline hover:text-[#0e2a47] font-semibold"
                            title="Ver ficha patrimonial y código QR"
                          >
                            {item.codigoPatrimonial}
                          </button>
                        </td>

                        {/* Nombre del Artículo (Requerido) */}
                        <td className="py-3 px-4 border-r border-slate-200">
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-900 text-[13px]">
                              {item.nombre}
                            </span>
                            {item.responsable && (
                              <span className="text-[11px] text-slate-500">
                                Responsable: {item.responsable}
                              </span>
                            )}
                            {item.notas && (
                              <span className="text-[11px] text-slate-400 line-clamp-1 italic">
                                {item.notas}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Cantidad (Requerido: Total, Disponibles, Prestadas) */}
                        <td className="py-3 px-4 text-center border-r border-slate-200">
                          <div className="inline-flex flex-col items-center">
                            <div className="flex items-center gap-1 font-mono font-bold text-sm text-slate-900 tabular-nums">
                              <span>{item.cantidad}</span>
                              <span className="text-slate-400 text-xs font-normal">totales</span>
                            </div>
                            <div className="text-[11px] text-slate-500">
                              <span className={isLow ? 'text-rose-600 font-semibold' : 'text-emerald-700 font-medium'}>
                                {disponibles} disp.
                              </span>
                              {item.unidadesPrestadas > 0 && (
                                <span className="text-amber-800 ml-1">
                                  ({item.unidadesPrestadas} prest.)
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Categoría (Requerido) - Zero-pill clean text rule */}
                        <td className="py-3 px-4 border-r border-slate-200 text-slate-800 font-medium">
                          <span>{item.categoria}</span>
                        </td>

                        {/* Ubicación (Requerido) */}
                        <td className="py-3 px-4 border-r border-slate-200 text-slate-700">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{item.ubicacion}</span>
                          </div>
                        </td>

                        {/* Fecha de Adquisición (Requerido) */}
                        <td className="py-3 px-4 text-center border-r border-slate-200">
                          <div className="inline-flex flex-col items-center">
                            <span className="font-mono tabular-nums text-slate-800">
                              {formatFriendlyDate(item.fechaAdquisicion)}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {calculateAge(item.fechaAdquisicion)}
                            </span>
                          </div>
                        </td>

                        {/* Estado de Conservación */}
                        <td className="py-3 px-4 text-center border-r border-slate-200">
                          <span
                            className={`inline-block text-xs font-medium ${
                              item.estadoConservacion === 'Excelente'
                                ? 'text-emerald-700'
                                : item.estadoConservacion === 'Bueno'
                                ? 'text-blue-700'
                                : item.estadoConservacion === 'Regular'
                                ? 'text-amber-700'
                                : item.estadoConservacion === 'En Reparación'
                                ? 'text-orange-700'
                                : 'text-rose-700'
                            }`}
                          >
                            {item.estadoConservacion}
                          </span>
                        </td>

                        {/* Acciones */}
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => onLendItem(item)}
                              disabled={disponibles <= 0}
                              className={`p-1.5 rounded transition-colors ${
                                disponibles > 0
                                  ? 'text-amber-800 hover:text-amber-950 hover:bg-amber-50'
                                  : 'text-slate-300 cursor-not-allowed'
                              }`}
                              title={
                                disponibles > 0
                                  ? 'Prestar este artículo (abre registro de préstamo)'
                                  : 'Sin unidades disponibles'
                              }
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onViewDetail(item)}
                              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                              title="Ver ficha y código QR"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onEditItem(item)}
                              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                              title="Editar artículo"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteItem(item.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                              title="Eliminar artículo"
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

          <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <span>
              Mostrando <strong className="text-slate-700 font-mono">{filteredItems.length}</strong> de <strong className="text-slate-700 font-mono">{items.length}</strong> artículos registrados
            </span>
            <span className="text-[11px] text-slate-400">
              Registros ordenados por {sortBy === 'nombre' ? 'Nombre' : sortBy === 'cantidad' ? 'Cantidad' : sortBy === 'fecha' ? 'Fecha' : 'Categoría'} ({sortDir === 'asc' ? 'Ascendente' : 'Descendente'})
            </span>
          </div>
        </div>
      ) : (
        /* Grid Card View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const disponibles = Math.max(0, item.cantidad - (item.unidadesPrestadas || 0));
            const isLow = disponibles <= 2;
            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-mono text-xs text-slate-500 font-semibold">
                      {item.codigoPatrimonial}
                    </span>
                    <span
                      className={`text-xs font-semibold ${
                        item.estadoConservacion === 'Excelente'
                          ? 'text-emerald-700'
                          : item.estadoConservacion === 'Bueno'
                          ? 'text-blue-700'
                          : 'text-amber-700'
                      }`}
                    >
                      {item.estadoConservacion}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm mb-1 leading-snug">
                    {item.nombre}
                  </h3>

                  <div className="text-xs text-slate-500 space-y-1 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{item.categoria}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{item.ubicacion}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Adquirido: {formatFriendlyDate(item.fechaAdquisicion)} ({calculateAge(item.fechaAdquisicion)})</span>
                    </div>
                    {item.responsable && (
                      <div className="text-[11px] text-slate-400 pt-1">
                        Custodio: {item.responsable}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="font-mono text-xs font-bold text-slate-900 tabular-nums">
                      {item.cantidad} unidades
                    </div>
                    <div className={`text-[11px] ${isLow ? 'text-rose-600 font-semibold' : 'text-slate-500'}`}>
                      {disponibles} disponibles
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onLendItem(item)}
                      disabled={disponibles <= 0}
                      className="px-2.5 py-1 text-xs font-semibold text-white bg-[#0e2a47] hover:bg-[#163a61] disabled:opacity-40 rounded transition-colors"
                      title="Prestar"
                    >
                      Prestar
                    </button>
                    <button
                      onClick={() => onViewDetail(item)}
                      className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded"
                      title="Ficha QR"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onEditItem(item)}
                      className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded"
                      title="Editar"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
