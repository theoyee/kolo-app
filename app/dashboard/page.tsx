/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, TrendingUp, Package, Users } from 'lucide-react';
import { ResponsiveContainer, XAxis, Tooltip, Bar, Cell, BarChart } from 'recharts';
import { RecentOrdersTable } from '@/components/ui/TableExample';



function useCountUp(target: number, active: boolean, durationMs = 1400, delayMs = 0) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;

    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target);
      return;
    }

    let raf: number;
    const startTimeout = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / durationMs, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * target));
        if (progress < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delayMs);

    return () => {
      clearTimeout(startTimeout);
      cancelAnimationFrame(raf);
    };
  }, [target, active, durationMs, delayMs]);

  return value;
}


export const chartData = [
  { day: 'Mon', value: 118 },
  { day: 'Tue', value: 145 },
  { day: 'Wed', value: 102 },
  { day: 'Thu', value: 168 },
  { day: 'Fri', value: 134 },
  { day: 'Sat', value: 210 },
  { day: 'Today', value: 245 },
];

function ChartTooltip({ active, payload }: { active?: boolean; payload?: { value: number }[] }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-kolo-hairline rounded-md shadow-lg px-3 py-1.5 font-mono text-[11px] font-medium text-kolo-ink z-50">
      {'\u20a6'}{payload[0].value}k
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

export default function DashboardOverview() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 250);
    return () => clearTimeout(t);
  }, []);

  const sales = useCountUp(245000, mounted, 1200, 0);
  const orders = useCountUp(17, mounted, 1000, 80);
  const profit = useCountUp(72000, mounted, 1200, 160);
  const customers = useCountUp(124, mounted, 1000, 240);

  void sales; void orders; void profit; void customers;
  return (

    <div className="">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="m-0 text-xl font-bold text-kolo-ink">Good morning, Ada</h3>
          <small className="text-[13px] text-[#8A7F6D] font-medium">Here{`'`}s what{`'`}s happening today.</small>
        </div>
        <button className="bg-[#1B2A22] text-white border-0 rounded-lg px-4 py-2 text-[12px] font-bold cursor-pointer hover:bg-[#0F1811] active:scale-95 transition-all shadow-sm flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
          New sale
        </button>
      </div>

      {/* stats card */}
      <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-xl border border-[#1B2A22]/10 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-[#8A7F6D]">
              today{`'`}s sales
            </span>

            <ShoppingCart
              size={14}
              className="text-[#2E6F4D]"
            />
          </div>

          <p className="mt-3 font-mono text-xl font-medium text-kolo-ink">
            ₦727,500
          </p>

          <div className="mt-2 flex items-center gap-1 font-mono text-[9px] font-medium text-[#2E6F4D]">
            <TrendingUp size={10} />
            18.4% vs yesterday
          </div>
        </div>

        <div className="rounded-xl border border-[#1B2A22]/10 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-[#8A7F6D]">
              profit
            </span>

            <TrendingUp
              size={14}
              className="text-[#2E6F4D]"
            />
          </div>

          <p className="mt-3 font-mono text-xl font-medium text-kolo-ink">
            ₦238,400
          </p>

          <div className="mt-2 font-mono text-[9px] font-medium text-[#2E6F4D]">
            32.7% margin
          </div>
        </div>

        <div className="rounded-xl border border-[#1B2A22]/10 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-[#8A7F6D]">
              products
            </span>

            <Package
              size={14}
              className="text-kolo-ink"
            />
          </div>

          <p className="mt-3 font-mono text-xl font-medium text-kolo-ink">
            1,284
          </p>

          <div className="mt-2 font-mono text-[9px] font-medium text-[#C2410C]">
            12 low in stock
          </div>
        </div>

        <div className="rounded-xl border border-[#1B2A22]/10 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-[#8A7F6D]">
              customers
            </span>

            <Users
              size={14}
              className="text-kolo-ink"
            />
          </div>

          <p className="mt-3 font-mono text-xl font-medium text-kolo-ink">
            482
          </p>

          <div className="mt-2 font-mono text-[9px] font-medium text-[#2E6F4D]">
            +24 this month
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1.8fr_1fr] gap-4 mt-4">

        {/* Chart Panel */}
        <div className="bg-white border border-kolo-hairline rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-[13px] m-0 font-bold text-kolo-ink">Sales overview</h4>
            <span className="font-mono text-[11px] text-[#8A7F6D] bg-kolo-paper-alt px-2 py-1 rounded-md">Last 7 days</span>
          </div>
          <div className="h-[280px]">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 4, right: 0, bottom: 0, left: 0 }} barCategoryGap="25%">
                  <XAxis dataKey="day" axisLine={false} tickLine={false} interval={0} tick={<DayTick />} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: '#F7F4EE', opacity: 0.5 }} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} animationDuration={1200} animationBegin={200} animationEasing="ease-out">
                    {chartData.map((d: any) => (
                      <Cell
                        key={d.day}
                        fill={d.day === 'Today' ? '#2E6F4D' : d.day === 'Sat' ? '#1B2A22' : '#D9CFB8'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <RecentOrdersTable />



      </div>
    </div>
  );
}