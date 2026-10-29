import React, { useState, useEffect } from 'react';
import { X, Check, BookOpen, Calendar, User, Phone, Tag, Clock } from 'lucide-react';
import { LoanRecord, InventoryItem } from '../types/inventory';

interface LoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (loan: LoanRecord, affectedItemId?: string, qtyDelta?: number) => void;
  inventoryItems: InventoryItem[];
  initialLoan?: LoanRecord | null;
  preselectedItem?: InventoryItem | null;
}

export const LoanModal: React.FC<LoanModalProps> = ({
  isOpen,
  onClose,
  onSave,
  inventoryItems,
  initialLoan,
  preselectedItem
}) => {
  const [nombre, setNombre] = useState('');
  const [contacto, setContacto] = useState('');
  const [tipoPrenda, setTipoPrenda] = useState('');
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [cantidadPrestada, setCantidadPrestada] = useState<number>(1);
  const [estadoAlPrestar, setEstadoAlPrestar] = useState('Excelente - Operativo y limpio');
  const [fechaPrestamo, setFechaPrestamo] = useState(new Date().toISOString().slice(0, 10));
  
  // Set default return date to 7 days from now
  const defaultReturnDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  };
  const [fechaDevolucion, setFechaDevolucion] = useState(defaultReturnDate());
  const [estadoAlDevolver, setEstadoAlDevolver] = useState('Pendiente');
  const [observaciones, setObservaciones] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialLoan) {
      setNombre(initialLoan.nombre);
      setContacto(initialLoan.contacto);
      setTipoPrenda(initialLoan.tipoPrenda);
      setSelectedItemId(initialLoan.itemId || '');
      setCantidadPrestada(initialLoan.cantidadPrestada || 1);
      setEstadoAlPrestar(initialLoan.estadoAlPrestar);
      setFechaPrestamo(initialLoan.fechaPrestamo);
      setFechaDevolucion(initialLoan.fechaDevolucion);
      setEstadoAlDevolver(initialLoan.estadoAlDevolver);
      setObservaciones(initialLoan.observaciones || '');
    } else if (preselectedItem) {
      setNombre('');
      setContacto('');
      setTipoPrenda(preselectedItem.nombre);
      setSelectedItemId(preselectedItem.id);
      setCantidadPrestada(1);
      setEstadoAlPrestar(`${preselectedItem.estadoConservacion} - Buen estado físico`);
      setFechaPrestamo(new Date().toISOString().slice(0, 10));
      setFechaDevolucion(defaultReturnDate());
      setEstadoAlDevolver('Pendiente');
      setObservaciones('');
    } else {
      setNombre('');
      setContacto('');
      setTipoPrenda('');
      setSelectedItemId('');
      setCantidadPrestada(1);
      setEstadoAlPrestar('Excelente - Operativo y completo');
      setFechaPrestamo(new Date().toISOString().slice(0, 10));
      setFechaDevolucion(defaultReturnDate());
      setEstadoAlDevolver('Pendiente');
      setObservaciones('');
    }
    setErrors({});
  }, [initialLoan, preselectedItem, isOpen]);

  if (!isOpen) return null;

  const handleItemSelect = (itemId: string) => {
    setSelectedItemId(itemId);
    if (!itemId) return;
    const item = inventoryItems.find((i) => i.id === itemId);
    if (item) {
      setTipoPrenda(item.nombre);
      setEstadoAlPrestar(`${item.estadoConservacion} - ${item.categoria}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!nombre.trim()) {
      newErrors.nombre = 'El nombre del solicitante es obligatorio';
    }
    if (!contacto.trim()) {
      newErrors.contacto = 'El contacto (teléfono/email/grado) es obligatorio';
    }
    if (!tipoPrenda.trim()) {
      newErrors.tipoPrenda = 'El tipo de prenda o artículo es obligatorio';
    }
    if (!estadoAlPrestar.trim()) {
      newErrors.estadoAlPrestar = 'Indique el estado al prestar';
    }
    if (!fechaPrestamo) {
      newErrors.fechaPrestamo = 'La fecha de préstamo es obligatoria';
    }
    if (!fechaDevolucion) {
      newErrors.fechaDevolucion = 'La fecha de devolución es obligatoria';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const isReturned =
      estadoAlDevolver.toLowerCase().includes('devuelto') ||
      estadoAlDevolver.toLowerCase().includes('recibido');

    const loanToSave: LoanRecord = {
      id: initialLoan ? initialLoan.id : `loan-${Date.now()}`,
      nombre: nombre.trim(),
      contacto: contacto.trim(),
      tipoPrenda: tipoPrenda.trim(),
      itemId: selectedItemId || undefined,
      cantidadPrestada: Number(cantidadPrestada) || 1,
      estadoAlPrestar: estadoAlPrestar.trim(),
      fechaPrestamo,
      fechaDevolucion,
      estadoAlDevolver: estadoAlDevolver.trim() || 'Pendiente',
      firma: initialLoan?.firma || '',
      devuelto: initialLoan ? initialLoan.devuelto : isReturned,
      fechaDevolucionReal: initialLoan?.fechaDevolucionReal,
      observaciones: observaciones.trim() || undefined
    };

    onSave(loanToSave, selectedItemId, Number(cantidadPrestada) || 1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-8">
        {/* Header styling matching user screenshot navy theme */}
        <div className="px-6 py-4 bg-[#0e2a47] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-amber-300" />
            <div>
              <h2 className="text-base font-bold tracking-tight">
                {initialLoan ? 'Editar Registro de Préstamo' : 'Registrar Préstamo de Prenda / Material'}
              </h2>
              <p className="text-xs text-slate-300">
                Control de salidas, responsables y estado de entrega y devolución
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Solicitante: Nombre & Contacto */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Nombre (Alumno / Docente) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej. Valeria Gómez Pardo (10° A)"
                  className={`w-full pl-9 pr-3 py-2 text-sm bg-white border rounded-md shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#0e2a47] ${
                    errors.nombre ? 'border-red-500 bg-red-50/20' : 'border-slate-300'
                  }`}
                />
              </div>
              {errors.nombre && <p className="text-xs text-red-600 mt-1">{errors.nombre}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Contacto <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={contacto}
                  onChange={(e) => setContacto(e.target.value)}
                  placeholder="Teléfono / Email / Ext. / Aula"
                  className={`w-full pl-9 pr-3 py-2 text-sm bg-white border rounded-md shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#0e2a47] ${
                    errors.contacto ? 'border-red-500 bg-red-50/20' : 'border-slate-300'
                  }`}
                />
              </div>
              {errors.contacto && <p className="text-xs text-red-600 mt-1">{errors.contacto}</p>}
            </div>
          </div>

          {/* Vincular con Inventario Escolar (opcional) & Tipo de Prenda */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Vincular a Artículo del Inventario Escolar (Opcional)
              </label>
              <select
                value={selectedItemId}
                onChange={(e) => handleItemSelect(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#0e2a47]"
              >
                <option value="">-- Artículo externo o manual --</option>
                {inventoryItems.map((item) => {
                  const disp = Math.max(0, item.cantidad - (item.unidadesPrestadas || 0));
                  return (
                    <option key={item.id} value={item.id}>
                      {item.codigoPatrimonial} - {item.nombre} (Disponibles: {disp} / Total: {item.cantidad}) - {item.ubicacion}
                    </option>
                  );
                })}
              </select>
              <p className="text-[11px] text-slate-500 mt-1">
                Al seleccionar un artículo del inventario, se descontará automáticamente de las unidades disponibles hasta su devolución.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Tipo de Prenda / Artículo <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={tipoPrenda}
                    onChange={(e) => setTipoPrenda(e.target.value)}
                    placeholder="Ej. Chaqueta de Gala Banda de Guerra Talla M"
                    className={`w-full pl-9 pr-3 py-2 text-sm bg-white border rounded-md shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#0e2a47] ${
                      errors.tipoPrenda ? 'border-red-500' : 'border-slate-300'
                    }`}
                  />
                </div>
                {errors.tipoPrenda && (
                  <p className="text-xs text-red-600 mt-1">{errors.tipoPrenda}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Cantidad
                </label>
                <input
                  type="number"
                  min="1"
                  value={cantidadPrestada}
                  onChange={(e) => setCantidadPrestada(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 text-sm font-mono tabular-nums bg-white border border-slate-300 rounded-md shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#0e2a47]"
                />
              </div>
            </div>
          </div>

          {/* Estado al Prestar (Columna requerida en la imagen del usuario) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Estado al Prestar <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={estadoAlPrestar}
              onChange={(e) => setEstadoAlPrestar(e.target.value)}
              placeholder="Ej. Excelente - Limpia y con botones completos; o Sin rayones ni desgaste"
              className={`w-full px-3 py-2 text-sm bg-white border rounded-md shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#0e2a47] ${
                errors.estadoAlPrestar ? 'border-red-500' : 'border-slate-300'
              }`}
            />
            {errors.estadoAlPrestar && (
              <p className="text-xs text-red-600 mt-1">{errors.estadoAlPrestar}</p>
            )}
          </div>

          {/* Fechas: Fecha de Préstamo & Fecha de Devolución */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Fecha de Préstamo <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="date"
                  value={fechaPrestamo}
                  onChange={(e) => setFechaPrestamo(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 text-sm font-mono bg-white border rounded-md shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#0e2a47] ${
                    errors.fechaPrestamo ? 'border-red-500' : 'border-slate-300'
                  }`}
                />
              </div>
              {errors.fechaPrestamo && (
                <p className="text-xs text-red-600 mt-1">{errors.fechaPrestamo}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Fecha de Devolución Prevista <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="date"
                  value={fechaDevolucion}
                  onChange={(e) => setFechaDevolucion(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 text-sm font-mono bg-white border rounded-md shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#0e2a47] ${
                    errors.fechaDevolucion ? 'border-red-500' : 'border-slate-300'
                  }`}
                />
              </div>
              {errors.fechaDevolucion && (
                <p className="text-xs text-red-600 mt-1">{errors.fechaDevolucion}</p>
              )}
            </div>
          </div>

          {/* Estado al Devolver (Columna requerida en la imagen del usuario) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Estado al Devolver
            </label>
            <div className="space-y-1.5">
              <select
                value={estadoAlDevolver}
                onChange={(e) => setEstadoAlDevolver(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#0e2a47]"
              >
                <option value="Pendiente">Pendiente (Aún no devuelto)</option>
                <option value="Devuelto en excelente estado">Devuelto en excelente estado</option>
                <option value="Devuelto en buen estado con desgaste normal">Devuelto en buen estado con desgaste normal</option>
                <option value="Devuelto con observaciones / Requiere limpieza">Devuelto con observaciones / Requiere limpieza</option>
                <option value="Devuelto dañado / Requiere reparación">Devuelto dañado / Requiere reparación</option>
                <option value="Extraviado / No devuelto">Extraviado / No devuelto</option>
              </select>
            </div>
          </div>

          {/* Observaciones y Motivo */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Motivo del Préstamo y Observaciones
            </label>
            <textarea
              rows={2}
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Ej. Evento cívico, práctica de laboratorio, torneo deportivo..."
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#0e2a47]"
            />
          </div>

          {/* Footer buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-[#0e2a47] hover:bg-[#163a61] rounded-md transition-colors shadow-xs"
            >
              <Check className="w-4 h-4" />
              <span>{initialLoan ? 'Actualizar Préstamo' : 'Confirmar Préstamo'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
