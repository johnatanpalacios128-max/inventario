import { InventoryItem, TableRowRecord, INITIAL_ITEMS, INITIAL_TABLE_ROWS } from '../types/inventory';

const INVENTORY_KEY = 'edustock_inventory_items_v2';
const TABLE_KEY = 'edustock_table_records_v2';

export function getStoredInventory(): InventoryItem[] {
  try {
    const raw = localStorage.getItem(INVENTORY_KEY);
    if (!raw) {
      localStorage.setItem(INVENTORY_KEY, JSON.stringify(INITIAL_ITEMS));
      return INITIAL_ITEMS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading inventory from localStorage', e);
    return INITIAL_ITEMS;
  }
}

export function saveInventory(items: InventoryItem[]): void {
  try {
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Error saving inventory to localStorage', e);
  }
}

export function getStoredTableRows(): TableRowRecord[] {
  try {
    const raw = localStorage.getItem(TABLE_KEY);
    if (!raw) {
      localStorage.setItem(TABLE_KEY, JSON.stringify(INITIAL_TABLE_ROWS));
      return INITIAL_TABLE_ROWS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading table records from localStorage', e);
    return INITIAL_TABLE_ROWS;
  }
}

export function saveTableRows(rows: TableRowRecord[]): void {
  try {
    localStorage.setItem(TABLE_KEY, JSON.stringify(rows));
  } catch (e) {
    console.error('Error saving table records to localStorage', e);
  }
}

export function clearTable(): TableRowRecord[] {
  localStorage.setItem(TABLE_KEY, JSON.stringify([]));
  return [];
}

// Export Table to CSV with exact headers from image
export function exportTableToCSV(rows: TableRowRecord[]): void {
  const headers = [
    'Nombre',
    'Contacto',
    'Tipo de prenda',
    'Estado al prestar',
    'Fecha de préstamo',
    'Fecha de devolución',
    'Estado al devolver',
    'Firma'
  ];

  const escapeCSV = (val: string | number | boolean | undefined) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const csvRows = rows.map(r => [
    escapeCSV(r.nombre),
    escapeCSV(r.contacto),
    escapeCSV(r.tipoPrenda),
    escapeCSV(r.estadoAlPrestar),
    escapeCSV(r.fechaPrestamo),
    escapeCSV(r.fechaDevolucion),
    escapeCSV(r.estadoAlDevolver),
    escapeCSV(r.firma ? 'Firmado' : '')
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...csvRows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `planilla_prestamos_prendas_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const exportLoansToCSV = exportTableToCSV;

// Export Inventory to CSV
export function exportInventoryToCSV(items: InventoryItem[]): void {
  const headers = [
    'Código Patrimonial',
    'Nombre del Artículo',
    'Cantidad',
    'Categoría',
    'Ubicación',
    'Fecha de Adquisición',
    'Estado Conservación',
    'Responsable'
  ];

  const escapeCSV = (val: string | number | undefined) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = items.map(item => [
    escapeCSV(item.codigoPatrimonial),
    escapeCSV(item.nombre),
    escapeCSV(item.cantidad),
    escapeCSV(item.categoria),
    escapeCSV(item.ubicacion),
    escapeCSV(item.fechaAdquisicion),
    escapeCSV(item.estadoConservacion),
    escapeCSV(item.responsable || '')
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `inventario_escolar_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
