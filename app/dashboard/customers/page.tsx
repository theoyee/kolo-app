"use client";

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { customersApi } from '@/lib/api';

interface CustomerRow {
  id: string;
  name: string;
  phone: string;
  orders: string;
  totalSpent: string;
  lastPurchase: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    count: '0',
    returning: '0%',
    topCustomer: '₦0',
    avgOrder: '₦0',
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
  });

  const loadCustomers = async () => {
    setIsLoading(true);
    try {
      const res = await customersApi.list({ limit: 100 });
      if (res.success && Array.isArray(res.data)) {
        const total = res.meta?.total || res.data.length;
        setStats((prev) => ({ ...prev, count: String(total) }));

        const mapped: CustomerRow[] = res.data.map((c: any) => {
          const purchases = typeof c.totalPurchasesKobo === 'number'
            ? Math.round(c.totalPurchasesKobo / 100)
            : c.totalPurchases || 0;

          return {
            id: c.id,
            name: c.fullName || 'Customer',
            phone: c.phone || '—',
            orders: String(c.orderCount || c.ordersCount || 0),
            totalSpent: `₦${purchases.toLocaleString()}`,
            lastPurchase: 'Recently',
          };
        });
        setCustomers(mapped);
      }
    } catch {
      // Keep defaults
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim()) return;
    setLoading(true);

    try {
      const res = await customersApi.create({
        fullName: form.fullName.trim(),
        phone: form.phone.trim() || undefined,
        email: form.email.trim() || undefined,
        address: form.address.trim() || undefined,
      });

      if (res.success) {
        await loadCustomers();
        setShowAddModal(false);
        toast.success(`Customer "${form.fullName.trim()}" added successfully!`);
        setForm({ fullName: '', phone: '', email: '', address: '' });
      } else {
        toast.error(res.error?.message || 'Failed to add customer.');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Error occurred while saving customer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <div>
          <h1 className="m-0 text-[26px] tracking-tight font-bold">Customers</h1>
          <div className="text-[#6a7872]">Build relationships from every sale.</div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#0d7a55] hover:bg-[#07553d] text-white px-[14px] py-[10px] rounded-[9px] font-bold cursor-pointer transition-colors"
        >
          + Add customer
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[14px]">
        {[
          { l: 'Customers', v: stats.count, u: '+12 this week' },
          { l: 'Returning', v: stats.returning },
          { l: 'Top customer', v: stats.topCustomer },
          { l: 'Avg. order', v: stats.avgOrder },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-[#e4eae7] rounded-[13px] p-[17px]">
            <div className="text-[12px] text-[#6a7872]">{s.l}</div>
            <div className="text-[25px] font-[820] my-2">{s.v}</div>
            {s.u && <div className="text-[#0d7a55] text-[11px] font-bold">{s.u}</div>}
          </div>
        ))}
      </div>

      <div className="bg-white border border-[#e4eae7] rounded-[13px] p-[17px] mt-[14px] overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr>
              <th className="text-[#7c8883] text-[11px] font-bold p-[11px_8px] border-b border-[#e4eae7]">Customer</th>
              <th className="text-[#7c8883] text-[11px] font-bold p-[11px_8px] border-b border-[#e4eae7]">Phone</th>
              <th className="text-[#7c8883] text-[11px] font-bold p-[11px_8px] border-b border-[#e4eae7]">Orders</th>
              <th className="text-[#7c8883] text-[11px] font-bold p-[11px_8px] border-b border-[#e4eae7]">Total spent</th>
              <th className="text-[#7c8883] text-[11px] font-bold p-[11px_8px] border-b border-[#e4eae7]">Last purchase</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [1, 2, 3, 4].map((i) => (
                <tr key={i} className="animate-pulse">
                  <td className="p-[14px_8px] border-b border-[#eef1ef]">
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  </td>
                  <td className="p-[14px_8px] border-b border-[#eef1ef]">
                    <div className="h-4 w-28 bg-gray-200 rounded"></div>
                  </td>
                  <td className="p-[14px_8px] border-b border-[#eef1ef]">
                    <div className="h-4 w-12 bg-gray-200 rounded"></div>
                  </td>
                  <td className="p-[14px_8px] border-b border-[#eef1ef]">
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  </td>
                  <td className="p-[14px_8px] border-b border-[#eef1ef]">
                    <div className="h-4 w-16 bg-gray-200 rounded"></div>
                  </td>
                </tr>
              ))
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-[#6a7872] text-xs">
                  No customers added yet. Click <span className="font-bold text-[#0d7a55]">+ Add customer</span> above to add your first customer.
                </td>
              </tr>
            ) : (
              customers.map((r) => (
                <tr key={r.id}>
                  <td className="p-[14px_8px] border-b border-[#eef1ef] font-bold">{r.name}</td>
                  <td className="p-[14px_8px] border-b border-[#eef1ef]">{r.phone}</td>
                  <td className="p-[14px_8px] border-b border-[#eef1ef] font-mono">{r.orders}</td>
                  <td className="p-[14px_8px] border-b border-[#eef1ef] font-mono">{r.totalSpent}</td>
                  <td className="p-[14px_8px] border-b border-[#eef1ef]">{r.lastPurchase}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-[13px] border border-[#e4eae7] w-full max-w-md p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="m-0 text-lg font-bold text-kolo-ink">Add new customer</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold bg-transparent border-0 cursor-pointer"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-4">
              <div>
                <label className="block text-[12px] font-bold mb-1.5 text-kolo-ink">Full name *</label>
                <input
                  required
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="e.g. Chioma Eze"
                  className="w-full border border-[#e4eae7] rounded-[9px] px-3 py-2 text-sm outline-none focus:border-[#0d7a55]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold mb-1.5 text-kolo-ink">Phone number</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="e.g. 0802 345 6789"
                  className="w-full border border-[#e4eae7] rounded-[9px] px-3 py-2 text-sm outline-none focus:border-[#0d7a55]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold mb-1.5 text-kolo-ink">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="e.g. chioma@example.com"
                  className="w-full border border-[#e4eae7] rounded-[9px] px-3 py-2 text-sm outline-none focus:border-[#0d7a55]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold mb-1.5 text-kolo-ink">Address</label>
                <input
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="e.g. Lekki Phase 1, Lagos"
                  className="w-full border border-[#e4eae7] rounded-[9px] px-3 py-2 text-sm outline-none focus:border-[#0d7a55]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-[#e4eae7] rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-[#0d7a55] hover:bg-[#07553d] text-white rounded-lg text-xs font-bold cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Save customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
