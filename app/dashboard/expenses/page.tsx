"use client";

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Plus, Fuel, Home, Briefcase, Zap, Wrench, ShoppingCart, Megaphone, Truck, MoreHorizontal } from 'lucide-react';
import {
  expensesApi,
  toKobo,
  formatNGN,
} from '@/lib/api';

interface ExpenseRow {
  id: string;
  description: string;
  category: string;
  rawCategory: string;
  amount: string;
  date: string;
  rawAmountKobo: number;
}

const CATEGORY_MAP: Record<string, { label: string; icon: React.ReactNode }> = {
  DIESEL_GENERATOR: { label: 'Diesel / Generator', icon: <Fuel className="w-3.5 h-3.5 text-amber-600" /> },
  RENT: { label: 'Rent', icon: <Home className="w-3.5 h-3.5 text-blue-600" /> },
  SALARIES: { label: 'Salaries & Staff', icon: <Briefcase className="w-3.5 h-3.5 text-emerald-600" /> },
  UTILITIES: { label: 'Electricity / NEPA', icon: <Zap className="w-3.5 h-3.5 text-yellow-600" /> },
  MAINTENANCE: { label: 'Repairs & Maint.', icon: <Wrench className="w-3.5 h-3.5 text-gray-600" /> },
  SUPPLIES: { label: 'Inventory / Supplies', icon: <ShoppingCart className="w-3.5 h-3.5 text-teal-600" /> },
  MARKETING: { label: 'Marketing & Ads', icon: <Megaphone className="w-3.5 h-3.5 text-purple-600" /> },
  LOGISTICS: { label: 'Delivery & Logistics', icon: <Truck className="w-3.5 h-3.5 text-indigo-600" /> },
  OTHER: { label: 'Other Expenses', icon: <MoreHorizontal className="w-3.5 h-3.5 text-slate-600" /> },
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<ExpenseRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('');
  const [summaryData, setSummaryData] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: '',
    category: 'DIESEL_GENERATOR',
    amountNaira: '',
    notes: '',
    payee: '',
  });

  const loadExpenses = async () => {
    setIsLoading(true);
    try {
      const [listRes, sumRes] = await Promise.allSettled([
        expensesApi.list({ limit: 100, category: selectedFilterCategory || undefined }),
        expensesApi.summary(),
      ]);

      if (listRes.status === 'fulfilled' && listRes.value.success && Array.isArray(listRes.value.data)) {
        const mapped: ExpenseRow[] = listRes.value.data.map((e: any) => {
          const kobo = e.amountKobo ?? (typeof e.amountNaira === 'number' ? toKobo(e.amountNaira) : (e.amount || 0));
          const dateObj = new Date(e.date || e.createdAt);
          const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

          return {
            id: e.id,
            description: e.title || 'Expense',
            category: CATEGORY_MAP[e.category]?.label || e.category || 'Other',
            rawCategory: e.category,
            amount: formatNGN(kobo, true),
            date: formattedDate,
            rawAmountKobo: kobo,
          };
        });
        setExpenses(mapped);
      }

      if (sumRes.status === 'fulfilled' && sumRes.value.success && sumRes.value.data) {
        setSummaryData(sumRes.value.data);
      }
    } catch {
      // keep defaults
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, [selectedFilterCategory]);

  const totalKobo = expenses.reduce((sum, e) => sum + e.rawAmountKobo, 0);
  const dieselKobo = expenses.filter((e) => e.rawCategory === 'DIESEL_GENERATOR').reduce((s, e) => s + e.rawAmountKobo, 0);
  const logisticsKobo = expenses.filter((e) => e.rawCategory === 'LOGISTICS').reduce((s, e) => s + e.rawAmountKobo, 0);
  const rentKobo = expenses.filter((e) => e.rawCategory === 'RENT').reduce((s, e) => s + e.rawAmountKobo, 0);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.amountNaira) return;
    setSubmitting(true);

    try {
      const koboAmount = toKobo(form.amountNaira);
      const res = await expensesApi.create({
        title: form.title.trim(),
        category: form.category as any,
        amountKobo: koboAmount,
        notes: form.notes.trim() || undefined,
        payee: form.payee.trim() || undefined,
      });

      if (res.success) {
        await loadExpenses();
        setShowAddModal(false);
        toast.success(`Expense of ${formatNGN(koboAmount, true)} recorded!`);
        setForm({ title: '', category: 'DIESEL_GENERATOR', amountNaira: '', notes: '', payee: '' });
      } else {
        toast.error(res.error?.message || 'Failed to record expense.');
      }
    } catch (err: any) {
      toast.error(err?.message || 'An error occurred while saving expense.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <div>
          <h1 className="m-0 text-[26px] tracking-tight font-bold text-kolo-ink">Operating Expenses</h1>
          <div className="text-[#6a7872]">Track generator diesel, rent, logistics, and real operating costs.</div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#0d7a55] hover:bg-[#07553d] text-white px-3.5 py-2 rounded-lg font-bold text-xs cursor-pointer flex items-center gap-1.5 transition shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          + Record Expense
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[14px]">
        {[
          { l: 'Total Expenses', v: summaryData?.formattedTotalExpenses || formatNGN(totalKobo, true) },
          { l: 'Diesel / Generator', v: formatNGN(dieselKobo, true) },
          { l: 'Logistics / Delivery', v: formatNGN(logisticsKobo, true) },
          { l: 'Rent & Premises', v: formatNGN(rentKobo, true) },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-[#e4eae7] rounded-[13px] p-[17px] shadow-xs">
            <div className="text-[12px] text-[#6a7872]">{s.l}</div>
            <div className="text-[22px] font-black font-mono text-kolo-ink my-1.5">{s.v}</div>
          </div>
        ))}
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-2 overflow-x-auto py-3 my-2">
        <button
          onClick={() => setSelectedFilterCategory('')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
            selectedFilterCategory === ''
              ? 'bg-[#1B2A22] text-white border-[#1B2A22]'
              : 'bg-white text-gray-600 border-[#e4eae7] hover:bg-gray-50'
          }`}
        >
          All Categories
        </button>
        {Object.entries(CATEGORY_MAP).map(([key, item]) => (
          <button
            key={key}
            onClick={() => setSelectedFilterCategory(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1.5 whitespace-nowrap transition ${
              selectedFilterCategory === key
                ? 'bg-[#1B2A22] text-white border-[#1B2A22]'
                : 'bg-white text-gray-600 border-[#e4eae7] hover:bg-gray-50'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      <div className="bg-white border border-[#e4eae7] rounded-[13px] p-[17px] overflow-x-auto shadow-xs">
        <table className="w-full text-left border-collapse min-w-[550px]">
          <thead>
            <tr>
              <th className="text-[#7c8883] text-[11px] font-bold p-[11px_8px] border-b border-[#e4eae7]">Description</th>
              <th className="text-[#7c8883] text-[11px] font-bold p-[11px_8px] border-b border-[#e4eae7]">Category</th>
              <th className="text-[#7c8883] text-[11px] font-bold p-[11px_8px] border-b border-[#e4eae7]">Amount</th>
              <th className="text-[#7c8883] text-[11px] font-bold p-[11px_8px] border-b border-[#e4eae7]">Date</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [1, 2, 3, 4].map((i) => (
                <tr key={i} className="animate-pulse">
                  <td className="p-[14px_8px] border-b border-[#eef1ef]">
                    <div className="h-4 w-36 bg-gray-200 rounded"></div>
                  </td>
                  <td className="p-[14px_8px] border-b border-[#eef1ef]">
                    <div className="h-4 w-28 bg-gray-200 rounded"></div>
                  </td>
                  <td className="p-[14px_8px] border-b border-[#eef1ef]">
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  </td>
                  <td className="p-[14px_8px] border-b border-[#eef1ef]">
                    <div className="h-3.5 w-16 bg-gray-200 rounded"></div>
                  </td>
                </tr>
              ))
            ) : expenses.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-12 text-[#6a7872] text-xs">
                  No expenses recorded in this category yet. Click <span className="font-bold text-[#0d7a55]">+ Record Expense</span> above to add one.
                </td>
              </tr>
            ) : (
              expenses.map((r) => (
                <tr key={r.id} className="hover:bg-[#FAF9F5]/40 transition-colors">
                  <td className="p-[14px_8px] border-b border-[#eef1ef] font-bold text-kolo-ink">{r.description}</td>
                  <td className="p-[14px_8px] border-b border-[#eef1ef] text-sm text-[#6a7872] flex items-center gap-2">
                    {CATEGORY_MAP[r.rawCategory]?.icon}
                    <span>{r.category}</span>
                  </td>
                  <td className="p-[14px_8px] border-b border-[#eef1ef] font-mono font-bold text-sm text-[#c2410c]">{r.amount}</td>
                  <td className="p-[14px_8px] border-b border-[#eef1ef] text-xs text-[#8A7F6D]">{r.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl border border-[#e4eae7] w-full max-w-md p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="m-0 text-base font-bold text-kolo-ink">Record Operating Expense</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold bg-transparent border-0 cursor-pointer"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold mb-1 text-kolo-ink">Expense Title *</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. 50L Diesel for Mikano Generator"
                  className="w-full border border-[#e4eae7] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#0d7a55]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-kolo-ink">Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-[#e4eae7] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#0d7a55]"
                >
                  <option value="DIESEL_GENERATOR">Diesel / Generator Fuel</option>
                  <option value="RENT">Rent & Premises</option>
                  <option value="SALARIES">Salaries & Employee Wages</option>
                  <option value="UTILITIES">Electricity & NEPA</option>
                  <option value="LOGISTICS">Delivery & Dispatch Rider</option>
                  <option value="MARKETING">Marketing & Instagram Ads</option>
                  <option value="SUPPLIES">Packaging, Bags & Supplies</option>
                  <option value="MAINTENANCE">Equipment Repairs & Service</option>
                  <option value="OTHER">Other Operating Cost</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-kolo-ink">Amount in Naira (₦) *</label>
                <input
                  required
                  type="number"
                  min="1"
                  step="any"
                  value={form.amountNaira}
                  onChange={(e) => setForm({ ...form, amountNaira: e.target.value })}
                  placeholder="e.g. 45000"
                  className="w-full border border-[#e4eae7] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#0d7a55]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1 text-kolo-ink">Vendor / Payee</label>
                  <input
                    value={form.payee}
                    onChange={(e) => setForm({ ...form, payee: e.target.value })}
                    placeholder="e.g. TotalEnergies"
                    className="w-full border border-[#e4eae7] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#0d7a55]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 text-kolo-ink">Receipt Ref / Notes</label>
                  <input
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="e.g. Receipt #889"
                    className="w-full border border-[#e4eae7] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#0d7a55]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#e4eae7]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 border border-[#e4eae7] rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 bg-[#0d7a55] hover:bg-[#07553d] text-white rounded-lg text-xs font-bold cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
