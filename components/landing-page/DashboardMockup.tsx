/* eslint-disable react-hooks/set-state-in-effect */
// DashboardMockup.tsx
"use client";

import { koloColors } from '@/utils/constants';
import { ShoppingCart, TrendingUp, Package, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
// import { koloColors } from './theme/kolo-colors';

// Token system shared with the rest of the site:
// ink #1B2A22, currency green #2E6F4D, stamp orange #C2410C,
// paper #FFFDF8 / #FBF7EE / #F7F4EE, hairline #D9CFB8,
// muted text #6E6152 / #8A7F6D. font-mono (IBM Plex Mono) for every
// numeral, font-sans (Instrument Sans) for labels and copy.

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

const navItems = [
  { label: 'Overview', active: true, icon: <path d="M3 9.5 10 4l7 5.5M4.5 8.5V16h11V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" /> },
  { label: 'Sales', icon: <circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="1.5" fill="none" /> },
  { label: 'Orders', icon: <path d="M3.5 6.2 10 3l6.5 3.2v7.6L10 17l-6.5-3.2V6.2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none" /> },
  { label: 'Products', icon: <path d="M4 8.5 10 5l6 3.5-6 3.5-6-3.5ZM4 12l6 3.5 6-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none" /> },
  { label: 'Inventory', icon: <><rect x="4" y="4" width="12" height="3" rx="0.8" stroke="currentColor" strokeWidth="1.5" fill="none" /><rect x="4" y="8.5" width="12" height="3" rx="0.8" stroke="currentColor" strokeWidth="1.5" fill="none" /><rect x="4" y="13" width="8" height="3" rx="0.8" stroke="currentColor" strokeWidth="1.5" fill="none" /></> },
  { label: 'Customers', icon: <><circle cx="7.5" cy="7" r="2.2" stroke="currentColor" strokeWidth="1.5" fill="none" /><path d="M3.2 15c.4-2.3 2-3.7 4.3-3.7s3.9 1.4 4.3 3.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" /></> },
  { label: 'Reports', icon: <path d="M4 15.5V9M9.3 15.5V5M14.6 15.5v-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" /> },
];

const chartData = [
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
      fill={isToday ? koloColors.currency : koloColors.mutedLight}
    >
      {payload?.value}
    </text>
  );
}

export default function DashboardMockup({ className = "" }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 250);
    return () => clearTimeout(t);
  }, []);

  const sales = useCountUp(245000, mounted, 1200, 0);
  const orders = useCountUp(17, mounted, 1000, 80);
  const profit = useCountUp(72000, mounted, 1200, 160);
  const customers = useCountUp(124, mounted, 1000, 240);

  // sales/orders/profit/customers are wired up for a live count-up effect
  // but the static stat cards below currently render fixed sample figures,
  // matching the original — swap in `sales`, `orders`, etc. if you want
  // the cards themselves to animate.
  void sales; void orders; void profit; void customers;

  return (
    <div className={`mt-14 relative w-full group lg:min-w-4xl ${className}`}>
      {/* Floating proof chip — top right */}
      <div
        className="hidden md:flex absolute -top-6 -right-8 z-10 items-center gap-2.5 bg-white border border-kolo-hairline rounded-xl shadow-xl px-4 py-3 rotate-[-4deg] transition-transform duration-500 ease-out hover:rotate-0 hover:scale-105"
        style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.6s ease 0.5s, transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
      >
        <div className="w-8 h-8 rounded-lg bg-kolo-currency/10 text-kolo-currency flex items-center justify-center">
          <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
            <path d="M4 13.5 8 9l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="text-left leading-tight">
          <div className="font-mono text-[13px] font-medium text-kolo-ink">+18.4%</div>
          <div className="font-mono text-[10px] text-kolo-muted-light">vs last week</div>
        </div>
      </div>

      {/* Floating proof chip — bottom left */}
      <div
        className="hidden md:flex absolute -bottom-6 -left-8 z-10 items-center gap-2.5 bg-white border border-kolo-hairline rounded-xl shadow-xl px-4 py-3 rotate-[3deg] transition-transform duration-500 ease-out hover:rotate-0 hover:scale-105"
        style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.6s ease 0.65s, transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
      >
        <span className="relative flex w-2 h-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-kolo-currency opacity-75 animate-ping-slow" />
          <span className="relative inline-flex rounded-full w-2 h-2 bg-kolo-currency" />
        </span>
        <div className="font-mono text-[12px] font-medium text-kolo-ink">Synced 2s ago</div>
      </div>

      {/* Main Mockup Container */}
      <div className="bg-white border border-kolo-hairline rounded-[20px] shadow-kolo-lift overflow-hidden text-left transform transition-transform duration-700 ease-out group-hover:rotate-x-[1deg] group-hover:rotate-y-[1deg]">

        {/* Browser App Bar */}
        <div className="h-12 border-b border-kolo-hairline bg-kolo-paper-alt/40 flex items-center px-4 gap-2.5">
          <span className="w-3 h-3 rounded-full bg-[#ff5f56]"></span>
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e]"></span>
          <span className="w-3 h-3 rounded-full bg-[#27c93f]"></span>
          <div className="flex-1 flex justify-center">
            <span className="font-mono text-[11px] text-kolo-muted-light bg-white border border-kolo-hairline/60 rounded-md px-16 py-1.5 shadow-sm">app.kolo.africa/dashboard</span>
          </div>
          <span className="w-9 h-3"></span> {/* Spacer to balance dots */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[0.29fr_1fr]">

          {/* Sidebar */}
          <aside className="hidden md:block border-r border-kolo-hairline bg-white p-5 min-h-[460px]">
            <strong className="text-[15px] px-2 flex items-center gap-2.5 mb-4 text-kolo-ink">
              <span className="w-6 h-6 rounded-md bg-kolo-ink flex items-center justify-center text-white text-[11px] font-black">K</span>
              Kolo
            </strong>
            <div className="space-y-1">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] cursor-pointer transition-colors ${item.active
                    ? 'bg-kolo-paper-alt text-kolo-ink font-bold'
                    : 'text-kolo-muted-light font-medium hover:bg-kolo-paper-alt/60 hover:text-kolo-ink'
                    }`}
                >
                  <svg viewBox="0 0 20 20" className={`w-4 h-4 shrink-0 ${item.active ? 'text-kolo-currency' : ''}`}>{item.icon}</svg>
                  {item.label}
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-kolo-ink/10 pt-6">
              <p className="px-3 font-mono text-[10px] text-kolo-muted-light">
                business
              </p>

              <div className="mt-3 flex items-center gap-3 px-3">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-kolo-currency font-mono text-[10px] font-medium text-white">
                  LF
                </div>

                <div>
                  <p className="text-[11px] font-bold text-kolo-ink">
                    Lumo Foods
                  </p>
                  <p className="text-[9px] text-kolo-muted-light">
                    Business account
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="p-6 bg-kolo-paper-soft/40">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="m-0 text-xl font-bold text-kolo-ink">Good morning, Ada</h3>
                <small className="text-[13px] text-kolo-muted-light font-medium">Here{`'`}s what{`'`}s happening today.</small>
              </div>
              <button className="bg-kolo-ink text-white border-0 rounded-lg px-4 py-2 text-[12px] font-bold cursor-pointer hover:bg-kolo-ink-dark active:scale-95 transition-all shadow-sm flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                New sale
              </button>
            </div>

            {/* stats card */}
            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

              <div className="rounded-xl border border-kolo-ink/10 bg-white p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-kolo-muted-light">
                    today{`'`}s sales
                  </span>

                  <ShoppingCart
                    size={14}
                    className="text-kolo-currency"
                  />
                </div>

                <p className="mt-3 font-mono text-xl font-medium text-kolo-ink">
                  ₦727,500
                </p>

                <div className="mt-2 flex items-center gap-1 font-mono text-[9px] font-medium text-kolo-currency">
                  <TrendingUp size={10} />
                  18.4% vs yesterday
                </div>
              </div>

              <div className="rounded-xl border border-kolo-ink/10 bg-white p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-kolo-muted-light">
                    profit
                  </span>

                  <TrendingUp
                    size={14}
                    className="text-kolo-currency"
                  />
                </div>

                <p className="mt-3 font-mono text-xl font-medium text-kolo-ink">
                  ₦238,400
                </p>

                <div className="mt-2 font-mono text-[9px] font-medium text-kolo-currency">
                  32.7% margin
                </div>
              </div>

              <div className="rounded-xl border border-kolo-ink/10 bg-white p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-kolo-muted-light">
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

                <div className="mt-2 font-mono text-[9px] font-medium text-kolo-stamp">
                  12 low in stock
                </div>
              </div>

              <div className="rounded-xl border border-kolo-ink/10 bg-white p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-kolo-muted-light">
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

                <div className="mt-2 font-mono text-[9px] font-medium text-kolo-currency">
                  +24 this month
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1.8fr_1fr] gap-4 mt-4">

              {/* Chart Panel */}
              <div className="bg-white border border-kolo-hairline rounded-xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-[13px] m-0 font-bold text-kolo-ink">Sales overview</h4>
                  <span className="font-mono text-[11px] text-kolo-muted-light bg-kolo-paper-alt px-2 py-1 rounded-md">Last 7 days</span>
                </div>
                <div className="h-[280px]">
                  {mounted && (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 4, right: 0, bottom: 0, left: 0 }} barCategoryGap="25%">
                        <XAxis dataKey="day" axisLine={false} tickLine={false} interval={0} tick={<DayTick />} />
                        <Tooltip content={<ChartTooltip />} cursor={{ fill: koloColors.paperAlt, opacity: 0.5 }} />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]} animationDuration={1200} animationBegin={200} animationEasing="ease-out">
                          {chartData.map((d) => (
                            <Cell
                              key={d.day}
                              fill={d.day === 'Today' ? koloColors.currency : d.day === 'Sat' ? koloColors.ink : koloColors.hairline}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Recent Orders Panel */}
              <div className="bg-white border border-kolo-hairline rounded-xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-[13px] m-0 font-bold text-kolo-ink">Recent orders</h4>
                  <span className="text-[11px] font-bold text-kolo-currency hover:underline cursor-pointer">View all</span>
                </div>

                <div className="space-y-3">
                  {[
                    { item: 'Nike Air Force', status: 'Paid', paid: true, amount: '₦45k' },
                    { item: 'Black Hoodie', status: 'Paid', paid: true, amount: '₦18k' },
                    { item: 'Slides', status: 'Paid', paid: true, amount: '₦12k' },
                    { item: 'Cap', status: 'Pending', paid: false, amount: '₦5k' },
                  ].map((order, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-kolo-hairline/50 last:border-0 last:pb-0">
                      <div>
                        <div className="font-semibold text-[13px] text-kolo-ink">{order.item}</div>
                        <div className="font-mono text-[11px] text-kolo-muted-light">{order.amount}</div>
                      </div>
                      {order.paid ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-kolo-currency/10 text-kolo-currency text-[10px] font-bold">
                          <svg viewBox="0 0 14 14" className="w-3 h-3" fill="none">
                            <path d="M3.2 7.2 5.6 9.6 10.8 4.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          {order.status}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-kolo-stamp/10 text-kolo-stamp text-[10px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-kolo-stamp" />
                          {order.status}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 0.75; }
          75%, 100% { transform: scale(2.5); opacity: 0; }
        }
        .animate-ping-slow {
          animation: ping-slow 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-ping-slow { animation: none; }
        }
      `}</style>
    </div>
  );
}