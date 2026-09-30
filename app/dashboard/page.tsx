/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, TrendingUp, Package, Users, Plus, RefreshCw } from 'lucide-react';
// import { ResponsiveContainer, XAxis, Tooltip, Bar, Cell, BarChart } from 'recharts';
import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Bar, Cell, BarChart } from 'recharts';
import { RecentOrdersTable } from '@/components/ui/TableExample';
import { reportsApi, productsApi, customersApi, salesApi, getCurrentUser } from '@/lib/api';
import { getCachedData, setCachedData } from '@/lib/cache';
import { StatCardSkeleton, ChartWidgetSkeleton } from '@/components/ui/Skeleton';

function useCountUp(target: number, active: boolean, durationMs = 800, delayMs = 0) {
  const [value, setValue] = useState(target);

  useEffect(() => {
    if (!active) {
      setValue(target);
      return;
    }

    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target);
      return;
    }

    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    const startTimeout = setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, delayMs);

    return () => {
      clearTimeout(startTimeout);
      cancelAnimationFrame(raf);
    };
  }, [target, active, durationMs, delayMs]);

  return value;
}

function ChartTooltip({ active, payload }: { active?: boolean; payload?: { value: number }[] }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-kolo-hairline rounded-md shadow-lg px-3 py-1.5 font-mono text-[11px] font-medium text-kolo-ink z-50">
      {new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0
      }).format(payload[0].value)}
    </div>
  );
}

function DayTick({ x, y, payload }: { x?: number; y?: number; payload?: { value: string } }) {
  const isToday = payload?.value === 'Today';
  return (
    <text
      x={x}
      y={(y ?? 0) + 12}
      textAnchor="middle"
      fontSize={9}
      fontWeight={isToday ? 700 : 500}
      fill={isToday ? '#2E6F4D' : '#8A7F6D'}
    >
      {payload?.value}
    </text>
  );
}

// Generate an empty 7-day template ending in 'Today'
const generateEmptyWeek = () => {
  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      dateStr: d.toISOString().split('T')[0], // e.g., 2023-10-05
      day: i === 6 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' }),
      value: 0,
    };
  });
};

interface DashboardStats {
  todaySales: number;
  profit: number;
  margin: number;
  productsCount: number;
  lowStockCount: number;
  customersCount: number;
  chartData: { dateStr: string; day: string; value: number }[];
}

const STATS_CACHE_KEY = 'dashboard_summary_stats';

export default function DashboardOverview() {
  const [mounted, setMounted] = useState(false);
  const cachedStats = getCachedData<DashboardStats>(STATS_CACHE_KEY);

  const [stats, setStats] = useState<DashboardStats>(
    cachedStats || {
      todaySales: 0,
      profit: 0,
      margin: 0,
      productsCount: 0,
      lowStockCount: 0,
      customersCount: 0,
      chartData: generateEmptyWeek(),
    }
  );

  const [isLoading, setIsLoading] = useState(!cachedStats);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [user, setUser] = useState<{ firstName?: string }>(() => getCurrentUser());

  const fetchDashboardData = async () => {
    if (cachedStats) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const [dailyRes, plRes, prodRes, custRes, salesRes] = await Promise.allSettled([
        reportsApi.dailySummary(),
        reportsApi.profitLoss(),
        productsApi.list({ limit: 100 }),
        customersApi.list({ limit: 100 }),
        salesApi.list({ limit: 300 }), // Fetch recent sales to construct chart
      ]);

      let todaySales = 0;
      if (dailyRes.status === 'fulfilled' && dailyRes.value.success && dailyRes.value.data) {
        const rev =
          dailyRes.value.data.totalRevenueNaira ??
          Math.round((dailyRes.value.data.totalRevenueKobo || 0) / 100);
        if (typeof rev === 'number') todaySales = rev;
      }

      let profit = 0;
      let margin = 0;
      if (plRes.status === 'fulfilled' && plRes.value.success && plRes.value.data) {
        const p =
          plRes.value.data.grossProfitNaira ??
          Math.round((plRes.value.data.grossProfitKobo || 0) / 100);
        if (typeof p === 'number') profit = p;
        if (typeof plRes.value.data.grossMarginPercent === 'number') {
          margin = plRes.value.data.grossMarginPercent;
        }
      }

      let productsCount = 0;
      let lowStockCount = 0;
      if (prodRes.status === 'fulfilled' && prodRes.value.success && Array.isArray(prodRes.value.data)) {
        productsCount = prodRes.value.meta?.total || prodRes.value.data.length;
        lowStockCount = prodRes.value.data.filter(
          (p: any) => (p.currentStock ?? 0) <= (p.minStockAlert ?? 5)
        ).length;
      }

      let customersCount = 0;
      if (custRes.status === 'fulfilled' && custRes.value.success && Array.isArray(custRes.value.data)) {
        customersCount = custRes.value.meta?.total || custRes.value.data.length;
      }

      // Build 7-day Sales Chart Data
      const freshChartData = generateEmptyWeek();

      if (salesRes.status === 'fulfilled' && salesRes.value.success && Array.isArray(salesRes.value.data)) {
        salesRes.value.data.forEach((sale: any) => {
          if (!sale.createdAt) return;

          const saleDate = new Date(sale.createdAt).toISOString().split('T')[0];
          const dayBucket = freshChartData.find((d) => d.dateStr === saleDate);

          if (dayBucket) {
            // Find total kobo (fallback to mapping items if top-level property is missing)
            let kobo = sale.totalAmountKobo || sale.totalKobo || 0;
            if (!kobo && Array.isArray(sale.items)) {
              kobo = sale.items.reduce((acc: number, item: any) => {
                const price = item.unitSellingPriceKobo ?? item.unitPriceKobo ?? 0;
                return acc + (price * (item.quantity || 1));
              }, 0);
            }

            // Add to bucket (convert kobo to standard Naira)
            dayBucket.value += (kobo / 100);
          }
        });
      }

      const freshStats: DashboardStats = {
        todaySales,
        profit,
        margin,
        productsCount,
        lowStockCount,
        customersCount,
        chartData: freshChartData,
      };

      setStats(freshStats);
      setCachedData(STATS_CACHE_KEY, freshStats);
    } catch {
      // Keep existing cached data on failure
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    setUser(getCurrentUser());
    fetchDashboardData();
  }, []);

  const animatedSales = useCountUp(stats.todaySales, mounted && !isLoading, 800, 0);
  const animatedProfit = useCountUp(stats.profit, mounted && !isLoading, 800, 50);

  const firstName = user?.firstName || 'Ada';

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="m-0 text-xl font-bold text-kolo-ink">Good morning, {firstName}</h3>
            {isRefreshing && (
              <span className="flex items-center gap-1 text-[11px] text-[#2E6F4D] bg-[#eaf7f2] px-2 py-0.5 rounded-full font-medium animate-pulse">
                <RefreshCw className="w-3 h-3 animate-spin" />
                Syncing live
              </span>
            )}
          </div>
          <small className="text-[13px] text-[#8A7F6D] font-medium">Here{`'`}s what{`'`}s happening today.</small>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/sales"
            className="bg-[#1B2A22] text-white border-0 rounded-lg px-4 py-2 text-[12px] font-bold cursor-pointer hover:bg-[#0F1811] active:scale-95 transition-all shadow-sm flex items-center gap-1.5 no-underline"
          >
            <Plus className="w-3.5 h-3.5" />
            New sale
          </Link>
        </div>
      </div>

      {/* stats cards */}
      {isLoading ? (
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      ) : (
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-[#1B2A22]/10 bg-white p-4 h-[126px] flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-[#8A7F6D]">
                today{`'`}s sales
              </span>
              <ShoppingCart size={14} className="text-[#2E6F4D]" />
            </div>

            <div>
              <p className="mt-1 font-mono text-xl font-medium text-kolo-ink">
                ₦{animatedSales.toLocaleString()}
              </p>
              <div className="mt-1 flex items-center gap-1 font-mono text-[9px] font-medium text-[#2E6F4D]">
                <TrendingUp size={10} />
                Real-time ledger
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#1B2A22]/10 bg-white p-4 h-[126px] flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-[#8A7F6D]">
                profit
              </span>
              <TrendingUp size={14} className="text-[#2E6F4D]" />
            </div>

            <div>
              <p className="mt-1 font-mono text-xl font-medium text-kolo-ink">
                ₦{animatedProfit.toLocaleString()}
              </p>
              <div className="mt-1 font-mono text-[9px] font-medium text-[#2E6F4D]">
                {stats.margin}% margin
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#1B2A22]/10 bg-white p-4 h-[126px] flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-[#8A7F6D]">
                products
              </span>
              <Package size={14} className="text-kolo-ink" />
            </div>

            <div>
              <p className="mt-1 font-mono text-xl font-medium text-kolo-ink">
                {stats.productsCount.toLocaleString()}
              </p>
              <div className="mt-1 font-mono text-[9px] font-medium text-[#C2410C]">
                {stats.lowStockCount} low in stock
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#1B2A22]/10 bg-white p-4 h-[126px] flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-[#8A7F6D]">
                customers
              </span>
              <Users size={14} className="text-kolo-ink" />
            </div>

            <div>
              <p className="mt-1 font-mono text-xl font-medium text-kolo-ink">
                {stats.customersCount.toLocaleString()}
              </p>
              <div className="mt-1 font-mono text-[9px] font-medium text-[#2E6F4D]">
                Active directory
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Widgets: Chart + Recent Orders */}
      <div className="grid grid-cols-1 md:grid-cols-[1.8fr_1fr] gap-4 mt-4">
        {/* Chart Panel */}
        {isLoading ? (
          <ChartWidgetSkeleton />
        ) : (
          <div className="bg-white border border-kolo-hairline rounded-xl p-5 shadow-xs flex flex-col justify-between h-[360px]">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-[13px] m-0 font-bold text-kolo-ink">Sales overview</h4>
              <span className="font-mono text-[11px] text-[#8A7F6D] bg-kolo-paper-alt px-2 py-1 rounded-md">Last 7 days</span>
            </div>
            <div className="h-[275px]">
              {mounted && (
                // <ResponsiveContainer width="100%" height="100%">
                //   <BarChart data={stats.chartData} margin={{ top: 4, right: 0, bottom: 0, left: 0 }} barCategoryGap="25%">
                //     <XAxis dataKey="day" axisLine={false} tickLine={false} interval={0} tick={<DayTick />} />
                //     <Tooltip content={<ChartTooltip />} cursor={{ fill: '#F7F4EE', opacity: 0.5 }} />
                //     <Bar dataKey="value" radius={[4, 4, 0, 0]} animationDuration={800} animationBegin={100} animationEasing="ease-out">
                //       {stats.chartData.map((d: any) => (
                //         <Cell
                //           key={d.dateStr}
                //           fill={d.day === 'Today' ? '#2E6F4D' : d.day === 'Sat' ? '#1B2A22' : '#D9CFB8'}
                //         />
                //       ))}
                //     </Bar>
                //   </BarChart>
                // </ResponsiveContainer>


                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats.chartData}
                    margin={{ top: 10, right: 10, bottom: 10, left: -20 }}
                    barCategoryGap="20%"
                  >
                    {/* 1. Define Gradients for a premium feel */}
                    <defs>
                      <linearGradient id="todayGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2E6F4D" stopOpacity={1} />
                        <stop offset="100%" stopColor="#19402C" stopOpacity={1} />
                      </linearGradient>
                      <linearGradient id="normalGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#E5DFD1" stopOpacity={1} />
                        <stop offset="100%" stopColor="#D9CFB8" stopOpacity={1} />
                      </linearGradient>
                    </defs>

                    {/* 2. Add a subtle horizontal grid to anchor the data */}
                    <CartesianGrid vertical={false} stroke="#F0EBE1" strokeDasharray="4 4" />

                    {/* 3. Add a minimal Y-Axis for visual context */}
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: '#8A7F6D', fontFamily: 'monospace', fontWeight: 500 }}
                      tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}
                      dx={-10}
                    />

                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      interval={0}
                      tick={<DayTick />}
                      dy={10}
                    />

                    <Tooltip
                      content={<ChartTooltip />}
                      cursor={{ fill: '#F7F4EE', opacity: 0.6 }}
                    />

                    <Bar
                      dataKey="value"
                      radius={[6, 6, 0, 0]} // Slightly rounder top corners
                      maxBarSize={48} // Prevents bars from becoming giant blocks on wide screens
                      animationDuration={1200} // Slightly slower, smoother animation
                      animationEasing="ease-out"
                    >
                      {stats.chartData.map((d: any) => (
                        <Cell
                          key={d.dateStr}
                          fill={d.day === 'Today' ? 'url(#todayGradient)' : 'url(#normalGradient)'}
                          className="transition-all duration-300 hover:opacity-80" // Tailwind hover effect
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        )}

        <RecentOrdersTable />
      </div>
    </div>
  );
}