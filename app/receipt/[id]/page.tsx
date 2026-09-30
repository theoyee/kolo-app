'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CheckCircle2, Download, Building, ShoppingBag, ShieldCheck, ArrowLeft, Printer, FileSpreadsheet } from 'lucide-react';
import Link from 'next/link';
import { salesApi, formatNGN } from '@/lib/api';

export default function DigitalReceiptPage() {
  const params = useParams();
  const id = params?.id as string;
  const [sale, setSale] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    salesApi.get(id)
      .then((res) => {
        if (res.success && res.data) {
          setSale(res.data);
        } else {
          setError(res.error?.message || 'Receipt could not be loaded');
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err?.message || 'Failed to retrieve receipt details');
        setLoading(false);
      });
  }, [id]);

  const pdfUrl = id ? salesApi.getReceiptPdfUrl(id) : '#';

  const handleExportCsv = () => {
    if (!sale) return;

    const escapeCsv = (str: string | number | undefined | null) => {
      const val = str === null || str === undefined ? '' : String(str);
      if (val.includes(',') || val.includes('"') || val.includes('\n')) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    };

    const rows: string[][] = [
      ['=== KOLO RETAIL TRANSACTION RECEIPT ==='],
      ['Receipt Number', sale.saleNumber || `#${id.slice(-6).toUpperCase()}`],
      ['Transaction ID', id],
      ['Date & Time', sale.createdAt ? new Date(sale.createdAt).toLocaleString('en-NG') : new Date().toLocaleString('en-NG')],
      ['Store Name', sale.business?.name || 'Kolo Store'],
      ['Payment Method', sale.paymentMethod || 'POS'],
      ['Payment Status', sale.paymentStatus || 'SUCCESS'],
      [],
      ['--- PURCHASED ITEMS ---'],
      ['Item #', 'Product Name', 'Quantity', 'Unit Price (NGN)', 'Line Total (NGN)', 'Line Total (Kobo)'],
    ];

    if (sale.items && sale.items.length > 0) {
      sale.items.forEach((item: any, index: number) => {
        const unitKobo = item.unitSellingPriceKobo || item.unitPriceKobo || 0;
        const totalKobo = item.subtotalKobo || item.totalKobo || unitKobo * item.quantity;
        const unitNaira = (unitKobo / 100).toFixed(2);
        const totalNaira = (totalKobo / 100).toFixed(2);

        rows.push([
          String(index + 1),
          item.productName || item.product?.name || 'Item',
          String(item.quantity),
          unitNaira,
          totalNaira,
          String(totalKobo),
        ]);
      });
    }

    rows.push([]);
    rows.push(['--- TOTALS ---']);
    if (sale.subtotalKobo) {
      rows.push(['Subtotal (NGN)', (sale.subtotalKobo / 100).toFixed(2)]);
    }
    if (sale.vatKobo) {
      rows.push(['VAT 7.5% (NGN)', (sale.vatKobo / 100).toFixed(2)]);
    }
    const grandKobo = sale.grandTotalKobo || sale.totalKobo || 0;
    rows.push(['Grand Total Paid (NGN)', (grandKobo / 100).toFixed(2)]);
    rows.push(['Grand Total Paid (Kobo)', String(grandKobo)]);

    const csvContent = '\uFEFF' + rows.map((r) => r.map(escapeCsv).join(',')).join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeRef = (sale.saleNumber || id).replace(/[^a-zA-Z0-9_-]/g, '_');
    link.href = url;
    link.setAttribute('download', `kolo_receipt_${safeRef}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#F6F5EF] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-[#D9CFB8] rounded-2xl shadow-lg p-6 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-1.5 border-b border-[#FAF9F5] pb-4">
          <div className="inline-flex items-center gap-1.5 bg-[#FAF7EE] border border-[#D9CFB8] px-3 py-1 rounded-full text-xs font-mono font-bold text-kolo-ink">
            <Building className="w-3.5 h-3.5 text-[#2E6F4D]" />
            {sale?.business?.name || 'Kolo Verified Store'}
          </div>
          <h1 className="text-xl font-bold text-kolo-ink pt-1">Official Digital Receipt</h1>
          <p className="text-xs text-[#8A7F6D] font-mono">
            {sale?.createdAt ? new Date(sale.createdAt).toLocaleString('en-NG') : 'Instant Purchase Record'}
          </p>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-[#8A7F6D] space-y-2">
            <div className="w-6 h-6 border-2 border-[#0d7a55] border-t-transparent rounded-full animate-spin mx-auto" />
            <p>Loading your verified digital receipt...</p>
          </div>
        ) : error ? (
          <div className="py-8 text-center text-xs text-red-600 space-y-3">
            <p>{error}</p>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#1B2A22] text-white px-4 py-2 rounded-lg text-xs font-bold"
            >
              <Download className="w-3.5 h-3.5" />
              Download Vector PDF
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Sale Summary Banner */}
            <div className="bg-[#FAF7EE] border border-[#D9CFB8] rounded-xl p-3.5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A7F6D]">Receipt Reference</span>
                <div className="text-sm font-mono font-bold text-kolo-ink">
                  {sale.saleNumber || `#${id.slice(-6).toUpperCase()}`}
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#07553d] bg-[#eaf7f2] px-2.5 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0d7a55]" />
                {sale.paymentStatus === 'SUCCESS' ? 'PAID' : sale.paymentStatus || 'COMPLETED'}
              </div>
            </div>

            {/* Line Items */}
            <div className="border border-[#e4eae7] rounded-xl p-3 divide-y divide-[#FAF9F5] text-xs">
              <div className="pb-2 font-bold text-kolo-ink flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-[#2E6F4D]" />
                Purchased Items ({sale.items?.length || 0})
              </div>
              {sale.items?.map((item: any, idx: number) => (
                <div key={idx} className="py-2.5 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-kolo-ink">{item.productName || item.product?.name || 'Item'}</div>
                    <div className="text-[11px] text-[#8A7F6D] font-mono">Qty: {item.quantity}</div>
                  </div>
                  <div className="font-mono font-bold text-kolo-ink">
                    {formatNGN(item.subtotalKobo || item.totalKobo, true)}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals Breakdown */}
            <div className="space-y-1.5 pt-2 border-t border-[#e4eae7] text-xs">
              <div className="flex justify-between text-[#8A7F6D]">
                <span>Payment Mode</span>
                <span className="font-mono font-bold text-kolo-ink">{sale.paymentMethod || 'POS'}</span>
              </div>
              {sale.vatKobo > 0 && (
                <div className="flex justify-between text-[#8A7F6D]">
                  <span>VAT (7.5%)</span>
                  <span className="font-mono">{formatNGN(sale.vatKobo, true)}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-[#e4eae7]">
                <span className="font-bold text-kolo-ink text-sm">Grand Total</span>
                <span className="text-xl font-mono font-black text-[#2E6F4D]">
                  {formatNGN(sale.grandTotalKobo || sale.totalKobo, true)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.print();
                  }
                }}
                className="w-full flex items-center justify-center gap-2 bg-[#0d7a55] hover:bg-[#07553d] text-white py-2.5 rounded-xl font-bold text-xs shadow-sm transition cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                Print Receipt (Thermal / Standard)
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-[#FAF7EE] hover:bg-[#F2EBD9] border border-[#D9CFB8] text-kolo-ink py-2.5 rounded-xl font-bold text-xs shadow-2xs transition cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-[#2E6F4D]" />
                  Export CSV
                </button>
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 bg-[#1B2A22] hover:bg-[#0F1811] text-white py-2.5 rounded-xl font-bold text-xs shadow-sm transition"
                >
                  <Download className="w-4 h-4" />
                  PDF Receipt
                </a>
              </div>
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#8A7F6D] pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2E6F4D]" />
                Cryptographically hashed audit record by Kolo Ledger
              </div>
            </div>
          </div>
        )}

        {/* Hidden Thermal Printer Layout for Digital Receipt Page */}
        {sale && (
          <div id="thermal-receipt-printable" className="hidden print:block text-black font-mono text-[11px] leading-tight bg-white p-2">
            <div className="text-center pb-2 mb-2 border-b border-dashed border-black">
              <div className="font-bold text-sm tracking-wider uppercase">
                {sale.business?.name || 'KOLO STORE'}
              </div>
              <div className="text-[10px]">VERIFIED RETAIL LEDGER</div>
              <div className="text-[10px] mt-1">{sale.createdAt ? new Date(sale.createdAt).toLocaleString('en-NG') : ''}</div>
              <div className="text-[10px]">RCPT: {sale.saleNumber || `#${id.slice(-6).toUpperCase()}`}</div>
            </div>

            <div className="flex justify-between font-bold border-b border-black pb-1 mb-1 text-[10px]">
              <span>ITEM</span>
              <span>QTY × PRICE</span>
              <span className="text-right">TOTAL</span>
            </div>

            <div className="space-y-1 mb-2 border-b border-dashed border-black pb-2">
              {sale.items?.map((it: any, idx: number) => (
                <div key={idx} className="flex justify-between thermal-keep">
                  <div className="max-w-[45%] truncate font-medium">{it.productName || it.product?.name || 'Item'}</div>
                  <div className="text-[10px]">
                    {it.quantity} × {formatNGN(it.unitSellingPriceKobo || it.unitPriceKobo, true)}
                  </div>
                  <div className="text-right font-bold">
                    {formatNGN(it.subtotalKobo || it.totalKobo, true)}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-1 text-[11px] border-b border-black pb-2 mb-2">
              {sale.subtotalKobo && (
                <div className="flex justify-between">
                  <span>SUBTOTAL:</span>
                  <span>{formatNGN(sale.subtotalKobo, true)}</span>
                </div>
              )}
              {sale.vatKobo ? (
                <div className="flex justify-between">
                  <span>VAT (7.5%):</span>
                  <span>{formatNGN(sale.vatKobo, true)}</span>
                </div>
              ) : null}
              <div className="flex justify-between font-bold text-sm pt-1 border-t border-dashed border-black">
                <span>TOTAL PAID:</span>
                <span>{formatNGN(sale.grandTotalKobo || sale.totalKobo, true)}</span>
              </div>
              <div className="flex justify-between text-[10px] pt-0.5">
                <span>METHOD:</span>
                <span>{sale.paymentMethod || 'POS_TERMINAL'}</span>
              </div>
            </div>

            <div className="text-center text-[10px] space-y-0.5 pt-1 border-t border-dashed border-black">
              <div>THANK YOU FOR YOUR PATRONAGE!</div>
              <div className="text-[8px] text-gray-700">POWERED BY KOLO POS LEDGER</div>
            </div>
          </div>
        )}

        <div className="text-center pt-2">
          <Link
            href="/dashboard"
            className="text-xs text-[#8A7F6D] hover:text-kolo-ink inline-flex items-center gap-1 font-medium transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
