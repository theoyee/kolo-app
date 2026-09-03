'use client';

import { Table, type Column } from './CustomTable';
import { StatusBadge } from './StatusBadge';

// Same "recent orders" shape used in DashboardMockup.tsx — showing how the
// generic Table component replaces that hand-rolled list with something
// reusable across orders, customers, transactions, anywhere tabular data
// shows up in the product.

type Order = {
  id: string;
  item: string;
  customer: string;
  amount: number;
  status: 'Paid' | 'Pending';
};

const orders: Order[] = [
  { id: '1', item: 'Nike Air Force', customer: 'Lumo Foods', amount: 45000, status: 'Paid' },
  { id: '2', item: 'Black Hoodie', customer: 'Apex Stores', amount: 18000, status: 'Paid' },
  { id: '3', item: 'Slides', customer: 'Sarah Collections', amount: 12000, status: 'Paid' },
  { id: '4', item: 'Cap', customer: 'Amaka Collections', amount: 5000, status: 'Pending' },
];

function formatNaira(value: number) {
  return `₦${value.toLocaleString('en-NG')}`;
}

export function RecentOrdersTable() {
  const total = orders.reduce((sum, o) => sum + o.amount, 0);

  const columns: Column<Order>[] = [
    { key: 'item', header: 'item' },
    { key: 'customer', header: 'customer' },
    {
      key: 'amount',
      header: 'amount',
      align: 'right',
      mono: true,
      render: (row) => formatNaira(row.amount),
    },
    {
      key: 'status',
      header: 'status',
      align: 'right',
      render: (row) => (
        <StatusBadge
          label={row.status}
          tone={row.status === 'Paid' ? 'positive' : 'pending'}
        />
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={orders}
      rowKey={(row) => row.id}
      eyebrow="live"
      title="Recent orders"
      onRowClick={(row) => console.log('open order', row.id)}
      footer={
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] text-kolo-muted-light">total</span>
          <span className="font-mono text-lg font-medium text-kolo-ink tabular-nums">
            {formatNaira(total)}
          </span>
        </div>
      }
    />
  );
}