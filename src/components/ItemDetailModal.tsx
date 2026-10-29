import React from 'react';
import { X, Printer, MapPin, Calendar, Tag, UserCheck, DollarSign, BookOpen, Hash, CheckCircle2 } from 'lucide-react';
import { InventoryItem, LoanRecord } from '../types/inventory';

interface ItemDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem | null;
  loans: LoanRecord[];
  onLendThisItem: (item: InventoryItem) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  isOpen,
  onClose,
  item,
  loans,
  onLendThisItem
}) => {
  if (!isOpen || !item) return null;

  const itemLoans = loans.filter((l) => l.itemId === item.id || l.tipoPrenda.toLowerCase().includes(item.nombre.toLowerCase()));
  const activeLoans = itemLoans.filter((l) => !l.devuelto);
  const disponibles = Math.max(0, item.cantidad - (item.unidadesPrestadas || 0));

  const handlePrintTag = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-8">
        {/* Modal Top */}
        <div className="px-6 py-4 bg-[#0e2a47] text-white flex items-center justify-between no-print">
          <div>
            <span className="text-[11px] font-mono tracking-wider text-amber-300 uppercase">
              Ficha Técnica Patrimonial
            </span>
            <h2 className="text-base font-bold tracking-tight">{item.nombre}</h2>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Printable Tag Card (Official School Barcode Tag) */}
          <div className="p-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                COLEGIO NACIONAL / INVENTARIO DE ACTIVOS
              </span>
              <h3 className="text-base font-bold text-slate-900">{item.nombre}</h3>
              <p className="font-mono text-xs font-bold text-[#0e2a47] tracking-wider">
                ID: {item.codigoPatrimonial}
              </p>
              <div className="text-xs text-slate-500 flex flex-wrap gap-2 justify-center sm:justify-start">
                <span>{item.categoria}</span>
                <span>•</span>
                <span>{item.ubicacion}</span>
                <span>•</span>
                <span>Adq: {item.fechaAdquisicion}</span>
              </div>
            </div>

            {/* Generated Visual QR/Barcode simulation */}
            <div className="flex flex-col items-center bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs shrink-0">
              <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none">
                {/* Simulated QR Code matrix */}
                <rect width="100" height="100" fill="white" />
                {/* Corner 1 */}
                <rect x="5" y="5" width="30" height="30" fill="#0e2a47" />
                <rect x="10" y="10" width="20" height="20" fill="white" />
                <rect x="15" y="15" width="10" height="10" fill="#0e2a47" />
                {/* Corner 2 */}
                <rect x="65" y="5" width="30" height="30" fill="#0e2a47" />
                <rect x="70" y="10" width="20" height="20" fill="white" />
                <rect x="75" y="15" width="10" height="10" fill="#0e2a47" />
                {/* Corner 3 */}
                <rect x="5" y="65" width="30" height="30" fill="#0e2a47" />
                <rect x="10" y="70" width="20" height="20" fill="white" />
                <rect x="15" y="75" width="10" height="10" fill="#0e2a47" />
                {/* Data blocks */}
                <rect x="42" y="8" width="6" height="6" fill="#0e2a47" />
                <rect x="52" y="8" width="6" height="6" fill="#0e2a47" />
                <rect x="45" y="20" width="10" height="6" fill="#0e2a47" />
                <rect x="42" y="35" width="16" height="8" fill="#0e2a47" />
                <rect x="8" y="42" width="24" height="6" fill="#0e2a47" />
                <rect x="8" y="52" width="12" height="6" fill="#0e2a47" />
                <rect x="70" y="45" width="8" height="14" fill="#0e2a47" />
                <rect x="82" y="45" width="12" height="6" fill="#0e2a47" />
                <rect x="42" y="52" width="16" height="12" fill="#0e2a47" />
                <rect x="42" y="70" width="8" height="20" fill="#0e2a47" />
                <rect x="55" y="75" width="15" height="8" fill="#0e2a47" />
                <rect x="75" y="70" width="18" height="18" fill="#0e2a47" />
              </svg>
              <span className="font-mono text-[9px] text-slate-500 mt-1">
                {item.codigoPatrimonial}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block mb-0.5">Cantidad Total</span>
              <span className="text-base font-bold font-mono text-slate-900 tabular-nums">
                {item.cantidad} unidades
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block mb-0.5">Disponibles</span>
              <span className="text-base font-bold font-mono text-emerald-700 tabular-nums">
                {disponibles} unidades
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block mb-0.5">Prestadas</span>
              <span className="text-base font-bold font-mono text-amber-800 tabular-nums">
                {item.unidadesPrestadas || 0} unidades
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block mb-0.5">Categoría</span>
              <span className="font-semibold text-slate-800">{item.categoria}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block mb-0.5">Ubicación</span>
              <span className="font-semibold text-slate-800">{item.ubicacion}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block mb-0.5">Fecha Adquisición</span>
              <span className="font-semibold font-mono text-slate-800">{item.fechaAdquisicion}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block mb-0.5">Estado Conservación</span>
              <span className="font-semibold text-slate-800">{item.estadoConservacion}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block mb-0.5">Custodio / Responsable</span>
              <span className="font-semibold text-slate-800">{item.responsable || 'No asignado'}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block mb-0.5">Valor Estimado</span>
              <span className="font-semibold font-mono text-slate-800">
                {item.valorEstimado ? `$${item.valorEstimado.toLocaleString()}` : 'N/A'}
              </span>
            </div>
          </div>

          {/* Notes */}
          {item.notas && (
            <div className="p-3 bg-slate-50 rounded-lg text-xs">
              <span className="font-semibold text-slate-700 block mb-1">Notas y Especificaciones:</span>
              <p className="text-slate-600">{item.notas}</p>
            </div>
          )}

          {/* Loan History for this Item */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
              <span>Historial de Préstamos de este Artículo ({itemLoans.length})</span>
            </h4>

            {itemLoans.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">
                Este artículo no registra préstamos activos o pasados.
              </p>
            ) : (
              <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-slate-700">
                    <tr>
                      <th className="py-2 px-3">Solicitante</th>
                      <th className="py-2 px-3">Fecha Préstamo</th>
                      <th className="py-2 px-3">Devolución</th>
                      <th className="py-2 px-3">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {itemLoans.map((l) => (
                      <tr key={l.id} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-medium text-slate-800">{l.nombre}</td>
                        <td className="py-2 px-3 font-mono text-slate-600">{l.fechaPrestamo}</td>
                        <td className="py-2 px-3 font-mono text-slate-600">{l.fechaDevolucion}</td>
                        <td className="py-2 px-3">
                          <span className={l.devuelto ? 'text-emerald-700 font-semibold' : 'text-amber-800 font-semibold'}>
                            {l.estadoAlDevolver}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3 no-print">
            <button
              onClick={handlePrintTag}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir Etiqueta con QR</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md"
              >
                Cerrar
              </button>
              {disponibles > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onLendThisItem(item);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0e2a47] hover:bg-[#163a61] rounded-md shadow-xs"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Prestar Artículo</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
