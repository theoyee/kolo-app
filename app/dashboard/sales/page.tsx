/* eslint-disable react-hooks/purity */
"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { QRCodeSVG } from 'qrcode.react';
import {
  FileText,
  RotateCcw,
  CheckCircle2,
  Building,
  CreditCard,
  Banknote,
  Smartphone,
  Plus,
  Trash2,
  QrCode,
  ExternalLink,
  Copy,
  Check,
  X,
  Printer,
  FileSpreadsheet,
} from 'lucide-react';
import {
  productsApi,
  salesApi,
  paymentsApi,
  formatNGN,
} from '@/lib/api';

interface ProductItem {
  id: string;
  name: string;
  price: number;
  stock: number;
  sellingPriceKobo: number;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  sellingPriceKobo: number;
}

interface CompletedSaleInfo {
  id: string;
  saleNumber: string;
  totalKobo: number;
  subtotalKobo?: number;
  vatKobo?: number;
  paymentMethod?: string;
  items?: CartItem[];
  timestamp?: string;
}

export default function SalesPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [applyVat, setApplyVat] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'POS_TERMINAL' | 'CASH' | 'BANK_TRANSFER'>('POS_TERMINAL');
  const [transferRef, setTransferRef] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedSale, setCompletedSale] = useState<CompletedSaleInfo | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Bank details for customer bank transfer display
  const [bankAccount, setBankAccount] = useState<{
    bankName?: string;
    accountNumber?: string;
    accountName?: string;
  } | null>(null);

  // Void modal state
  const [showVoidModal, setShowVoidModal] = useState(false);
  const [voidReason, setVoidReason] = useState('Customer cancelled');
  const [isVoiding, setIsVoiding] = useState(false);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await productsApi.list({ limit: 100, search: search.trim() || undefined });
      if (res.success && Array.isArray(res.data)) {
        const mapped: ProductItem[] = res.data.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: Math.round((p.sellingPriceKobo || p.sellingPrice || 0) / 100),
          stock: p.currentStock ?? 0,
          sellingPriceKobo: p.sellingPriceKobo || (p.sellingPrice ? p.sellingPrice : 0),
        }));
        setProducts(mapped);
      }
    } catch {
      // Keep existing products
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    paymentsApi.getBankAccount().then((res) => {
      if (res.success && res.data) {
        setBankAccount({
          bankName: res.data.bankName,
          accountNumber: res.data.bankAccountNumber || res.data.accountNumber,
          accountName: res.data.bankAccountName || res.data.accountName,
        });
      }
    });
  }, []);

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;
    return products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  const addToCart = (product: ProductItem) => {
    if (product.stock <= 0) {
      toast.warning(`${product.name} is currently out of stock.`);
    }
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        toast.info(`Increased ${product.name} quantity to ${existing.quantity + 1}`);
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      toast.success(`Added ${product.name} to sale`);
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          sellingPriceKobo: product.sellingPriceKobo || product.price * 100,
        },
      ];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const subtotalKobo = cart.reduce((sum, item) => sum + item.sellingPriceKobo * item.quantity, 0);
  const vatKobo = applyVat ? Math.round(subtotalKobo * 0.075) : 0;
  const totalKobo = subtotalKobo + vatKobo;

  const handleCompleteSale = async () => {
    if (cart.length === 0 || isSubmitting) return;
    setIsSubmitting(true);

    const currentTime = Date.now();
    const formattedTimestamp = new Date(currentTime).toLocaleString('en-NG');

    const items = cart.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
      unitSellingPriceKobo: item.sellingPriceKobo,
      unitPriceKobo: item.sellingPriceKobo,
    }));

    const payments = [
      {
        method: paymentMethod,
        amountKobo: totalKobo,
        transferReference: paymentMethod === 'BANK_TRANSFER' ? transferRef || `TRF-${currentTime}` : undefined,
      },
    ];

    try {
      const res = await salesApi.create({
        items,
        payments,
        applyVat,
      });

      if (res.success && res.data) {
        const saleId = res.data.id || String(currentTime);
        const saleNumber = res.data.saleNumber || `#SALE-${currentTime.toString().slice(-4)}`;
        setCompletedSale({
          id: saleId,
          saleNumber,
          totalKobo,
          subtotalKobo,
          vatKobo,
          paymentMethod,
          items: [...cart],
          timestamp: formattedTimestamp,
        });
        setShowReceiptModal(true);
        toast.success(`Sale recorded! Ref: ${saleNumber}`);
        setCart([]);
        fetchProducts();
      } else {
        const err = res.error?.message || 'Sale could not be verified by backend';
        toast.error(err);
      }
    } catch (err: any) {
      toast.error(err?.message || 'Network error processing sale');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVoidSale = async () => {
    if (!completedSale) return;
    setIsVoiding(true);
    try {
      const res = await salesApi.voidSale(completedSale.id, voidReason);
      if (res.success) {
        toast.info(`Sale ${completedSale.saleNumber} has been voided.`);
        setCompletedSale(null);
        setShowVoidModal(false);
        fetchProducts();
      } else {
        toast.error(res.error?.message || 'Failed to void sale');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Error communicating with server');
    } finally {
      setIsVoiding(false);
    }
  };

  const handleExportCsv = () => {
    if (!completedSale) return;

    const escapeCsv = (str: string | number | undefined | null) => {
      const val = str === null || str === undefined ? '' : String(str);
      if (val.includes(',') || val.includes('"') || val.includes('\n')) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    };

    const rows: string[][] = [
      ['=== KOLO RETAIL TRANSACTION REPORT ==='],
      ['Receipt Number', completedSale.saleNumber],
      ['Transaction ID', completedSale.id],
      ['Date & Time', completedSale.timestamp || new Date().toLocaleString('en-NG')],
      ['Payment Method', completedSale.paymentMethod || 'POS_TERMINAL'],
      ['Store Name', bankAccount?.accountName || 'Kolo Store'],
      ['Account Details', `${bankAccount?.bankName || ''} ${bankAccount?.accountNumber || ''}`.trim()],
      [],
      ['--- PURCHASED ITEMS ---'],
      ['Item #', 'Product Name', 'Quantity', 'Unit Price (NGN)', 'Unit Price (Kobo)', 'Line Total (NGN)', 'Line Total (Kobo)'],
    ];

    if (completedSale.items && completedSale.items.length > 0) {
      completedSale.items.forEach((item, index) => {
        const unitNaira = (item.sellingPriceKobo / 100).toFixed(2);
        const lineTotalKobo = item.quantity * item.sellingPriceKobo;
        const lineTotalNaira = (lineTotalKobo / 100).toFixed(2);

        rows.push([
          String(index + 1),
          item.name,
          String(item.quantity),
          unitNaira,
          String(item.sellingPriceKobo),
          lineTotalNaira,
          String(lineTotalKobo),
        ]);
      });
    } else {
      rows.push(['1', 'Standard POS Retail Sale', '1', (completedSale.totalKobo / 100).toFixed(2), String(completedSale.totalKobo), (completedSale.totalKobo / 100).toFixed(2), String(completedSale.totalKobo)]);
    }

    rows.push([]);
    rows.push(['--- FINANCIAL TOTALS ---']);
    if (completedSale.subtotalKobo) {
      rows.push(['Subtotal (NGN)', (completedSale.subtotalKobo / 100).toFixed(2), 'Subtotal (Kobo)', String(completedSale.subtotalKobo)]);
    }
    if (completedSale.vatKobo) {
      rows.push(['VAT 7.5% (NGN)', (completedSale.vatKobo / 100).toFixed(2), 'VAT (Kobo)', String(completedSale.vatKobo)]);
    }
    rows.push(['Grand Total Paid (NGN)', (completedSale.totalKobo / 100).toFixed(2), 'Grand Total (Kobo)', String(completedSale.totalKobo)]);
    rows.push(['Digital Receipt URL', `${typeof window !== 'undefined' ? window.location.origin : 'https://kolo.app'}/receipt/${completedSale.id}`]);

    const csvContent = '\uFEFF' + rows.map((r) => r.map(escapeCsv).join(',')).join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeRef = completedSale.saleNumber.replace(/[^a-zA-Z0-9_-]/g, '_');
    link.href = url;
    link.setAttribute('download', `kolo_receipt_${safeRef}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Transaction CSV exported successfully!');
  };

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="m-0 text-[26px] tracking-tight font-bold text-kolo-ink">Sales / POS Checkout</h1>
          <div className="text-[#6a7872]">Speedy Point of Sale engine with integer Kobo precision.</div>
        </div>

        {/* Bank details pill */}
        {bankAccount?.accountNumber && (
          <div className="flex items-center gap-2 bg-[#FAF7EE] border border-[#D9CFB8] px-3 py-1.5 rounded-lg text-xs font-mono">
            <Building className="w-3.5 h-3.5 text-[#2E6F4D]" />
            <span>
              <strong>{bankAccount.bankName}:</strong> {bankAccount.accountNumber} ({bankAccount.accountName})
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-4">
        {/* Products Catalogue */}
        <div className="bg-white border border-[#e4eae7] rounded-[13px] p-[17px]">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
            <h3 className="m-0 text-[15px] font-bold text-kolo-ink">Product Catalogue</h3>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-[#e4eae7] bg-[#fafcfb] rounded-[9px] px-3 py-[9px] w-full sm:w-[280px] outline-none focus:border-[#0d7a55]"
              placeholder="Search products or SKU..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[10px]">
            {isLoading ? (
              [1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="border border-[#e4eae7] bg-white rounded-xl p-[13px] animate-pulse h-[110px] flex flex-col justify-between">
                  <div className="flex justify-between items-center">
                    <div className="h-3 w-16 bg-gray-200 rounded"></div>
                    <div className="h-3.5 w-3.5 bg-gray-200 rounded-full"></div>
                  </div>
                  <div>
                    <div className="h-4 w-28 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))
            ) : filteredProducts.length === 0 ? (
              <div className="col-span-full py-12 text-center text-xs text-[#6a7872]">
                No products found in catalogue.
              </div>
            ) : (
              filteredProducts.map((p) => (
                <button
                  key={p.id}
                  onClick={() => addToCart(p)}
                  className="border border-[#e4eae7] bg-white rounded-xl p-[13px] text-left hover:border-[#0d7a55] transition-colors cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          p.stock <= 0
                            ? 'bg-red-50 text-red-600'
                            : p.stock <= 5
                            ? 'bg-amber-50 text-amber-600'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {p.stock} in stock
                      </span>
                      <Plus className="w-4 h-4 text-gray-400 group-hover:text-[#0d7a55]" />
                    </div>
                    <strong className="block mt-4 mb-1 text-kolo-ink group-hover:text-[#0d7a55] transition-colors">
                      {p.name}
                    </strong>
                  </div>
                  <div className="mt-2 text-sm font-bold font-mono text-[#2E6F4D]">
                    {formatNGN(p.sellingPriceKobo, true)}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Current Sale / Cart */}
        <div className="bg-white border border-[#e4eae7] rounded-[13px] p-[17px] h-fit">
          <div className="flex justify-between items-center mb-4">
            <h3 className="m-0 text-[15px] font-bold text-kolo-ink">Current Sale</h3>
            {cart.length > 0 && (
              <button
                onClick={() => setCart([])}
                className="text-xs text-red-600 hover:underline cursor-pointer bg-transparent border-0"
              >
                Clear cart
              </button>
            )}
          </div>

          <div className="min-h-[140px] max-h-[280px] overflow-y-auto space-y-2">
            {cart.length === 0 ? (
              <div className="text-[#6a7872] text-sm py-8 text-center">
                Select products on the left to start checkout.
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-[#FAF9F5] border border-[#E9E1D5]"
                >
                  <div className="truncate pr-2">
                    <div className="font-semibold text-xs text-kolo-ink truncate">{item.name}</div>
                    <div className="text-[11px] text-[#6a7872] font-mono">
                      {item.quantity} × {formatNGN(item.sellingPriceKobo, true)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-kolo-ink">
                      {formatNGN(item.sellingPriceKobo * item.quantity, true)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 p-1 border-0 bg-transparent cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="mt-4 pt-3 border-t border-[#e4eae7] space-y-3">
              {/* VAT Switcher */}
              <label className="flex items-center justify-between cursor-pointer text-xs select-none">
                <span className="text-[#6a7872] font-medium">Apply 7.5% VAT</span>
                <input
                  type="checkbox"
                  checked={applyVat}
                  onChange={(e) => setApplyVat(e.target.checked)}
                  className="w-4 h-4 accent-[#0d7a55] rounded cursor-pointer"
                />
              </label>

              {/* Payment Methods */}
              <div>
                <div className="text-[11px] font-bold text-[#6a7872] mb-1.5 uppercase tracking-wider">
                  Payment Method
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'POS_TERMINAL', label: 'POS Terminal', icon: <CreditCard className="w-3.5 h-3.5" /> },
                    { id: 'CASH', label: 'Cash', icon: <Banknote className="w-3.5 h-3.5" /> },
                    { id: 'BANK_TRANSFER', label: 'Transfer', icon: <Smartphone className="w-3.5 h-3.5" /> },
                  ].map((pm) => (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id as any)}
                      className={`py-2 px-1.5 text-xs rounded-lg font-bold border transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
                        paymentMethod === pm.id
                          ? 'bg-[#eaf7f2] border-[#0d7a55] text-[#07553d]'
                          : 'border-[#e4eae7] bg-white text-[#6a7872] hover:bg-gray-50'
                      }`}
                    >
                      {pm.icon}
                      <span>{pm.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {paymentMethod === 'BANK_TRANSFER' && (
                <div className="bg-[#FAF7EE] p-2.5 rounded-lg border border-[#D9CFB8] text-xs space-y-1.5">
                  <div className="text-[11px] font-bold text-kolo-ink">Bank Transfer Reference:</div>
                  <input
                    value={transferRef}
                    onChange={(e) => setTransferRef(e.target.value)}
                    placeholder="e.g. NIBSS Session ID / Ref"
                    className="w-full bg-white border border-[#D9CFB8] rounded px-2 py-1 text-xs outline-none"
                  />
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1 pt-2 border-t border-[#e4eae7] text-xs">
                <div className="flex justify-between text-[#6a7872]">
                  <span>Subtotal</span>
                  <span className="font-mono">{formatNGN(subtotalKobo, true)}</span>
                </div>
                {applyVat && (
                  <div className="flex justify-between text-[#6a7872]">
                    <span>VAT (7.5%)</span>
                    <span className="font-mono">{formatNGN(vatKobo, true)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-black text-kolo-ink pt-1 border-t border-[#e4eae7]">
                  <span>Total</span>
                  <span className="font-mono text-[#2E6F4D]">{formatNGN(totalKobo, true)}</span>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleCompleteSale}
            disabled={cart.length === 0 || isSubmitting}
            className={`w-full text-white px-4 py-3 rounded-lg font-bold mt-4 transition-colors cursor-pointer text-sm shadow-sm ${
              cart.length === 0 || isSubmitting
                ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                : 'bg-[#0d7a55] hover:bg-[#09593d]'
            }`}
          >
            {isSubmitting ? 'Recording sale to backend...' : `Complete Sale • ${formatNGN(totalKobo, true)}`}
          </button>

          {/* Success Banner & Vector PDF receipt */}
          {completedSale && (
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-emerald-800 font-bold text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Sale verified: {completedSale.saleNumber}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowReceiptModal(true)}
                  className="inline-flex items-center gap-1 text-[11px] text-[#0d7a55] hover:text-[#07553d] font-bold underline cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  View QR
                </button>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowReceiptModal(true)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 bg-[#0d7a55] hover:bg-[#07553d] text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  Digital Receipt & QR
                </button>
                <a
                  href={salesApi.getReceiptPdfUrl(completedSale.id)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-[#D9CFB8] text-kolo-ink hover:bg-[#FAF7EE] rounded-lg text-xs font-bold transition"
                >
                  <FileText className="w-3.5 h-3.5 text-[#2E6F4D]" />
                  PDF
                </a>
                <button
                  type="button"
                  onClick={() => setShowVoidModal(true)}
                  className="px-2.5 py-1.5 border border-red-300 text-red-700 bg-white hover:bg-red-50 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Void
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dedicated Sales Completion / Digital Receipt QR Modal */}
      {showReceiptModal && completedSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-[#D9CFB8] w-full max-w-sm p-6 shadow-2xl space-y-4 relative">
            <button
              type="button"
              onClick={() => setShowReceiptModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 bg-transparent border-0 cursor-pointer p-1 rounded-md transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="text-center space-y-1">
              <div className="inline-flex items-center justify-center w-11 h-11 bg-emerald-100 text-emerald-700 rounded-full mb-1">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="m-0 text-lg font-bold text-kolo-ink">Payment Successful</h3>
              <p className="text-xs text-[#6a7872]">
                Order <strong className="font-mono text-kolo-ink">{completedSale.saleNumber}</strong> has been logged to inventory.
              </p>
            </div>

            {/* QR Code Card */}
            <div className="bg-[#FAF7EE] border border-[#D9CFB8] rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-3">
              <div className="bg-white p-3 rounded-xl border border-[#e4eae7] shadow-xs">
                <QRCodeSVG
                  value={
                    typeof window !== 'undefined'
                      ? `${window.location.origin}/receipt/${completedSale.id}`
                      : `https://kolo.app/receipt/${completedSale.id}`
                  }
                  size={168}
                  level="M"
                  includeMargin={false}
                  imageSettings={{
                    src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%232E6F4D"><circle cx="12" cy="12" r="10"/></svg>',
                    x: undefined,
                    y: undefined,
                    height: 24,
                    width: 24,
                    excavate: true,
                  }}
                />
              </div>

              <div className="space-y-0.5">
                <div className="text-xs font-bold text-kolo-ink flex items-center justify-center gap-1">
                  <QrCode className="w-3.5 h-3.5 text-[#2E6F4D]" />
                  Scan for Digital Receipt
                </div>
                <p className="text-[11px] text-[#8A7F6D] max-w-[220px]">
                  Customer can scan with their phone camera to view, save, or download this receipt.
                </p>
              </div>

              {/* Amount badge */}
              <div className="w-full pt-2 border-t border-[#D9CFB8]/60 flex justify-between items-center text-xs">
                <span className="text-[#8A7F6D]">Amount Paid</span>
                <span className="font-mono font-bold text-base text-[#2E6F4D]">
                  {formatNGN(completedSale.totalKobo, true)}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2 pt-1">
              {/* Primary Print Button */}
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.print();
                  }
                }}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-[#0d7a55] hover:bg-[#07553d] text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                Print Receipt (Thermal / Standard)
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 bg-[#FAF7EE] hover:bg-[#F2EBD9] border border-[#D9CFB8] text-kolo-ink rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-[#2E6F4D]" />
                  Export CSV
                </button>
                <a
                  href={salesApi.getReceiptPdfUrl(completedSale.id)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 bg-[#1B2A22] hover:bg-[#0F1811] text-white rounded-xl text-xs font-bold transition shadow-xs"
                >
                  <FileText className="w-3.5 h-3.5" />
                  PDF Download
                </a>
                <a
                  href={`/receipt/${completedSale.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 border border-[#D9CFB8] text-kolo-ink hover:bg-gray-50 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#2E6F4D]" />
                  Open Link
                </a>
              </div>

              <button
                type="button"
                onClick={() => {
                  const url = `${window.location.origin}/receipt/${completedSale.id}`;
                  navigator.clipboard.writeText(url);
                  setCopiedLink(true);
                  toast.success('Digital receipt link copied to clipboard!');
                  setTimeout(() => setCopiedLink(false), 2500);
                }}
                className="w-full py-2 bg-white border border-[#e4eae7] hover:bg-gray-50 rounded-xl text-xs font-semibold text-gray-700 flex items-center justify-center gap-1.5 cursor-pointer transition"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    Copied to Clipboard!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-gray-500" />
                    Copy Receipt URL
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowReceiptModal(false)}
                className="w-full py-2 text-center text-xs text-[#8A7F6D] hover:text-kolo-ink font-semibold cursor-pointer transition pt-1"
              >
                Close & Next Transaction
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Thermal Printer Layout (Activated automatically by @media print) */}
      {completedSale && (
        <div id="thermal-receipt-printable" className="hidden print:block text-black font-mono text-[11px] leading-tight bg-white p-2">
          {/* Header */}
          <div className="text-center pb-2 mb-2 border-b border-dashed border-black">
            <div className="font-bold text-sm tracking-wider uppercase">
              {bankAccount?.accountName || 'KOLO STORE'}
            </div>
            <div className="text-[10px]">VERIFIED RETAIL LEDGER</div>
            <div className="text-[10px] mt-1">{completedSale.timestamp || new Date().toLocaleString('en-NG')}</div>
            <div className="text-[10px]">RCPT: {completedSale.saleNumber}</div>
          </div>

          {/* Items Header */}
          <div className="flex justify-between font-bold border-b border-black pb-1 mb-1 text-[10px]">
            <span>ITEM</span>
            <span>QTY × PRICE</span>
            <span className="text-right">TOTAL</span>
          </div>

          {/* Items List */}
          <div className="space-y-1 mb-2 border-b border-dashed border-black pb-2">
            {completedSale.items && completedSale.items.length > 0 ? (
              completedSale.items.map((it, idx) => (
                <div key={idx} className="flex justify-between thermal-keep">
                  <div className="max-w-[45%] truncate font-medium">{it.name}</div>
                  <div className="text-[10px]">
                    {it.quantity} × {formatNGN(it.sellingPriceKobo, true)}
                  </div>
                  <div className="text-right font-bold">
                    {formatNGN(it.quantity * it.sellingPriceKobo, true)}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex justify-between">
                <div>Standard Retail Order</div>
                <div>1</div>
                <div className="text-right font-bold">{formatNGN(completedSale.totalKobo, true)}</div>
              </div>
            )}
          </div>

          {/* Totals */}
          <div className="space-y-1 text-[11px] border-b border-black pb-2 mb-2">
            {completedSale.subtotalKobo && (
              <div className="flex justify-between">
                <span>SUBTOTAL:</span>
                <span>{formatNGN(completedSale.subtotalKobo, true)}</span>
              </div>
            )}
            {completedSale.vatKobo ? (
              <div className="flex justify-between">
                <span>VAT (7.5%):</span>
                <span>{formatNGN(completedSale.vatKobo, true)}</span>
              </div>
            ) : null}
            <div className="flex justify-between font-bold text-sm pt-1 border-t border-dashed border-black">
              <span>TOTAL PAID:</span>
              <span>{formatNGN(completedSale.totalKobo, true)}</span>
            </div>
            <div className="flex justify-between text-[10px] pt-0.5">
              <span>METHOD:</span>
              <span>{completedSale.paymentMethod || 'POS_TERMINAL'}</span>
            </div>
          </div>

          {/* Thermal QR Code for Scanning */}
          <div className="flex flex-col items-center justify-center my-3 text-center thermal-keep">
            <QRCodeSVG
              value={
                typeof window !== 'undefined'
                  ? `${window.location.origin}/receipt/${completedSale.id}`
                  : `https://kolo.app/receipt/${completedSale.id}`
              }
              size={120}
              level="M"
              includeMargin={false}
            />
            <div className="text-[9px] mt-1 tracking-wider uppercase">Scan for digital copy</div>
          </div>

          {/* Footer Note */}
          <div className="text-center text-[10px] space-y-0.5 pt-1 border-t border-dashed border-black">
            <div>THANK YOU FOR YOUR PATRONAGE!</div>
            <div className="text-[8px] text-gray-700">POWERED BY KOLO POS LEDGER</div>
          </div>
        </div>
      )}

      {/* Void Modal */}
      {showVoidModal && completedSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl border border-[#e4eae7] w-full max-w-sm p-5 shadow-xl">
            <h3 className="m-0 text-base font-bold text-kolo-ink">Void Sale: {completedSale.saleNumber}</h3>
            <p className="text-xs text-[#6a7872] mt-1 mb-4">
              Voiding will reverse inventory stock and mark this transaction as VOID in your audit log.
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold mb-1 text-kolo-ink">Reason for Void</label>
                <input
                  value={voidReason}
                  onChange={(e) => setVoidReason(e.target.value)}
                  placeholder="e.g. Wrong items punched / customer return"
                  className="w-full border border-[#e4eae7] rounded-lg px-3 py-2 text-xs outline-none focus:border-red-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowVoidModal(false)}
                  className="px-3 py-1.5 border rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isVoiding}
                  onClick={handleVoidSale}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold cursor-pointer disabled:opacity-50"
                >
                  {isVoiding ? 'Voiding...' : 'Confirm Void'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
