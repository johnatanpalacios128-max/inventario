import React, { useState, useEffect } from 'react';
import { X, Check, Tag, MapPin, Calendar, Hash, ShieldCheck, UserCheck, DollarSign, FileText } from 'lucide-react';
import { InventoryItem, CATEGORIAS_DEFAULT, UBICACIONES_DEFAULT, ESTADOS_CONSERVACION } from '../types/inventory';

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: InventoryItem) => void;
  initialItem?: InventoryItem | null;
}

export const ItemModal: React.FC<ItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialItem
}) => {
  const [nombre, setNombre] = useState('');
  const [cantidad, setCantidad] = useState<number>(1);
  const [categoria, setCategoria] = useState<string>(CATEGORIAS_DEFAULT[0]);
  const [customCategoria, setCustomCategoria] = useState('');
  const [isCustomCategoria, setIsCustomCategoria] = useState(false);
  const [ubicacion, setUbicacion] = useState<string>(UBICACIONES_DEFAULT[0]);
  const [customUbicacion, setCustomUbicacion] = useState('');
  const [isCustomUbicacion, setIsCustomUbicacion] = useState(false);
  const [fechaAdquisicion, setFechaAdquisicion] = useState(new Date().toISOString().slice(0, 10));
  const [codigoPatrimonial, setCodigoPatrimonial] = useState('');
  const [estadoConservacion, setEstadoConservacion] = useState<InventoryItem['estadoConservacion']>('Excelente');
  const [responsable, setResponsable] = useState('');
  const [valorEstimado, setValorEstimado] = useState<string>('');
  const [notas, setNotas] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialItem) {
      setNombre(initialItem.nombre);
      setCantidad(initialItem.cantidad);
      
      if ((CATEGORIAS_DEFAULT as readonly string[]).includes(initialItem.categoria)) {
        setCategoria(initialItem.categoria);
        setIsCustomCategoria(false);
        setCustomCategoria('');
      } else {
        setCategoria('custom');
        setIsCustomCategoria(true);
        setCustomCategoria(initialItem.categoria);
      }

      if ((UBICACIONES_DEFAULT as readonly string[]).includes(initialItem.ubicacion)) {
        setUbicacion(initialItem.ubicacion);
        setIsCustomUbicacion(false);
        setCustomUbicacion('');
      } else {
        setUbicacion('custom');
        setIsCustomUbicacion(true);
        setCustomUbicacion(initialItem.ubicacion);
      }

      setFechaAdquisicion(initialItem.fechaAdquisicion);
      setCodigoPatrimonial(initialItem.codigoPatrimonial);
      setEstadoConservacion(initialItem.estadoConservacion);
      setResponsable(initialItem.responsable || '');
      setValorEstimado(initialItem.valorEstimado !== undefined ? String(initialItem.valorEstimado) : '');
      setNotas(initialItem.notas || '');
    } else {
      // Reset form
      setNombre('');
      setCantidad(1);
      setCategoria(CATEGORIAS_DEFAULT[0]);
      setIsCustomCategoria(false);
      setCustomCategoria('');
      setUbicacion(UBICACIONES_DEFAULT[0]);
      setIsCustomUbicacion(false);
      setCustomUbicacion('');
      setFechaAdquisicion(new Date().toISOString().slice(0, 10));
      // Auto-generate SKU
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      setCodigoPatrimonial(`ESC-${new Date().getFullYear()}-${randomSuffix}`);
      setEstadoConservacion('Excelente');
      setResponsable('');
      setValorEstimado('');
      setNotas('');
    }
    setErrors({});
  }, [initialItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!nombre.trim()) {
      newErrors.nombre = 'El nombre del artículo es obligatorio';
    }
    if (cantidad === undefined || cantidad < 0 || isNaN(cantidad)) {
      newErrors.cantidad = 'La cantidad debe ser un número mayor o igual a 0';
    }
    const finalCategoria = isCustomCategoria ? customCategoria.trim() : categoria;
    if (!finalCategoria) {
      newErrors.categoria = 'La categoría es obligatoria';
    }
    const finalUbicacion = isCustomUbicacion ? customUbicacion.trim() : ubicacion;
    if (!finalUbicacion) {
      newErrors.ubicacion = 'La ubicación es obligatoria';
    }
    if (!fechaAdquisicion) {
      newErrors.fechaAdquisicion = 'La fecha de adquisición es obligatoria';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const itemToSave: InventoryItem = {
      id: initialItem ? initialItem.id : `item-${Date.now()}`,
      codigoPatrimonial: codigoPatrimonial.trim() || `ESC-${Date.now().toString().slice(-6)}`,
      nombre: nombre.trim(),
      cantidad: Number(cantidad),
      categoria: finalCategoria,
      ubicacion: finalUbicacion,
      fechaAdquisicion,
      estadoConservacion,
      unidadesPrestadas: initialItem ? initialItem.unidadesPrestadas : 0,
      responsable: responsable.trim() || undefined,
      valorEstimado: valorEstimado ? Number(valorEstimado) : undefined,
      notas: notas.trim() || undefined
    };

    onSave(itemToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0e2a47] text-white flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold tracking-tight">
              {initialItem ? 'Editar Artículo de Inventario' : 'Registrar Nuevo Artículo Escolar'}
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Complete los campos requeridos para el catálogo institucional
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Nombre del Artículo (Obligatorio) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Nombre del Artículo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Proyector Epson FH52, Balón Mikasa #5, Microscopio Óptico..."
              className={`w-full px-3 py-2 text-sm bg-white border rounded-md shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#0e2a47] ${
                errors.nombre ? 'border-red-500 bg-red-50/30' : 'border-slate-300'
              }`}
            />
            {errors.nombre && <p className="text-xs text-red-600 mt-1">{errors.nombre}</p>}
          </div>

          {/* Grid: Cantidad & Código Patrimonial */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Cantidad en Existencia <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={cantidad}
                  onChange={(e) => setCantidad(parseInt(e.target.value) || 0)}
                  className={`w-full px-3 py-2 text-sm font-mono tabular-nums bg-white border rounded-md shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#0e2a47] ${
                    errors.cantidad ? 'border-red-500' : 'border-slate-300'
                  }`}
                />
              </div>
              {errors.cantidad && <p className="text-xs text-red-600 mt-1">{errors.cantidad}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Código / SKU Patrimonial
              </label>
              <div className="relative">
                <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={codigoPatrimonial}
                  onChange={(e) => setCodigoPatrimonial(e.target.value)}
                  placeholder="ESC-2024-001"
                  className="w-full pl-9 pr-3 py-2 text-sm font-mono bg-white border border-slate-300 rounded-md shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#0e2a47]"
                />
              </div>
            </div>
          </div>

          {/* Grid: Categoría & Ubicación (Obligatorios) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Categoría */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Categoría <span className="text-red-500">*</span>
              </label>
              {!isCustomCategoria ? (
                <div className="space-y-1.5">
                  <select
                    value={categoria}
                    onChange={(e) => {
                      if (e.target.value === 'custom') {
                        setIsCustomCategoria(true);
                      } else {
                        setCategoria(e.target.value);
                      }
                    }}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#0e2a47]"
                  >
                    {CATEGORIAS_DEFAULT.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="custom">+ Otra categoría personalizada...</option>
                  </select>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <input
                    type="text"
                    value={customCategoria}
                    onChange={(e) => setCustomCategoria(e.target.value)}
                    placeholder="Escriba nueva categoría..."
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#0e2a47]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomCategoria(false);
                      setCategoria(CATEGORIAS_DEFAULT[0]);
                    }}
                    className="text-xs text-slate-500 hover:text-slate-800 underline"
                  >
                    Volver a categorías predeterminadas
                  </button>
                </div>
              )}
              {errors.categoria && <p className="text-xs text-red-600 mt-1">{errors.categoria}</p>}
            </div>

            {/* Ubicación */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Ubicación <span className="text-red-500">*</span>
              </label>
              {!isCustomUbicacion ? (
                <div className="space-y-1.5">
                  <select
                    value={ubicacion}
                    onChange={(e) => {
                      if (e.target.value === 'custom') {
                        setIsCustomUbicacion(true);
                      } else {
                        setUbicacion(e.target.value);
                      }
                    }}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#0e2a47]"
                  >
                    {UBICACIONES_DEFAULT.map((ubi) => (
                      <option key={ubi} value={ubi}>
                        {ubi}
                      </option>
                    ))}
                    <option value="custom">+ Otra ubicación personalizada...</option>
                  </select>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <input
                    type="text"
                    value={customUbicacion}
                    onChange={(e) => setCustomUbicacion(e.target.value)}
                    placeholder="Escriba nueva ubicación escolar..."
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#0e2a47]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomUbicacion(false);
                      setUbicacion(UBICACIONES_DEFAULT[0]);
                    }}
                    className="text-xs text-slate-500 hover:text-slate-800 underline"
                  >
                    Volver a ubicaciones predeterminadas
                  </button>
                </div>
              )}
              {errors.ubicacion && <p className="text-xs text-red-600 mt-1">{errors.ubicacion}</p>}
            </div>
          </div>

          {/* Grid: Fecha de Adquisición & Estado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Fecha de Adquisición <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="date"
                  value={fechaAdquisicion}
                  onChange={(e) => setFechaAdquisicion(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 text-sm font-mono bg-white border rounded-md shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#0e2a47] ${
                    errors.fechaAdquisicion ? 'border-red-500' : 'border-slate-300'
                  }`}
                />
              </div>
              {errors.fechaAdquisicion && (
                <p className="text-xs text-red-600 mt-1">{errors.fechaAdquisicion}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Estado de Conservación
              </label>
              <select
                value={estadoConservacion}
                onChange={(e) =>
                  setEstadoConservacion(e.target.value as InventoryItem['estadoConservacion'])
                }
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#0e2a47]"
              >
                {ESTADOS_CONSERVACION.map((est) => (
                  <option key={est} value={est}>
                    {est}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid: Responsable & Valor Estimado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Docente / Custodio Responsable
              </label>
              <div className="relative">
                <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={responsable}
                  onChange={(e) => setResponsable(e.target.value)}
                  placeholder="Ej. Prof. Carlos Mendoza"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-md shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#0e2a47]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Valor Estimado Unitario (USD / Moneda)
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={valorEstimado}
                  onChange={(e) => setValorEstimado(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-9 pr-3 py-2 text-sm font-mono tabular-nums bg-white border border-slate-300 rounded-md shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#0e2a47]"
                />
              </div>
            </div>
          </div>

          {/* Notas y Especificaciones */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Notas, Accesorios o Especificaciones
            </label>
            <textarea
              rows={2}
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Detalles de marca, modelo, accesorios incluidos, caja original o estado particular..."
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#0e2a47]"
            />
          </div>

          {/* Footer actions */}
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
              <span>{initialItem ? 'Guardar Cambios' : 'Registrar en Inventario'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
