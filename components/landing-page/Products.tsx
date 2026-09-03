'use client';

import { ArrowRight } from 'lucide-react';
import DashboardMockup from './DashboardMockup';

// Same token/type system as the rest of the site.

const sales = [
  {
    name: 'Lumo Foods',
    time: '2 mins ago',
    amount: '+₦450,000',
  },
  {
    name: 'Apex Stores',
    time: '18 mins ago',
    amount: '+₦185,500',
  },
  {
    name: 'Sarah Collections',
    time: '42 mins ago',
    amount: '+₦92,000',
  },
];

export function ProductShowcase() {
  return (
    <section className="overflow-hidden bg-kolo-ink text-white">
      <div className="section">
        <div className="section-space">
          {/* Header */}
          <div className="grid gap-10 lg:grid-cols-[1fr_0.75fr] lg:items-end">
            <div className="max-w-3xl">
              <p className="font-mono text-[11px] text-kolo-mint">
                the kolo dashboard
              </p>

              <h2 className="mt-4 text-4xl font-bold leading-[1.06] tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl">
                Your whole business, at a glance
              </h2>
            </div>

            <p className="max-w-md text-sm leading-6 text-white/45 lg:pb-1">
              Stop piecing together information from notebooks, WhatsApp
              messages and spreadsheets. Kolo puts the numbers that matter
              in one place.
            </p>
          </div>

          {/* Live sales feed — puts real motion behind the claim above */}
          <div className="mt-9 grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-3">
            {sales.map((sale, i) => (
              <div key={sale.name} className="flex items-center gap-3">
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${i === 0 ? 'bg-kolo-currency' : 'bg-white/20'
                    }`}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12.5px] font-medium text-white/75">
                    {sale.name}
                  </p>
                  <p className="font-mono text-[10.5px] text-white/35">
                    {sale.time}
                  </p>
                </div>
                <span className="font-mono text-[12.5px] text-kolo-mint">
                  {sale.amount}
                </span>
              </div>
            ))}
          </div>

          <DashboardMockup className="max-md:w-full" />

          {/* Bottom message */}
          <div className="mt-10 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center">
            <p className="max-w-xl text-sm leading-6 text-white/40">
              From your first sale of the day to your end-of-day numbers,
              Kolo keeps everything connected.
            </p>

            <a
              href="/signup"
              className="flex w-fit items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-kolo-mint"
            >
              Explore Kolo
              <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}