"use client";

import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { reportsApi, formatNGN } from '@/lib/api';
import { getCachedData, setCachedData } from '@/lib/cache';
import { Skeleton } from '@/components/ui/Skeleton';

interface TopProductItem {
  name: string;
  revenue: string;
}

interface ReportsCachePayload {
  stats: {
    revenue: string;
    revenueGrowth: string;
    cogs: string;
    grossProfit: string;
    expenses: string;
  };
  topProducts: TopProductItem[];
}

export default function ReportsPage() {
  const [period, setPeriod] = useState<'30 days' | '90 days' | '12 months'>('30 days');
  const cacheKey = `reports_summary_${period}`;
  const cached = getCachedData<ReportsCachePayload>(cacheKey);

  const [isLoading, setIsLoading] = useState(!cached);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState(
    cached?.stats || {
      revenue: '₦0',
      revenueGrowth: '↑ 0%',
      cogs: '₦0',
      grossProfit: '₦0',
      expenses: '₦0',
    }
  );
  const [topProducts, setTopProducts] = useState<TopProductItem[]>(cached?.topProducts || []);

  const loadReports = async () => {
    if (cached) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const [plRes, topRes] = await Promise.allSettled([
        reportsApi.profitLoss(),
        reportsApi.topProducts(),
      ]);

      let freshStats = {
        revenue: '₦0',
        revenueGrowth: '↑ 18.4%',
        cogs: '₦0',
        grossProfit: '₦0',
        expenses: '₦0',
      };

      if (plRes.status === 'fulfilled' && plRes.value.success && plRes.value.data) {
        const d = plRes.value.data;
        const rev = d.formattedRevenue || formatNGN(d.totalRevenueKobo || 0, true);
        const cogs = d.formattedCogs || formatNGN(d.cogsKobo || 0, true);
        const gp = d.formattedGrossProfit || formatNGN(d.grossProfitKobo || 0, true);
        const exp = d.formattedOperatingExpenses || formatNGN(d.operatingExpensesKobo || 0, true);

        freshStats = {
          revenue: rev,
          revenueGrowth: '↑ 18.4%',
          cogs,
          grossProfit: gp,
          expenses: exp,
        };
        setStats(freshStats);
      }

      let freshTopProducts: TopProductItem[] = [];
      if (topRes.status === 'fulfilled' && topRes.value.success && Array.isArray(topRes.value.data)) {
        freshTopProducts = topRes.value.data.slice(0, 5).map((p: any) => ({
          name: p.name || p.productName || 'Product',
          revenue: p.formattedRevenue || formatNGN(p.revenueKobo || p.revenue || 0, true),
        }));
        setTopProducts(freshTopProducts);
      }

      setCachedData<ReportsCachePayload>(cacheKey, {
        stats: freshStats,
        topProducts: freshTopProducts,
      });
    } catch {
      // keep cached
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [period]);

  return (
    <>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="m-0 text-[26px] tracking-tight font-bold text-kolo-ink">Financial Reports</h1>
            {isRefreshing && (
              <span className="flex items-center gap-1 text-[11px] text-[#2E6F4D] bg-[#eaf7f2] px-2 py-0.5 rounded-full font-medium animate-pulse">
                <RefreshCw className="w-3 h-3 animate-spin" />
                Updating
              </span>
            )}
          </div>
          <div className="text-[#6a7872]">Understand your business revenue, gross margins, and profit.</div>
        </div>
      </div>

      <div className="flex gap-[7px] mb-[18px]">
        {(['30 days', '90 days', '12 months'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-3.5 py-1.5 rounded-lg border text-xs cursor-pointer transition-colors ${
              period === p
                ? 'bg-[#eaf7f2] text-[#07553d] font-bold border-[#e4eae7]'
                : 'bg-white text-[#6a7872] border-[#e4eae7] hover:bg-gray-50'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[14px]">
        {[
          { l: 'Total Revenue', v: stats.revenue, u: stats.revenueGrowth },
          { l: 'Cost of Goods Sold (COGS)', v: stats.cogs },
          { l: 'Gross Profit', v: stats.grossProfit },
          { l: 'Operating Expenses', v: stats.expenses },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-[#e4eae7] rounded-[13px] p-[17px] shadow-xs h-[106px] flex flex-col justify-between">
            <div className="text-[12px] text-[#6a7872]">{s.l}</div>
            {isLoading ? (
              <Skeleton className="h-7 w-28 my-1" />
            ) : (
              <div>
                <div className="text-[22px] font-black font-mono text-kolo-ink my-0.5">{s.v}</div>
                {s.u && <div className="text-[#0d7a55] text-[10px] font-bold">{s.u}</div>}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-[14px] mt-[14px]">
        <div className="bg-white border border-[#e4eae7] rounded-[13px] p-[17px] shadow-xs">
          <h3 className="m-0 mb-4 text-[15px] font-bold text-kolo-ink">Revenue Trends</h3>
          <div className="h-[220px] flex items-end gap-[9px] pt-4">
            {[35, 48, 42, 60, 52, 76, 68, 82, 70, 94, 78, 100].map((h, i) => (
              <div
                key={i}
                className={`flex-1 rounded-t-md transition-all ${i === 11 ? 'bg-[#0d7a55]' : 'bg-[#bfe8d8]'}`}
                style={{ height: `${h}%` }}
              ></div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-[#e4eae7] rounded-[13px] p-[17px] shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="m-0 mb-4 text-[15px] font-bold text-kolo-ink">Top Performing Products</h3>
            {isLoading ? (
              <div className="space-y-3 py-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-[#FAF9F5]">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            ) : topProducts.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#6a7872]">
                No sales recorded for this period yet.
              </div>
            ) : (
              topProducts.map((r, i) => (
                <div key={i} className="flex justify-between py-3 border-b border-[#e4eae7] last:border-0 text-sm">
                  <span className="text-kolo-ink font-medium">{r.name}</span>
                  <b className="font-mono text-[#2E6F4D]">{r.revenue}</b>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
