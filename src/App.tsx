/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ExcelTableView } from './components/ExcelTableView';
import { InventoryView } from './components/InventoryView';
import { SignatureModal } from './components/SignatureModal';
import { ItemModal } from './components/ItemModal';
import { ItemDetailModal } from './components/ItemDetailModal';
import {
  InventoryItem,
  TableRowRecord,
  INITIAL_TABLE_ROWS,
  INITIAL_ITEMS
} from './types/inventory';
import {
  getStoredTableRows,
  saveTableRows,
  getStoredInventory,
  saveInventory,
  exportTableToCSV
} from './utils/storage';

export default function App() {
  // Starts EMPTY as requested: "que sea esta tabla y este vacia"
  const [tableRows, setTableRows] = useState<TableRowRecord[]>(() => getStoredTableRows());
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(() => getStoredInventory());
  const [activeTab, setActiveTab] = useState<'table' | 'inventory'>('table');

  // Signature modal state
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [activeSigningRowId, setActiveSigningRowId] = useState<string | null>(null);
  const [activeSigningPersonName, setActiveSigningPersonName] = useState<string>('');

  // Inventory modal states
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<InventoryItem | null>(null);

  // Sync to localStorage
  useEffect(() => {
    saveTableRows(tableRows);
  }, [tableRows]);

  useEffect(() => {
    saveInventory(inventoryItems);
  }, [inventoryItems]);

  // Handler for adding a new row to the table
  const handleAddRow = () => {
    const newRow: TableRowRecord = {
      id: `row-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      nombre: '',
      contacto: '',
      tipoPrenda: '',
      estadoAlPrestar: '',
      fechaPrestamo: new Date().toISOString().slice(0, 10),
      fechaDevolucion: '',
      estadoAlDevolver: '',
      firma: ''
    };
    setTableRows((prev) => [...prev, newRow]);
  };

  // Open signature dialog
  const handleOpenSignature = (rowId: string, personName: string) => {
    setActiveSigningRowId(rowId);
    setActiveSigningPersonName(personName || '');
    setIsSignatureModalOpen(true);
  };

  // Save captured signature
  const handleSaveSignature = (signatureData: string) => {
    if (!activeSigningRowId) return;
    setTableRows((prev) =>
      prev.map((r) => (r.id === activeSigningRowId ? { ...r, firma: signatureData } : r))
    );
    setActiveSigningRowId(null);
  };

  // Inventory item actions
  const handleSaveItem = (itemToSave: InventoryItem) => {
    setInventoryItems((prev) => {
      const idx = prev.findIndex((i) => i.id === itemToSave.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = itemToSave;
        return copy;
      }
      return [itemToSave, ...prev];
    });
  };

  const handleDeleteItem = (itemId: string) => {
    if (window.confirm('¿Está seguro de eliminar este artículo del inventario?')) {
      setInventoryItems((prev) => prev.filter((i) => i.id !== itemId));
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onAddRow={handleAddRow}
        onOpenNewItem={() => {
          setEditingItem(null);
          setIsItemModalOpen(true);
        }}
        onExportTable={() => exportTableToCSV(tableRows)}
        onPrint={() => window.print()}
        tableRowsCount={tableRows.length}
        inventoryCount={inventoryItems.length}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-2 sm:px-6 lg:px-8 py-6">
        {activeTab === 'table' ? (
          <ExcelTableView
            rows={tableRows}
            onUpdateRows={setTableRows}
            onOpenSignature={handleOpenSignature}
          />
        ) : (
          <InventoryView
            items={inventoryItems}
            onOpenNewItem={() => {
              setEditingItem(null);
              setIsItemModalOpen(true);
            }}
            onEditItem={(item) => {
              setEditingItem(item);
              setIsItemModalOpen(true);
            }}
            onDeleteItem={handleDeleteItem}
            onLendItem={(item) => {
              // Add row in table with this item name
              const newRow: TableRowRecord = {
                id: `row-${Date.now()}`,
                nombre: '',
                contacto: '',
                tipoPrenda: item.nombre,
                estadoAlPrestar: item.estadoConservacion,
                fechaPrestamo: new Date().toISOString().slice(0, 10),
                fechaDevolucion: '',
                estadoAlDevolver: 'Pendiente',
                firma: ''
              };
              setTableRows((prev) => [...prev, newRow]);
              setActiveTab('table');
            }}
            onViewDetail={(item) => {
              setDetailItem(item);
              setIsDetailModalOpen(true);
            }}
            onQuickUpdateQuantity={(itemId, newQty) => {
              setInventoryItems((prev) =>
                prev.map((i) => (i.id === itemId ? { ...i, cantidad: newQty } : i))
              );
            }}
          />
        )}
      </main>

      {/* Modals */}
      <SignatureModal
        isOpen={isSignatureModalOpen}
        onClose={() => {
          setIsSignatureModalOpen(false);
          setActiveSigningRowId(null);
        }}
        onSaveSignature={handleSaveSignature}
        personName={activeSigningPersonName}
      />

      <ItemModal
        isOpen={isItemModalOpen}
        onClose={() => {
          setIsItemModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveItem}
        initialItem={editingItem}
      />

      <ItemDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setDetailItem(null);
        }}
        item={detailItem}
        loans={tableRows}
        onLendThisItem={(item) => {
          const newRow: TableRowRecord = {
            id: `row-${Date.now()}`,
            nombre: '',
            contacto: '',
            tipoPrenda: item.nombre,
            estadoAlPrestar: item.estadoConservacion,
            fechaPrestamo: new Date().toISOString().slice(0, 10),
            fechaDevolucion: '',
            estadoAlDevolver: 'Pendiente',
            firma: ''
          };
          setTableRows((prev) => [...prev, newRow]);
          setActiveTab('table');
        }}
      />

      {/* Clean Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            Tabla oficial de préstamo de prendas y bienes escolares
          </p>
          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
            <span>Nombre</span>
            <span>·</span>
            <span>Contacto</span>
            <span>·</span>
            <span>Tipo de prenda</span>
            <span>·</span>
            <span>Estado al prestar</span>
            <span>·</span>
            <span>Fecha de préstamo</span>
            <span>·</span>
            <span>Fecha de devolución</span>
            <span>·</span>
            <span>Estado al devolver</span>
            <span>·</span>
            <span>Firma</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
