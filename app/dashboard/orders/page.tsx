"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { Plus, CheckCheck, PackageCheck } from 'lucide-react';
import {
  ordersApi,
  productsApi,
  customersApi,
  toKobo,
  formatNGN,
} from '@/lib/api';

interface OrderRow {
  id: string;
  orderNumber: string;
  customer: string;
  customerId?: string;
  items: string;
  amount: string;
  amountKobo: number;
  payment: 'Paid' | 'Pending';
  status: 'Completed' | 'Processing' | 'Pending';
  rawStatus: string;
}

export default function OrdersPage() {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Pending' | 'Processing' | 'Completed'>('All');
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFulfillModal, setShowFulfillModal] = useState<OrderRow | null>(null);
  const [fulfillMethod, setFulfillMethod] = useState<'POS_TERMINAL' | 'CASH' | 'BANK_TRANSFER'>('POS_TERMINAL');
  const [isFulfilling, setIsFulfilling] = useState(false);

  // New order form
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [orderQty, setOrderQty] = useState('1');
  const [orderNotes, setOrderNotes] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const res = await ordersApi.list({ limit: 50 });
      if (res.success && Array.isArray(res.data)) {
        const mapped: OrderRow[] = res.data.map((o: any) => {
          let statusLabel: OrderRow['status'] = 'Processing';
          let paymentLabel: OrderRow['payment'] = 'Paid';

          if (o.status === 'COMPLETED') {
            statusLabel = 'Completed';
            paymentLabel = 'Paid';
          } else if (o.status === 'CONFIRMED') {
            statusLabel = 'Processing';
            paymentLabel = 'Paid';
          } else {
            statusLabel = 'Pending';
            paymentLabel = 'Pending';
          }

          const itemsText = o.items && o.items.length > 0
            ? `${o.items[0].product?.name || 'Item'}${o.items.length > 1 ? ` +${o.items.length - 1} more` : ''}`
            : 'Order items';

          const totalKobo = o.totalKobo ?? (typeof o.totalNaira === 'number' ? toKobo(o.totalNaira) : (o.total || 0));

          return {
            id: o.id,
            orderNumber: o.orderNumber ? `#${o.orderNumber.replace(/[^0-9]/g, '').slice(-4) || o.orderNumber}` : '#1025',
            customer: o.customer?.fullName || 'Walk-in Customer',
            customerId: o.customerId,
            items: itemsText,
            amount: formatNGN(totalKobo, true),
            amountKobo: totalKobo,
            payment: paymentLabel,
            status: statusLabel,
            rawStatus: o.status,
          };
        });
        setOrders(mapped);
      }
    } catch {
      // keep fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    customersApi.list({ limit: 50 }).then((res) => {
      if (res.success && Array.isArray(res.data)) setCustomers(res.data);
    });
    productsApi.list({ limit: 50 }).then((res) => {
      if (res.success && Array.isArray(res.data)) setProducts(res.data);
    });
  }, []);

  const filteredOrders = useMemo(() => {
    if (activeFilter === 'All') return orders;
    return orders.filter((o) => o.status === activeFilter);
  }, [orders, activeFilter]);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    setIsCreating(true);

    const prod = products.find((p) => p.id === selectedProduct);
    const priceKobo = prod?.sellingPriceKobo || prod?.sellingPrice || 500000;
    const qty = parseInt(orderQty, 10) || 1;

    try {
      const res = await ordersApi.create({
        customerId: selectedCustomer || undefined,
        items: [
          {
            productId: selectedProduct,
            quantity: qty,
            unitSellingPriceKobo: priceKobo,
            unitPriceKobo: priceKobo,
          },
        ],
        notes: orderNotes.trim() || undefined,
      });

      if (res.success) {
        toast.success('Order/Quote created successfully!');
        setShowCreateModal(false);
        setSelectedCustomer('');
        setSelectedProduct('');
        setOrderQty('1');
        setOrderNotes('');
        loadOrders();
      } else {
        toast.error(res.error?.message || 'Failed to create order');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create order');
    } finally {
      setIsCreating(false);
    }
  };

  const handleFulfillOrder = async () => {
    if (!showFulfillModal) return;
    setIsFulfilling(true);

    try {
      const res = await ordersApi.fulfill(showFulfillModal.id, {
        payments: [
          {
            method: fulfillMethod,
            amountKobo: showFulfillModal.amountKobo,
          },
        ],
      });

      if (res.success) {
        toast.success(`Order ${showFulfillModal.orderNumber} fulfilled into a completed sale!`);
        setShowFulfillModal(null);
        loadOrders();
      } else {
        toast.error(res.error?.message || 'Failed to fulfill order');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to fulfill order');
    } finally {
      setIsFulfilling(false);
    }
  };

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="m-0 text-[26px] tracking-tight font-bold text-kolo-ink">Customer Orders & Wholesale</h1>
          <div className="text-[#6a7872]">Track wholesale orders from pending quotes to fulfilled sales.</div>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-[#0d7a55] hover:bg-[#07553d] text-white px-3.5 py-2 rounded-lg font-bold text-xs cursor-pointer flex items-center gap-1.5 transition shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          + New Quote / Order
        </button>
      </div>

      <div className="flex gap-[7px] mb-[18px] overflow-x-auto">
        {(['All', 'Pending', 'Processing', 'Completed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`border px-3.5 py-2 rounded-lg whitespace-nowrap cursor-pointer text-xs transition-colors ${
              activeFilter === tab
                ? 'bg-[#eaf7f2] text-[#07553d] font-bold border-[#e4eae7]'
                : 'bg-white text-[#6a7872] border-[#e4eae7] hover:bg-gray-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white border border-[#e4eae7] rounded-[13px] p-[17px] overflow-x-auto shadow-xs">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr>
              <th className="text-[#7c8883] text-[11px] font-bold p-[11px_8px] border-b border-[#e4eae7]">Order</th>
              <th className="text-[#7c8883] text-[11px] font-bold p-[11px_8px] border-b border-[#e4eae7]">Customer</th>
              <th className="text-[#7c8883] text-[11px] font-bold p-[11px_8px] border-b border-[#e4eae7]">Items</th>
              <th className="text-[#7c8883] text-[11px] font-bold p-[11px_8px] border-b border-[#e4eae7]">Amount</th>
              <th className="text-[#7c8883] text-[11px] font-bold p-[11px_8px] border-b border-[#e4eae7]">Status</th>
              <th className="text-[#7c8883] text-[11px] font-bold p-[11px_8px] border-b border-[#e4eae7]">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [1, 2, 3, 4].map((i) => (
                <tr key={i} className="animate-pulse">
                  <td className="p-[14px_8px] border-b border-[#eef1ef]">
                    <div className="h-4 w-16 bg-gray-200 rounded"></div>
                  </td>
                  <td className="p-[14px_8px] border-b border-[#eef1ef]">
                    <div className="h-4 w-28 bg-gray-200 rounded"></div>
                  </td>
                  <td className="p-[14px_8px] border-b border-[#eef1ef]">
                    <div className="h-3.5 w-36 bg-gray-200 rounded"></div>
                  </td>
                  <td className="p-[14px_8px] border-b border-[#eef1ef]">
                    <div className="h-3.5 w-20 bg-gray-200 rounded"></div>
                  </td>
                  <td className="p-[14px_8px] border-b border-[#eef1ef]">
                    <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
                  </td>
                  <td className="p-[14px_8px] border-b border-[#eef1ef]">
                    <div className="h-6 w-20 bg-gray-200 rounded-md"></div>
                  </td>
                </tr>
              ))
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-[#6a7872] text-xs">
                  No orders recorded under this status. Click <span className="font-bold text-[#0d7a55]">+ New Quote / Order</span> to record one.
                </td>
              </tr>
            ) : (
              filteredOrders.map((r) => (
                <tr key={r.id} className="hover:bg-[#FAF9F5]/40 transition-colors">
                  <td className="p-[14px_8px] border-b border-[#eef1ef] font-bold text-kolo-ink">{r.orderNumber}</td>
                  <td className="p-[14px_8px] border-b border-[#eef1ef] text-sm">{r.customer}</td>
                  <td className="p-[14px_8px] border-b border-[#eef1ef] text-sm text-[#6a7872]">{r.items}</td>
                  <td className="p-[14px_8px] border-b border-[#eef1ef] font-mono text-sm font-bold text-[#2E6F4D]">
                    {r.amount}
                  </td>
                  <td className="p-[14px_8px] border-b border-[#eef1ef]">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        r.status === 'Pending'
                          ? 'bg-[#fff5dc] text-[#b77900]'
                          : r.status === 'Processing'
                          ? 'bg-[#eaf7f2] text-[#07553d]'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="p-[14px_8px] border-b border-[#eef1ef]">
                    {r.status !== 'Completed' ? (
                      <button
                        onClick={() => setShowFulfillModal(r)}
                        className="inline-flex items-center gap-1 bg-[#2E6F4D] hover:bg-[#25583d] text-white px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer transition"
                      >
                        <PackageCheck className="w-3 h-3" />
                        Fulfill Sale
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCheck className="w-3.5 h-3.5" />
                        Completed
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Order Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl border border-[#e4eae7] w-full max-w-md p-6 shadow-xl">
            <h3 className="m-0 text-base font-bold text-kolo-ink mb-4">Create Wholesale / Customer Order</h3>
            <form onSubmit={handleCreateOrder} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold mb-1 text-kolo-ink">Customer (Optional)</label>
                <select
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                  className="w-full border border-[#e4eae7] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#0d7a55]"
                >
                  <option value="">Walk-in Customer</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.fullName} ({c.phone || 'No phone'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-kolo-ink">Select Product *</label>
                <select
                  required
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full border border-[#e4eae7] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#0d7a55]"
                >
                  <option value="">Choose item...</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {formatNGN(p.sellingPriceKobo || p.sellingPrice * 100, true)} ({p.currentStock ?? 0} in stock)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-kolo-ink">Quantity</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={orderQty}
                  onChange={(e) => setOrderQty(e.target.value)}
                  className="w-full border border-[#e4eae7] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#0d7a55]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-kolo-ink">Notes / Delivery Address</label>
                <input
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="e.g. Deliver to Lekki Phase 1 on Friday"
                  className="w-full border border-[#e4eae7] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#0d7a55]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#e4eae7]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 border border-[#e4eae7] rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-4 py-1.5 bg-[#0d7a55] hover:bg-[#07553d] text-white rounded-lg text-xs font-bold cursor-pointer disabled:opacity-50"
                >
                  {isCreating ? 'Creating...' : 'Create Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fulfill Order Modal */}
      {showFulfillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl border border-[#e4eae7] w-full max-w-sm p-6 shadow-xl">
            <h3 className="m-0 text-base font-bold text-kolo-ink">
              Fulfill Order {showFulfillModal.orderNumber}
            </h3>
            <p className="text-xs text-[#6a7872] mt-1 mb-4">
              Fulfilling will deduct items from live inventory and record a verified sale of{' '}
              <strong className="text-kolo-ink">{showFulfillModal.amount}</strong>.
            </p>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold mb-1 text-kolo-ink">Payment Received Via</label>
                <select
                  value={fulfillMethod}
                  onChange={(e) => setFulfillMethod(e.target.value as any)}
                  className="w-full border border-[#e4eae7] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#0d7a55]"
                >
                  <option value="POS_TERMINAL">POS Terminal</option>
                  <option value="BANK_TRANSFER">Bank Transfer (NUBAN)</option>
                  <option value="CASH">Cash in Hand</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#e4eae7]">
                <button
                  type="button"
                  onClick={() => setShowFulfillModal(null)}
                  className="px-3 py-1.5 border border-[#e4eae7] rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isFulfilling}
                  onClick={handleFulfillOrder}
                  className="px-4 py-1.5 bg-[#0d7a55] hover:bg-[#07553d] text-white rounded-lg text-xs font-bold cursor-pointer disabled:opacity-50"
                >
                  {isFulfilling ? 'Fulfilling...' : 'Confirm & Complete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
