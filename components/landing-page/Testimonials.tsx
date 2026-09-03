/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Check } from 'lucide-react';

// Same type/color system as PricingSection.jsx and ResourcesSection.jsx.

const testimonials = [
  {
    quote:
      'Before Kolo, I was using a notebook for sales and WhatsApp to keep track of customers. Now I can see exactly what is happening in my business.',
    name: 'Ifeoma Chukwu',
    role: 'Founder, Lumo Foods',
    initials: 'IC',
  },
  {
    quote:
      'The biggest difference is knowing what I actually made at the end of the day. I no longer have to calculate everything manually.',
    name: 'Daniel Okafor',
    role: 'Owner, Apex Stores',
    initials: 'DO',
  },
  {
    quote:
      'Inventory used to be my biggest headache. Kolo makes it obvious what is running low before it becomes a problem.',
    name: 'Amaka Nwosu',
    role: 'Founder, Amaka Collections',
    initials: 'AN',
  },
];

function VerifiedStamp({ dark }: any) {
  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[9.5px] ${dark ? 'border-kolo-mint/40 text-kolo-mint' : 'border-kolo-currency/30 text-kolo-currency'
        }`}
    >
      <Check size={9} strokeWidth={3} />
      verified customer
    </div>
  );
}

export function Testimonials() {
  const [featured, ...rest] = testimonials;

  return (
    <section className="bg-kolo-paper-alt section">
      <div className="section-space">
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-[11px] text-kolo-currency">
              trusted by shop owners across nigeria
            </p>
            <h2 className="mt-3 max-w-xl text-4xl font-bold leading-[1.08] tracking-[-0.03em] text-kolo-ink sm:text-5xl">
              Less guessing, more knowing
            </h2>
          </div>

          <div className="flex items-center gap-2 text-kolo-muted">
            <span className="font-mono text-lg font-medium text-kolo-ink">4.9</span>
            <span className="text-xs">average rating from 300+ business owners</span>
          </div>
        </div>

        {/* Featured testimonial */}
        <div className="mt-14 grid overflow-hidden border border-kolo-ink lg:grid-cols-[1.15fr_0.85fr]">
          {/* Quote */}
          <div className="bg-kolo-ink p-8 sm:p-12 lg:p-16">
            <blockquote className="max-w-2xl text-2xl font-bold leading-[1.3] tracking-[-0.015em] text-white sm:text-3xl">
              {featured.quote}
            </blockquote>

            <div className="mt-10 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-kolo-currency font-mono text-xs font-medium text-white">
                {featured.initials}
              </div>
              <div>
                <p className="text-sm font-bold text-white">{featured.name}</p>
                <p className="mt-0.5 text-xs text-white/45">{featured.role}</p>
              </div>
              <div className="ml-2">
                <VerifiedStamp dark />
              </div>
            </div>
          </div>

          {/* Ledger-style stat */}
          <div className="flex flex-col justify-between border-t border-kolo-ink bg-kolo-paper p-8 sm:p-12 lg:border-l lg:border-t-0 lg:p-16">
            <div>
              <p className="font-mono text-[11px] text-kolo-muted-light">their story</p>
              <p className="mt-3 max-w-xs text-sm leading-6 text-kolo-muted">
                Lumo Foods moved their sales, inventory and customer records
                into one place.
              </p>
            </div>

            <div className="mt-12 lg:mt-0">
              <p className="text-[11px] uppercase tracking-normal text-kolo-muted-light">
                Time to close the books
              </p>
              <p className="mt-2 font-mono text-lg text-kolo-muted-light line-through decoration-kolo-stamp/60">
                3 days
              </p>
              <p className="mt-1 flex items-baseline gap-2">
                <span className="font-mono text-5xl font-medium text-kolo-ink">1</span>
                <span className="font-mono text-lg text-kolo-ink">afternoon</span>
              </p>
              <p className="mt-4 max-w-xs text-xs leading-5 text-kolo-muted-light">
                Time saved during their regular business closing process.
              </p>
            </div>
          </div>
        </div>

        {/* Supporting testimonials */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {rest.map((testimonial) => (
            <article
              key={testimonial.name}
              className="border border-kolo-hairline bg-white p-7 sm:p-8"
            >
              <p className="text-base font-medium leading-7 text-kolo-ink">
                {testimonial.quote}
              </p>

              <div className="mt-7 flex items-center justify-between border-t border-kolo-hairline-soft pt-5">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-kolo-currency font-mono text-[9px] font-medium text-white">
                    {testimonial.initials}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-kolo-ink">
                      {testimonial.name}
                    </p>
                    <p className="mt-0.5 text-[10.5px] text-kolo-muted-light">
                      {testimonial.role}
                    </p>
                  </div>
                </div>

                <VerifiedStamp />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}