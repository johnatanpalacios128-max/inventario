export interface InventoryItem {
  id: string;
  codigoPatrimonial: string;
  nombre: string;
  cantidad: number;
  categoria: string;
  ubicacion: string;
  fechaAdquisicion: string; // YYYY-MM-DD
  estadoConservacion: 'Excelente' | 'Bueno' | 'Regular' | 'En Reparación' | 'De Baja';
  unidadesPrestadas: number;
  responsable?: string;
  valorEstimado?: number;
  notas?: string;
}

export interface TableRowRecord {
  id: string;
  nombre: string;
  contacto: string;
  tipoPrenda: string;
  itemId?: string;
  cantidadPrestada?: number;
  estadoAlPrestar: string;
  fechaPrestamo: string;
  fechaDevolucion: string;
  estadoAlDevolver: string;
  firma: string; // Signature data URL or text
  devuelto?: boolean;
  fechaDevolucionReal?: string;
  observaciones?: string;
}

// Alias for backwards compatibility
export type LoanRecord = TableRowRecord;

export const CATEGORIAS_DEFAULT = [
  'Tecnología y Cómputo',
  'Laboratorio y Ciencias',
  'Deportes y Educación Física',
  'Uniformes y Prendas Escolares',
  'Mobiliario y Aulas',
  'Instrumentos Musicales y Artes',
  'Biblioteca y Libros',
  'Mantenimiento y Herramientas'
] as const;

export const UBICACIONES_DEFAULT = [
  'Sala de Cómputo 1',
  'Laboratorio de Ciencias',
  'Almacén Deportivo',
  'Camerinos de Indumentaria',
  'Biblioteca Central',
  'Aula de Música',
  'Aulas Primaria',
  'Aulas Secundaria'
] as const;

export const ESTADOS_CONSERVACION = [
  'Excelente',
  'Bueno',
  'Regular',
  'En Reparación',
  'De Baja'
] as const;

// The user requested: "que sea esta tabla y este vacia"
// Starts empty by default!
export const INITIAL_TABLE_ROWS: TableRowRecord[] = [];

export const INITIAL_ITEMS: InventoryItem[] = [];
