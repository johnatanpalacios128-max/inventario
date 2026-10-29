import React from 'react';
import {
  BarChart3,
  Layers,
  MapPin,
  Tag,
  BookOpen,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { InventoryItem, LoanRecord } from '../types/inventory';

interface StatsViewProps {
  items: InventoryItem[];
  loans: LoanRecord[];
}

export const StatsView: React.FC<StatsViewProps> = ({ items, loans }) => {
  const totalArticulos = items.length;
  const totalUnidades = items.reduce((acc, curr) => acc + curr.cantidad, 0);
  const totalPrestadas = items.reduce((acc, curr) => acc + (curr.unidadesPrestadas || 0), 0);
  const totalDisponibles = totalUnidades - totalPrestadas;
  const totalValorEstimado = items.reduce(
    (acc, curr) => acc + (curr.valorEstimado ? curr.valorEstimado * curr.cantidad : 0),
    0
  );

  // Group by category
  const categoryCounts = items.reduce<Record<string, { count: number; units: number }>>((acc, item) => {
    if (!acc[item.categoria]) {
      acc[item.categoria] = { count: 0, units: 0 };
    }
    acc[item.categoria].count += 1;
    acc[item.categoria].units += item.cantidad;
    return acc;
  }, {});

  const sortedCategories = Object.entries(categoryCounts).sort(
    (a, b) => b[1].units - a[1].units
  );

  // Group by location
  const locationCounts = items.reduce<Record<string, { count: number; units: number }>>((acc, item) => {
    if (!acc[item.ubicacion]) {
      acc[item.ubicacion] = { count: 0, units: 0 };
    }
    acc[item.ubicacion].count += 1;
    acc[item.ubicacion].units += item.cantidad;
    return acc;
  }, {});

  const sortedLocations = Object.entries(locationCounts).sort(
    (a, b) => b[1].units - a[1].units
  );

  // Condition breakdown
  const conditionCounts = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.estadoConservacion] = (acc[item.estadoConservacion] || 0) + item.cantidad;
    return acc;
  }, {});

  // Loan statuses
  const todayStr = new Date().toISOString().slice(0, 10);
  const activeLoans = loans.filter((l) => !l.devuelto);
  const overdueLoans = loans.filter((l) => !l.devuelto && l.fechaDevolucion < todayStr);
  const returnedLoans = loans.filter((l) => l.devuelto);

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Métricas y Resumen del Inventario Escolar
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Visualización cuantitativa de activos educativos, distribución en recintos escolares y flujo de préstamos.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
          <div className="p-4 bg-slate-50 rounded-lg">
            <span className="text-xs text-slate-500 font-medium block">Total Bienes Escolares</span>
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {totalUnidades}
            </span>
            <span className="text-xs text-slate-400 block mt-0.5">
              en {totalArticulos} tipos de artículo
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg">
            <span className="text-xs text-slate-500 font-medium block">Unidades Disponibles</span>
            <span className="text-2xl font-bold font-mono text-emerald-700 tabular-nums">
              {totalDisponibles}
            </span>
            <span className="text-xs text-slate-400 block mt-0.5">
              {totalUnidades > 0 ? `${Math.round((totalDisponibles / totalUnidades) * 100)}% en bodega` : '0%'}
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg">
            <span className="text-xs text-slate-500 font-medium block">Unidades en Préstamo</span>
            <span className="text-2xl font-bold font-mono text-amber-800 tabular-nums">
              {totalPrestadas}
            </span>
            <span className="text-xs text-slate-400 block mt-0.5">
              {activeLoans.length} solicitudes activas
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg">
            <span className="text-xs text-slate-500 font-medium block">Valoración Estimada</span>
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              ${totalValorEstimado.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 block mt-0.5">
              activos inventariados
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categorías */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#0e2a47]" />
              <h2 className="text-sm font-bold text-slate-900">Distribución por Categoría</h2>
            </div>
            <span className="text-xs font-mono text-slate-500">{sortedCategories.length} categorías</span>
          </div>

          <div className="space-y-3">
            {sortedCategories.map(([cat, data]) => {
              const pct = totalUnidades > 0 ? (data.units / totalUnidades) * 100 : 0;
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-800">{cat}</span>
                    <span className="font-mono text-slate-500 tabular-nums">
                      {data.units} unids ({Math.round(pct)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#0e2a47] h-full rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ubicaciones Escolares */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#0e2a47]" />
              <h2 className="text-sm font-bold text-slate-900">Existencias por Ubicación</h2>
            </div>
            <span className="text-xs font-mono text-slate-500">{sortedLocations.length} recintos</span>
          </div>

          <div className="space-y-3">
            {sortedLocations.map(([ubi, data]) => {
              const pct = totalUnidades > 0 ? (data.units / totalUnidades) * 100 : 0;
              return (
                <div key={ubi} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-800">{ubi}</span>
                    <span className="font-mono text-slate-500 tabular-nums">
                      {data.units} unids
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Condition & Loans Analysis Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Estado de Conservación */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900">Estado de Conservación del Mobiliario y Equipos</h2>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-emerald-50 rounded-lg text-center">
              <span className="text-[11px] text-emerald-800 font-semibold uppercase block">Excelente</span>
              <span className="text-xl font-bold font-mono text-emerald-900 tabular-nums">
                {conditionCounts['Excelente'] || 0}
              </span>
              <span className="text-[10px] text-emerald-700 block">unidades</span>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg text-center">
              <span className="text-[11px] text-blue-800 font-semibold uppercase block">Bueno</span>
              <span className="text-xl font-bold font-mono text-blue-900 tabular-nums">
                {conditionCounts['Bueno'] || 0}
              </span>
              <span className="text-[10px] text-blue-700 block">unidades</span>
            </div>

            <div className="p-3 bg-amber-50 rounded-lg text-center">
              <span className="text-[11px] text-amber-800 font-semibold uppercase block">Regular / Rep.</span>
              <span className="text-xl font-bold font-mono text-amber-900 tabular-nums">
                {(conditionCounts['Regular'] || 0) + (conditionCounts['En Reparación'] || 0)}
              </span>
              <span className="text-[10px] text-amber-700 block">requieren atención</span>
            </div>
          </div>
        </div>

        {/* Flujo de Préstamos */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#0e2a47]" />
            <h2 className="text-sm font-bold text-slate-900">Estado del Módulo de Préstamos</h2>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-amber-50 rounded-lg text-center">
              <span className="text-[11px] text-amber-800 font-semibold uppercase block">Pendientes</span>
              <span className="text-xl font-bold font-mono text-amber-900 tabular-nums">
                {activeLoans.length}
              </span>
              <span className="text-[10px] text-amber-700 block">en uso</span>
            </div>

            <div className="p-3 bg-red-50 rounded-lg text-center">
              <span className="text-[11px] text-red-800 font-semibold uppercase block">Atrasados</span>
              <span className="text-xl font-bold font-mono text-red-900 tabular-nums">
                {overdueLoans.length}
              </span>
              <span className="text-[10px] text-red-700 block">fecha vencida</span>
            </div>

            <div className="p-3 bg-emerald-50 rounded-lg text-center">
              <span className="text-[11px] text-emerald-800 font-semibold uppercase block">Devueltos</span>
              <span className="text-xl font-bold font-mono text-emerald-900 tabular-nums">
                {returnedLoans.length}
              </span>
              <span className="text-[10px] text-emerald-700 block">reintegrados</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
