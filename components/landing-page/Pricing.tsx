/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Check } from 'lucide-react';

/**
 * Fonts — add once in your root layout (Next.js `next/font/google`):
 *
 *   import { Instrument_Sans, IBM_Plex_Mono } from 'next/font/google';
 *   const instrument = Instrument_Sans({ subsets: ['latin'], variable: '--font-instrument' });
 *   const plexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-plex-mono' });
 *
 * then add `${instrument.variable} ${plexMono.variable}` to your <body> className.
 * The classes below (`font-sans`, `font-mono`) will pick them up if you wire
 * those variables into tailwind.config.js as the `sans`/`mono` families —
 * otherwise swap the class names for arbitrary `font-[...]` values.
 */

const plans = [
  {
    name: 'Starter',
    description: 'For a single till, just getting the books straight.',
    price: '₦0',
    period: '/ forever',
    features: [
      'Up to 50 products',
      'Sales & POS',
      'Basic inventory',
      'Customer records',
      'Basic reports',
    ],
    button: 'Create free account',
    featured: false,
  },
  {
    name: 'Business',
    description: 'For shops ready to run stock and staff properly.',
    price: '₦5,000',
    period: '/ month',
    features: [
      'Unlimited products',
      'Sales & POS',
      'Full inventory management',
      'Customer records',
      'Expense tracking',
      'Advanced reports',
      'Multiple staff accounts',
    ],
    button: 'Start Business plan',
    featured: true,
    stamp: 'Most chosen',
  },
  {
    name: 'Scale',
    description: 'For operations running more than one location.',
    price: '₦15,000',
    period: '/ month',
    features: [
      'Everything in Business',
      'Multiple locations',
      'Advanced analytics',
      'Staff permissions',
      'Priority support',
      'Business insights',
    ],
    button: 'Talk to sales',
    featured: false,
  },
];

function TicketNotches({ side }: any) {
  // Two small punched circles at the ends of the perforation line,
  // colored to match the section background so they read as cut-outs.
  return (
    <div
      className={`pointer-events-none absolute ${side === 'top' ? 'top-[92px]' : 'top-[92px]'} left-0 right-0 -mx-[7px] flex justify-between`}
    >
      <span className="h-3.5 w-3.5 rounded-full bg-kolo-paper-soft" />
      <span className="h-3.5 w-3.5 rounded-full bg-kolo-paper-soft" />
    </div>
  );
}

function FeatureRow({ label, dark }: any) {
  return (
    <div className="flex items-baseline gap-2 text-[13.5px] leading-6">
      <span className={dark ? 'text-white/80' : 'text-kolo-ink'}>{label}</span>
      <span
        className={`h-px flex-1 translate-y-[-3px] border-b border-dotted ${dark ? 'border-white/25' : 'border-kolo-hairline-dark'
          }`}
      />
      <Check
        size={13}
        strokeWidth={2.5}
        className={dark ? 'text-kolo-mint' : 'text-kolo-currency'}
      />
    </div>
  );
}

export function PricingSection() {
  return (
    <section id="pricing" className="bg-kolo-paper-soft section">
      <div className="section-space">
        {/* Header */}
        <div className="max-w-xl">
          <h2 className="font-sans text-4xl font-bold leading-[1.08] tracking-[-0.03em] text-kolo-ink sm:text-5xl">
            Pricing that fits your till
          </h2>
          <p className="mt-4 text-[15px] leading-6 text-kolo-muted">
            Every plan includes POS, so you can start selling in minutes.
            Upgrade when your inventory and team outgrow the free tier.
          </p>
        </div>

        {/* Plans */}
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative border ${plan.featured
                ? 'border-kolo-ink bg-kolo-ink text-white'
                : 'border-kolo-hairline bg-kolo-paper'
                }`}
            >
              {plan.stamp && (
                <div
                  className="absolute -right-3 -top-3 z-10 flex h-16 w-16 rotate-[9deg] items-center justify-center rounded-full border-2 border-double border-kolo-stamp-light bg-kolo-stamp text-center font-mono text-[9.5px] font-medium uppercase leading-tight text-kolo-stamp-ink"
                  aria-hidden="true"
                >
                  {plan.stamp}
                </div>
              )}

              {/* Card header */}
              <div className="relative px-6 pb-6 pt-7">
                <p className="font-mono text-[11px] text-kolo-currency">
                  {plan.featured ? 'business plan' : `${plan.name.toLowerCase()} plan`}
                </p>
                <h3
                  className={`mt-1 text-xl font-bold ${plan.featured ? 'text-white' : 'text-kolo-ink'
                    }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`mt-2 text-[13.5px] leading-5 ${plan.featured ? 'text-white/60' : 'text-kolo-muted'
                    }`}
                >
                  {plan.description}
                </p>
              </div>

              {/* Perforation */}
              <div
                className={`relative border-t border-dashed ${plan.featured ? 'border-white/25' : 'border-kolo-hairline-dark'
                  }`}
              >
                <TicketNotches side="top" />
              </div>

              {/* Price */}
              <div className="flex items-end gap-1.5 px-6 pb-6 pt-6">
                <span className="font-mono text-[34px] font-medium tracking-tight">
                  {plan.price}
                </span>
                <span
                  className={`pb-1 font-mono text-[12px] ${plan.featured ? 'text-white/45' : 'text-kolo-muted-light'
                    }`}
                >
                  {plan.period}
                </span>
              </div>

              {/* Features */}
              <div className="space-y-3 px-6 pb-7">
                {plan.features.map((feature) => (
                  <FeatureRow key={feature} label={feature} dark={plan.featured} />
                ))}
              </div>

              {/* CTA */}
              <div className="px-6 pb-7">
                <a
                  href="/signup"
                  className={`flex w-full items-center justify-center rounded-sm py-3 text-sm font-semibold transition-colors ${plan.featured
                    ? 'bg-kolo-currency text-white hover:bg-kolo-currency-dark'
                    : 'bg-kolo-ink text-white hover:bg-kolo-ink-dark'
                    }`}
                >
                  {plan.button}
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Small print */}
        <p className="mt-8 font-mono text-[11px] text-kolo-muted-light">
          No setup fees. Cancel anytime. Prices exclude applicable taxes.
        </p>
      </div>
    </section>
  );
}