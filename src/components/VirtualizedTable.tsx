// src/components/VirtualizedTable.tsx
import React, { useMemo } from 'react';
import { FixedSizeGrid as Grid, GridChildComponentProps } from 'react-window';
import { memo } from 'react';

interface Column<T> {
  key: string;
  header: string;
  width: number;
  render: (item: T, index: number) => React.ReactNode;
  className?: string;
}

interface VirtualizedTableProps<T> {
  items: T[];
  columns: Column<T>[];
  height: number;
  rowHeight: number;
  className?: string;
  onRowClick?: (item: T, index: number) => void;
  emptyMessage?: string;
}

function VirtualizedTable<T>({
  items,
  columns,
  height,
  rowHeight,
  className = '',
  onRowClick,
  emptyMessage = 'No data available',
}: VirtualizedTableProps<T>) {
  const totalWidth = useMemo(() => columns.reduce((sum, col) => sum + col.width, 0), [columns]);

  // Render header
  const header = useMemo(() => (
    <div
      className="flex border-b border-slate-200 bg-slate-50"
      style={{ width: '100%' }}
    >
      {columns.map((column) => (
        <div
          key={column.key}
          className={`px-4 py-2 text-xs font-bold text-slate-600 uppercase tracking-wider ${column.className || ''}`}
          style={{ width: column.width }}
        >
          {column.header}
        </div>
      ))}
    </div>
  ), [columns]);

  // Render cell
  const Cell = memo(({ columnIndex, rowIndex, style, data }: GridChildComponentProps) => {
    const item = (data as any).items[rowIndex];
    const column = (data as any).columns[columnIndex];

    if (!item) return null;

    return (
      <div
        className={`px-4 py-2 text-sm text-slate-700 border-b border-slate-100 hover:bg-slate-50 transition-colors ${
          onRowClick ? 'cursor-pointer' : ''
        } ${column.className || ''}`}
        style={style}
        onClick={() => onRowClick?.(item, rowIndex)}
      >
        {column.render(item, rowIndex)}
      </div>
    );
  });

  Cell.displayName = 'Cell';

  if (items.length === 0) {
    return (
      <div className={`flex items-center justify-center bg-white rounded-sm border border-slate-200 ${className}`} style={{ height }}>
        <p className="text-sm text-slate-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-sm border border-slate-200 overflow-hidden ${className}`}>
      {header}
      <Grid
        columnCount={columns.length}
        columnWidth={(index) => columns[index].width}
        height={height - 40} // Subtract header height
        rowCount={items.length}
        rowHeight={rowHeight}
        width={totalWidth}
        className="overflow-auto"
        itemData={{ items, columns }}
      >
        {Cell}
      </Grid>
    </div>
  );
}

export default memo(VirtualizedTable) as typeof VirtualizedTable;

/**
 * Specialized virtualized table for leads
 */
export interface VirtualizedLeadsTableProps {
  leads: Array<{
    _id: string;
    name: string;
    stage: string;
    urgency?: string;
    serviceSlug?: string;
    locationSlug?: string;
    surface?: string;
  }>;
  height?: number;
  onLeadClick?: (leadId: string) => void;
}

export function VirtualizedLeadsTable({ leads, height = 600, onLeadClick }: VirtualizedLeadsTableProps) {
  const columns = useMemo(() => [
    {
      key: 'name',
      header: 'Name',
      width: 200,
      render: (lead: any) => lead.name ?? 'New lead',
    },
    {
      key: 'stage',
      header: 'Stage',
      width: 150,
      render: (lead: any) => (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700">
          {lead.stage}
        </span>
      ),
    },
    {
      key: 'urgency',
      header: 'Urgency',
      width: 120,
      render: (lead: any) => (
        <span className={`text-xs font-medium ${
          lead.urgency === 'emergency' ? 'text-red-600 font-bold' : 'text-slate-600'
        }`}>
          {lead.urgency ?? 'medium'}
        </span>
      ),
    },
    {
      key: 'service',
      header: 'Service',
      width: 200,
      render: (lead: any) => lead.serviceSlug ?? '-',
    },
    {
      key: 'location',
      header: 'Location',
      width: 200,
      render: (lead: any) => lead.locationSlug ?? '-',
    },
  ], []);

  return (
    <VirtualizedTable
      items={leads}
      columns={columns}
      height={height}
      rowHeight={60}
      onRowClick={(lead) => onLeadClick?.(lead._id)}
    />
  );
}

/**
 * Specialized virtualized table for invoices
 */
export interface VirtualizedInvoicesTableProps {
  invoices: Array<{
    _id: string;
    invoiceNumber: string;
    clientName: string;
    amount: number;
    status: string;
    dueDate: number;
  }>;
  height?: number;
  onInvoiceClick?: (invoiceId: string) => void;
}

export function VirtualizedInvoicesTable({ invoices, height = 600, onInvoiceClick }: VirtualizedInvoicesTableProps) {
  const columns = useMemo(() => [
    {
      key: 'invoiceNumber',
      header: 'Invoice #',
      width: 150,
      render: (invoice: any) => invoice.invoiceNumber,
    },
    {
      key: 'clientName',
      header: 'Client',
      width: 250,
      render: (invoice: any) => invoice.clientName,
    },
    {
      key: 'amount',
      header: 'Amount',
      width: 150,
      render: (invoice: any) => `$${invoice.amount.toFixed(2)}`,
    },
    {
      key: 'status',
      header: 'Status',
      width: 150,
      render: (invoice: any) => {
        const statusColors: Record<string, string> = {
          paid: 'bg-emerald-100 text-emerald-700',
          pending: 'bg-amber-100 text-amber-700',
          overdue: 'bg-red-100 text-red-700',
        };
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            statusColors[invoice.status] || 'bg-slate-100 text-slate-700'
          }`}>
            {invoice.status}
          </span>
        );
      },
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      width: 150,
      render: (invoice: any) => new Date(invoice.dueDate).toLocaleDateString(),
    },
  ], []);

  return (
    <VirtualizedTable
      items={invoices}
      columns={columns}
      height={height}
      rowHeight={60}
      onRowClick={(invoice) => onInvoiceClick?.(invoice._id)}
    />
  );
}
