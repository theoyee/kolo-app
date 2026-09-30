"use client";

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { productsApi, inventoryApi, reportsApi } from '@/lib/api';

interface AttentionItem {
  id: string;
  name: string;
  currentStock: number;
  reorderLevel: number;
}

export default function InventoryPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    products: '0',
    stockValue: '₦0',
    lowStock: '0',
    outOfStock: '0',
  });
  const [attentionItems, setAttentionItems] = useState<AttentionItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<AttentionItem | null>(null);
  const [adjustQty, setAdjustQty] = useState('10');
  const [adjustType, setAdjustType] = useState<'RESTOCK' | 'DAMAGE' | 'LOSS' | 'RETURN'>('RESTOCK');
  const [adjustReason, setAdjustReason] = useState('Stock intake');
  const [isAdjusting, setIsAdjusting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [prodRes, valRes] = await Promise.allSettled([
        productsApi.list({ limit: 100 }),
        reportsApi.inventoryValuation(),
        inventoryApi.getLowStock(),
      ]);

      if (prodRes.status === 'fulfilled' && prodRes.value.success && Array.isArray(prodRes.value.data)) {
        const allProducts = prodRes.value.data;
        const totalProds = prodRes.value.meta?.total || allProducts.length;

        const outOfStockItems = allProducts.filter((p: any) => (p.currentStock ?? 0) <= 0);
        const lowStockItems = allProducts.filter(
          (p: any) => (p.currentStock ?? 0) > 0 && (p.currentStock ?? 0) <= (p.minStockAlert ?? 5)
        );

        let stockValStr = '₦0';
        if (valRes.status === 'fulfilled' && valRes.value.success && valRes.value.data) {
          const retVal = valRes.value.data.formattedRetailValuation || valRes.value.data.formattedCostValuation;
          if (retVal && retVal !== '₦0.00') {
            stockValStr = retVal;
          }
        }

        setStats({
          products: String(totalProds),
          stockValue: stockValStr,
          lowStock: String(lowStockItems.length),
          outOfStock: String(outOfStockItems.length),
        });

        // Attention table
        const attention = allProducts
          .filter((p: any) => (p.currentStock ?? 0) <= (p.minStockAlert ?? 5))
          .map((p: any) => ({
            id: p.id,
            name: p.name,
            currentStock: p.currentStock ?? 0,
            reorderLevel: p.minStockAlert ?? 5,
          }));

        setAttentionItems(attention);
      }
    } catch {
      // keep defaults
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    setIsAdjusting(true);

    try {
      const res = await inventoryApi.adjust({
        productId: selectedProduct.id,
        type: adjustType,
        quantity: parseInt(adjustQty, 10) || 1,
        reason: adjustReason.trim() || 'Inventory adjustment',
      });
      if (res.success) {
        toast.success(`Inventory updated for ${selectedProduct.name}!`);
      } else {
        toast.info(`Inventory adjustment saved.`);
      }
      await loadData();
      setSelectedProduct(null);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to adjust inventory.');
    } finally {
      setIsAdjusting(false);
    }
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="m-0 text-[26px] tracking-tight font-bold">Inventory</h1>
        <div className="text-[#6a7872]">Know what you have and what needs attention.</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[14px]">
        {[
          { l: 'Products', v: stats.products },
          { l: 'Stock value', v: stats.stockValue },
          { l: 'Low stock', v: stats.lowStock },
          { l: 'Out of stock', v: stats.outOfStock },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-[#e4eae7] rounded-[13px] p-[17px]">
            <div className="text-[12px] text-[#6a7872]">{s.l}</div>
            <div className="text-[25px] font-[820] my-2">{s.v}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-[#e4eae7] rounded-[13px] p-[17px] mt-[14px] overflow-x-auto">
        <h3 className="m-0 mb-4 text-[15px] font-bold">Stock requiring attention</h3>
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr>
              <th className="text-[#7c8883] text-[11px] font-bold p-[11px_8px] border-b border-[#e4eae7]">Product</th>
              <th className="text-[#7c8883] text-[11px] font-bold p-[11px_8px] border-b border-[#e4eae7]">Current stock</th>
              <th className="text-[#7c8883] text-[11px] font-bold p-[11px_8px] border-b border-[#e4eae7]">Reorder level</th>
              <th className="text-[#7c8883] text-[11px] font-bold p-[11px_8px] border-b border-[#e4eae7]">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [1, 2, 3].map((i) => (
                <tr key={i} className="animate-pulse">
                  <td className="p-[14px_8px] border-b border-[#eef1ef]">
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  </td>
                  <td className="p-[14px_8px] border-b border-[#eef1ef]">
                    <div className="h-5 w-12 bg-gray-200 rounded-full"></div>
                  </td>
                  <td className="p-[14px_8px] border-b border-[#eef1ef]">
                    <div className="h-4 w-8 bg-gray-200 rounded"></div>
                  </td>
                  <td className="p-[14px_8px] border-b border-[#eef1ef]">
                    <div className="h-6 w-20 bg-gray-200 rounded-lg"></div>
                  </td>
                </tr>
              ))
            ) : attentionItems.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-10 text-[#6a7872] text-xs">
                  All inventory healthy! No products currently below reorder levels or out of stock.
                </td>
              </tr>
            ) : (
              attentionItems.map((r) => (
                <tr key={r.id}>
                  <td className="p-[14px_8px] border-b border-[#eef1ef] font-bold">{r.name}</td>
                  <td className="p-[14px_8px] border-b border-[#eef1ef]">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-[10px] font-bold ${
                        r.currentStock === 0
                          ? 'bg-[#fff0f0] text-[#c94444]'
                          : 'bg-[#fff5dc] text-[#b77900]'
                      }`}
                    >
                      {r.currentStock}
                    </span>
                  </td>
                  <td className="p-[14px_8px] border-b border-[#eef1ef] font-mono">{r.reorderLevel}</td>
                  <td className="p-[14px_8px] border-b border-[#eef1ef]">
                    <button
                      onClick={() => {
                        setSelectedProduct(r);
                        setAdjustQty('10');
                        setAdjustReason('Stock restock');
                      }}
                      className="border border-[#e4eae7] bg-white px-3 py-[6px] rounded-lg font-bold text-xs hover:bg-gray-50 cursor-pointer"
                    >
                      Adjust stock
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Adjust Stock Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-[13px] border border-[#e4eae7] w-full max-w-sm p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="m-0 text-base font-bold text-kolo-ink">Adjust stock: {selectedProduct.name}</h3>
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold bg-transparent border-0 cursor-pointer"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAdjustSubmit} className="space-y-4">
              <div>
                <label className="block text-[12px] font-bold mb-1 text-kolo-ink">Type</label>
                <select
                  value={adjustType}
                  onChange={(e) => setAdjustType(e.target.value as any)}
                  className="w-full border border-[#e4eae7] rounded-[9px] px-3 py-2 text-sm outline-none focus:border-[#0d7a55]"
                >
                  <option value="RESTOCK">Restock (Add stock)</option>
                  <option value="DAMAGE">Damage (Remove stock)</option>
                  <option value="LOSS">Loss (Remove stock)</option>
                  <option value="RETURN">Customer Return (Add stock)</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-bold mb-1 text-kolo-ink">Quantity</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(e.target.value)}
                  className="w-full border border-[#e4eae7] rounded-[9px] px-3 py-2 text-sm outline-none focus:border-[#0d7a55]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold mb-1 text-kolo-ink">Reason / Notes</label>
                <input
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. Weekly vendor shipment"
                  className="w-full border border-[#e4eae7] rounded-[9px] px-3 py-2 text-sm outline-none focus:border-[#0d7a55]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2 border border-[#e4eae7] rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdjusting}
                  className="px-4 py-2 bg-[#0d7a55] hover:bg-[#07553d] text-white rounded-lg text-xs font-bold cursor-pointer disabled:opacity-50"
                >
                  {isAdjusting ? 'Saving...' : 'Apply adjustment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
