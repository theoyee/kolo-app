"use client";

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Plus, Tag, Search } from 'lucide-react';
import {
  productsApi,
  inventoryApi,
  toKobo,
  formatNGN,
} from '@/lib/api';

interface ProductRow {
  id: string;
  name: string;
  category: string;
  price: string;
  stock: string;
  costPrice: string;
  status: 'In stock' | 'Low stock' | 'Out of stock';
}

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    categoryId: '',
    costPriceNaira: '',
    sellingPriceNaira: '',
    initialStock: '10',
    minStockAlert: '5',
  });

  const loadCategories = async () => {
    try {
      const res = await productsApi.categories();
      if (res.success && Array.isArray(res.data)) {
        setCategories(res.data);
      }
    } catch {
      // ignore
    }
  };

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const res = await productsApi.list({
        limit: 100,
        search: search.trim() || undefined,
        categoryId: selectedCategory || undefined,
      });

      if (res.success && Array.isArray(res.data)) {
        const mapped: ProductRow[] = res.data.map((p: any) => {
          const stock = p.currentStock ?? 0;
          const minAlert = p.minStockAlert ?? 5;
          let status: ProductRow['status'] = 'In stock';
          if (stock <= 0) status = 'Out of stock';
          else if (stock <= minAlert) status = 'Low stock';

          const sellKobo = p.sellingPriceKobo ?? (p.sellingPrice ? toKobo(p.sellingPrice) : 0);
          const costKobo = p.costPriceKobo ?? (p.costPrice ? toKobo(p.costPrice) : 0);

          return {
            id: p.id,
            name: p.name,
            category: p.category?.name || 'General',
            price: formatNGN(sellKobo, true),
            costPrice: formatNGN(costKobo, true),
            stock: String(stock),
            status,
          };
        });
        setProducts(mapped);
      }
    } catch {
      // keep existing
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, [selectedCategory]);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      const res = await productsApi.createCategory({ name: newCategoryName.trim() });
      if (res.success) {
        toast.success(`Category "${newCategoryName}" created!`);
        setNewCategoryName('');
        setShowCategoryModal(false);
        loadCategories();
      } else {
        toast.error(res.error?.message || 'Failed to create category');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create category');
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.sellingPriceNaira) return;
    setLoading(true);

    const costKobo = toKobo(formData.costPriceNaira || Number(formData.sellingPriceNaira) * 0.7);
    const sellingKobo = toKobo(formData.sellingPriceNaira);
    const sku = formData.sku.trim() || `SKU-${Date.now().toString().slice(-6)}`;
    const stockNum = parseInt(formData.initialStock, 10) || 0;
    const minAlert = parseInt(formData.minStockAlert, 10) || 5;

    try {
      const res = await productsApi.create({
        name: formData.name.trim(),
        sku,
        costPriceKobo: costKobo,
        sellingPriceKobo: sellingKobo,
        categoryId: formData.categoryId || null,
        minStockAlert: minAlert,
      });

      if (res.success && res.data?.id) {
        if (stockNum > 0) {
          await inventoryApi.adjust({
            productId: res.data.id,
            type: 'RESTOCK',
            quantity: stockNum,
            reason: 'Initial catalog intake',
          });
        }
        await loadProducts();
        setShowAddModal(false);
        toast.success(`Product "${formData.name.trim()}" added to catalog!`);
        setFormData({
          name: '',
          sku: '',
          categoryId: '',
          costPriceNaira: '',
          sellingPriceNaira: '',
          initialStock: '10',
          minStockAlert: '5',
        });
      } else {
        toast.error(res.error?.message || 'Failed to create product.');
      }
    } catch (err: any) {
      toast.error(err?.message || 'An error occurred while creating product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <div>
          <h1 className="m-0 text-[26px] tracking-tight font-bold text-kolo-ink">Products Catalogue</h1>
          <div className="text-[#6a7872]">Manage products, integer Kobo pricing, and inventory alerts.</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCategoryModal(true)}
            className="border border-[#e4eae7] bg-white hover:bg-gray-50 text-kolo-ink px-3.5 py-2 rounded-lg font-bold text-xs cursor-pointer flex items-center gap-1.5 transition"
          >
            <Tag className="w-3.5 h-3.5" />
            + Category
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#0d7a55] hover:bg-[#07553d] text-white px-3.5 py-2 rounded-lg font-bold text-xs cursor-pointer flex items-center gap-1.5 transition shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            + Add product
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadProducts()}
            placeholder="Search by product name or SKU..."
            className="w-full bg-white border border-[#e4eae7] rounded-lg pl-9 pr-3 py-2 text-xs outline-none focus:border-[#0d7a55]"
          />
        </div>
        {categories.length > 0 && (
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white border border-[#e4eae7] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#0d7a55] cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="bg-white border border-[#e4eae7] rounded-[13px] p-[17px] overflow-x-auto shadow-xs">
        <table className="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr>
              <th className="text-[#7c8883] text-[11px] font-bold p-[11px_8px] border-b border-[#e4eae7]">Product</th>
              <th className="text-[#7c8883] text-[11px] font-bold p-[11px_8px] border-b border-[#e4eae7]">Category</th>
              <th className="text-[#7c8883] text-[11px] font-bold p-[11px_8px] border-b border-[#e4eae7]">Cost Price</th>
              <th className="text-[#7c8883] text-[11px] font-bold p-[11px_8px] border-b border-[#e4eae7]">Selling Price</th>
              <th className="text-[#7c8883] text-[11px] font-bold p-[11px_8px] border-b border-[#e4eae7]">Stock</th>
              <th className="text-[#7c8883] text-[11px] font-bold p-[11px_8px] border-b border-[#e4eae7]">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="animate-pulse">
                  <td className="p-[14px_8px] border-b border-[#eef1ef]">
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  </td>
                  <td className="p-[14px_8px] border-b border-[#eef1ef]">
                    <div className="h-3.5 w-20 bg-gray-200 rounded"></div>
                  </td>
                  <td className="p-[14px_8px] border-b border-[#eef1ef]">
                    <div className="h-3.5 w-16 bg-gray-200 rounded"></div>
                  </td>
                  <td className="p-[14px_8px] border-b border-[#eef1ef]">
                    <div className="h-3.5 w-16 bg-gray-200 rounded"></div>
                  </td>
                  <td className="p-[14px_8px] border-b border-[#eef1ef]">
                    <div className="h-3.5 w-8 bg-gray-200 rounded"></div>
                  </td>
                  <td className="p-[14px_8px] border-b border-[#eef1ef]">
                    <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
                  </td>
                </tr>
              ))
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-[#6a7872] text-xs">
                  No products in catalogue yet. Click <span className="font-bold text-[#0d7a55]">+ Add product</span> above to add your first item.
                </td>
              </tr>
            ) : (
              products.map((r) => (
                <tr key={r.id} className="hover:bg-[#FAF9F5]/40 transition-colors">
                  <td className="p-[14px_8px] border-b border-[#eef1ef] font-bold text-kolo-ink">{r.name}</td>
                  <td className="p-[14px_8px] border-b border-[#eef1ef] text-sm text-[#6a7872]">{r.category}</td>
                  <td className="p-[14px_8px] border-b border-[#eef1ef] font-mono text-sm text-gray-500">{r.costPrice}</td>
                  <td className="p-[14px_8px] border-b border-[#eef1ef] font-mono text-sm font-bold text-[#2E6F4D]">{r.price}</td>
                  <td className="p-[14px_8px] border-b border-[#eef1ef] font-mono text-sm">{r.stock}</td>
                  <td className="p-[14px_8px] border-b border-[#eef1ef]">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        r.status === 'Low stock'
                          ? 'bg-[#fff5dc] text-[#b77900]'
                          : r.status === 'Out of stock'
                          ? 'bg-[#fff0f0] text-[#c94444]'
                          : 'bg-[#eaf7f2] text-[#07553d]'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl border border-[#e4eae7] w-full max-w-md p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="m-0 text-base font-bold text-kolo-ink">Add New Product (Kobo Precision)</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold bg-transparent border-0 cursor-pointer"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold mb-1 text-kolo-ink">Product name *</label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Vintage Denim Jacket"
                  className="w-full border border-[#e4eae7] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#0d7a55]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1 text-kolo-ink">SKU</label>
                  <input
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="Auto-generated if empty"
                    className="w-full border border-[#e4eae7] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#0d7a55]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 text-kolo-ink">Category</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full border border-[#e4eae7] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#0d7a55]"
                  >
                    <option value="">General</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1 text-kolo-ink">Cost price (₦)</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={formData.costPriceNaira}
                    onChange={(e) => setFormData({ ...formData, costPriceNaira: e.target.value })}
                    placeholder="e.g. 15000"
                    className="w-full border border-[#e4eae7] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#0d7a55]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 text-kolo-ink">Selling price (₦) *</label>
                  <input
                    required
                    type="number"
                    min="0"
                    step="any"
                    value={formData.sellingPriceNaira}
                    onChange={(e) => setFormData({ ...formData, sellingPriceNaira: e.target.value })}
                    placeholder="e.g. 25000"
                    className="w-full border border-[#e4eae7] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#0d7a55]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1 text-kolo-ink">Initial stock</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.initialStock}
                    onChange={(e) => setFormData({ ...formData, initialStock: e.target.value })}
                    className="w-full border border-[#e4eae7] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#0d7a55]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 text-kolo-ink">Low stock alert</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.minStockAlert}
                    onChange={(e) => setFormData({ ...formData, minStockAlert: e.target.value })}
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
                  disabled={loading}
                  className="px-4 py-1.5 bg-[#0d7a55] hover:bg-[#07553d] text-white rounded-lg text-xs font-bold cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl border border-[#e4eae7] w-full max-w-sm p-5 shadow-xl">
            <h3 className="m-0 text-base font-bold text-kolo-ink mb-3">Create Category</h3>
            <form onSubmit={handleCreateCategory} className="space-y-3">
              <div>
                <label className="block text-xs font-bold mb-1 text-kolo-ink">Category Name</label>
                <input
                  required
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g. Footwear, Groceries, Fabrics"
                  className="w-full border border-[#e4eae7] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#0d7a55]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-3 py-1.5 border rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0d7a55] hover:bg-[#07553d] text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
