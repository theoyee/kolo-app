'use client';

import React, { useEffect, useState } from 'react';
import { Table, type Column } from './CustomTable';
import { salesApi } from '@/lib/api';
import { getCachedData, setCachedData } from '@/lib/cache';
import { RecentOrdersWidgetSkeleton } from './Skeleton';

type Order = {
  id: string;
  item: string;
  customer: string;
  amount: number;
  status: 'Paid' | 'Pending';
};

const CACHE_KEY = 'dashboard_recent_orders';

export function RecentOrdersTable({ initialOrders }: { initialOrders?: Order[] }) {
  // Read from in-memory cache immediately if available to prevent layout flash/skeleton
  const cached = !initialOrders ? getCachedData<Order[]>(CACHE_KEY) : null;
  const [orders, setOrders] = useState<Order[]>(initialOrders || cached || []);
  const [isLoading, setIsLoading] = useState(!initialOrders && !cached);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (initialOrders && initialOrders.length > 0) {
      setOrders(initialOrders);
      setIsLoading(false);
      return;
    }

    if (cached && cached.length > 0) {
      setIsLoading(false);
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    salesApi.list({ limit: 5 }).then((res) => {
      if (res.success && Array.isArray(res.data)) {
        const mapped: Order[] = res.data.map((s: any) => ({
          id: s.id,
          item: s.items?.[0]?.productName || s.saleNumber || 'Sale Item',
          customer: s.customer?.fullName || (s.items?.length > 1 ? `+${s.items.length - 1} more items` : 'Walk-in Customer'),
          amount: typeof s.grandTotalNaira === 'number' ? s.grandTotalNaira : Math.round((s.grandTotalKobo || 0) / 100),
          status: s.paymentStatus === 'SUCCESS' ? 'Paid' : 'Pending',
        }));
        setOrders(mapped);
        setCachedData(CACHE_KEY, mapped);
      }
      setIsLoading(false);
      setIsRefreshing(false);
    }).catch(() => {
      setIsLoading(false);
      setIsRefreshing(false);
    });
  }, [initialOrders]);

  const total = orders.reduce((sum, o) => sum + o.amount, 0);

  const columns: Column<Order>[] = [
    { key: 'item', header: 'item' },
    { key: 'customer', header: 'customer' },
    {
      key: 'amount',
      header: 'amount',
      align: 'right',
      mono: true,
      render: (row) => `₦${row.amount.toLocaleString('en-NG')}`,
    },
    {
      key: 'status',
      header: 'status',
      align: 'right',
      render: (row) => (
        <span
          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
            row.status === 'Paid' ? 'bg-[#eaf7f2] text-[#07553d]' : 'bg-[#fff5dc] text-[#b77900]'
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  if (isLoading) {
    return <RecentOrdersWidgetSkeleton />;
  }

  return (
    <div className="bg-white border border-[#D9CFB8] rounded-xl p-5 shadow-xs flex flex-col justify-between h-[360px] relative">
      <div>
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-[13px] font-bold text-kolo-ink m-0 flex items-center gap-2">
            Recent transactions
            {isRefreshing && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#0d7a55] animate-ping" title="Updating in background" />
            )}
          </h4>
          <span className="text-[10px] font-mono text-[#8A7F6D] uppercase">Latest</span>
        </div>

        {orders.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#8A7F6D]">
            No transactions recorded yet today.
          </div>
        ) : (
          <div className="overflow-hidden">
            <Table<Order>
              columns={columns}
              data={orders}
              rowKey={(o) => o.id}
            />
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-[#D9CFB8] flex justify-between items-center text-xs">
        <span className="text-[#8A7F6D] font-mono">Total recent</span>
        <span className="font-mono font-bold text-kolo-ink">₦{total.toLocaleString('en-NG')}</span>
      </div>
    </div>
  );
}
