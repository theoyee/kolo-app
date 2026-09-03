import React from 'react';
import Image from 'next/image';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { koloColors } from '@/utils/constants';

const BRAND_IMAGE_SRC = '/brand/panel-background10.jpg';

/**
 * Kolo Auth Layout
 *
 * Same token system used across the marketing site:
 *
 *   Ink              #1B2A22   (primary dark / brand panel background)
 *   Currency green   #2E6F4D   (primary accent / action color)
 *   Accent-on-dark   #8FD9B4   (light green, for figures on ink backgrounds)
 *   Stamp orange     #C2410C   (reserved — recommended/verified marks only)
 *   Paper            #FBF7EE / #FFFDF8
 *   Hairline         #D9CFB8
 *   Muted text       #6E6152 / #8A7F6D
 *
 * font-sans (Instrument Sans) for headings/body.
 * font-mono (IBM Plex Mono) for all numerals and figures.
 */

type Transaction = {
  id: string;
  label: string;
  amount: string;
  direction: 'in' | 'out';
};

const SAMPLE_BALANCE = '₦2,850,930';
const SAMPLE_TREND = '+18.4%';

const SAMPLE_TRANSACTIONS: Transaction[] = [
  {
    id: 'txn-1',
    label: 'Payment from Lumo Foods',
    amount: '+₦450,000',
    direction: 'in',
  },
  {
    id: 'txn-2',
    label: 'Inventory restock',
    amount: '-₦120,000',
    direction: 'out',
  },
];

const SPARKLINE_VALUES = [32, 28, 30, 18, 22, 10, 14, 4, 8];

function toPolylinePoints(values: number[], width = 200): string {
  const step = width / (values.length - 1);

  return values
    .map((y, i) => `${i * step},${y}`)
    .join(' ');
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-[1.05fr_1fr] bg-white font-sans text-kolo-ink">
      {/* =========================================================
          BRAND PANEL
          ========================================================= */}
      <aside
        aria-label="Kolo product highlights"
        className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-kolo-ink px-14 py-12 text-white"
      >
        {/* Background image with a single ink overlay for legibility */}
        <div aria-hidden="true" className="absolute inset-0">
          <Image
            src={BRAND_IMAGE_SRC}
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 0px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-kolo-ink/75 via-kolo-ink/85 to-kolo-ink/95" />
        </div>

        {/* =====================================================
            LOGO
            ===================================================== */}
        <div className="relative flex items-center gap-2 text-white text-2xl font-bold tracking-tight">
          <span className="grid place-items-center bg-white text-kolo-ink font-black rounded-lg w-[30px] h-[30px] text-sm">
            K
          </span>
          Kolo
        </div>

        {/* =====================================================
            HERO CONTENT
            ===================================================== */}
        <div className="relative max-w-[450px]">
          <p className="text-[36px] leading-[1.14] font-bold mb-3 text-white">
            <span className="block text-[20px] font-medium text-white/60 mb-1">
              For business owners who
            </span>
            Track every naira in and out.
          </p>

          <p className="text-[15px] text-white/60 mb-8">
            Invoicing, inventory, and reports — all built in.
          </p>

          {/* ===================================================
              BUSINESS BALANCE CARD
              =================================================== */}
          <div
            role="group"
            aria-label="Illustrative business balance overview"
            className="relative bg-white/[0.04] backdrop-blur-sm border border-white/10 rounded-2xl p-5 mb-10 shadow-kolo-panel"
          >
            {/* Card header */}
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[11px] text-white/50">
                business balance
              </span>

              <span className="font-mono text-[11px] font-medium text-kolo-mint bg-white/10 px-2 py-[3px] rounded-full">
                {SAMPLE_TREND}
              </span>
            </div>

            {/* Balance */}
            <p className="font-mono text-[28px] font-medium mb-4 tabular-nums text-white">
              {SAMPLE_BALANCE}
            </p>

            {/* Sparkline */}
            <svg
              viewBox="0 0 200 40"
              className="w-full h-8 mb-4"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polyline
                points={toPolylinePoints(SPARKLINE_VALUES)}
                fill="none"
                stroke={koloColors.mint}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Transactions */}
            <div className="space-y-2.5 pt-3 border-t border-white/10">
              {SAMPLE_TRANSACTIONS.map((txn) => (
                <div
                  key={txn.id}
                  className="flex items-center justify-between text-[13px]"
                >
                  <span className="flex items-center gap-2 text-white/70">
                    {txn.direction === 'in' ? (
                      <ArrowUpRight
                        className="w-3.5 h-3.5 text-kolo-mint shrink-0"
                        strokeWidth={2.5}
                        aria-hidden="true"
                      />
                    ) : (
                      <ArrowDownRight
                        className="w-3.5 h-3.5 text-white/40 shrink-0"
                        strokeWidth={2.5}
                        aria-hidden="true"
                      />
                    )}
                    {txn.label}
                  </span>

                  <span
                    className={`font-mono font-medium tabular-nums ${txn.direction === 'in' ? 'text-kolo-mint' : 'text-white/60'
                      }`}
                  >
                    {txn.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ===================================================
              TESTIMONIAL
              =================================================== */}
          <blockquote className="border-t border-white/15 pt-6 m-0">
            <p className="text-[15px] text-white/85 leading-relaxed mb-3">
              {`"`}Kolo cut our closing process from three days to an
              afternoon. It finally feels like software built for how we
              actually run the shop.{`"`}
            </p>

            <footer className="text-[13px] text-white/50">
              <cite className="not-italic block font-medium text-white/70">
                Ifeoma Chukwu
              </cite>
              Founder, Lumo Foods
            </footer>
          </blockquote>
        </div>

        {/* =====================================================
            TRUSTED BUSINESSES
            ===================================================== */}
        <p className="relative font-mono text-[12px] text-white/45">
          Trusted by 4,200+ businesses across Nigeria
        </p>
      </aside>

      {/* =========================================================
          RIGHT COLUMN
          ========================================================= */}
      <main className="grid place-items-center px-6 py-12 bg-gradient-to-b from-kolo-paper-soft to-white">
        <div className="w-[min(420px,100%)]">
          {/* Mobile logo */}
          <div className="mb-8 lg:hidden flex items-center gap-2 text-[20px] font-bold tracking-tight text-kolo-ink">
            <span className="grid place-items-center bg-kolo-ink text-white rounded-lg w-[30px] h-[30px]">
              K
            </span>
            Kolo
          </div>

          {/* Auth page content */}
          {children}
        </div>
      </main>
    </div>
  );
}