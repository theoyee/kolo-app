/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  ArrowUpRight,
  BookOpen,
  Calculator,
  FileText,
  PlayCircle,
} from 'lucide-react';

// Uses the same type system as PricingSection.jsx — Instrument Sans (font-sans)
// and IBM Plex Mono (font-mono). See that file's header comment for setup.

const resources = [
  {
    type: 'Guide',
    icon: BookOpen,
    title: 'How to know if your business is actually profitable',
    description:
      'A practical guide to understanding revenue, expenses and profit.',
    meta: '8 min read',
  },
  {
    type: 'Template',
    icon: FileText,
    title: 'Small business expense tracker',
    description:
      'A simple template for keeping track of every business expense.',
    meta: 'Free template',
  },
  {
    type: 'Tool',
    icon: Calculator,
    title: 'Profit margin calculator',
    description:
      'Find out exactly how much profit you are making on every product.',
    meta: 'Free tool',
  },
];

function ResourceCard({ resource }: any) {
  const Icon = resource.icon;

  return (
    <article className="group relative">
      {/* Folder tab */}
      <div className="absolute -top-[22px] left-6 flex items-center gap-1.5 rounded-t-md border border-b-0 border-kolo-hairline bg-kolo-paper px-3 py-1.5">
        <Icon size={12} className="text-kolo-currency" />
        <span className="font-mono text-[10.5px] text-kolo-muted">
          {resource.type}
        </span>
      </div>

      <div className="relative border border-kolo-hairline bg-kolo-paper pl-7 pr-6 pt-8">
        {/* Left margin rule, like a reference card */}
        <span className="absolute bottom-6 left-4 top-8 w-px bg-kolo-accent-soft" aria-hidden="true" />

        <h3 className="text-lg font-bold leading-snug tracking-[-0.01em] text-kolo-ink">
          {resource.title}
        </h3>

        <div className="my-4 border-t border-kolo-hairline-soft" />

        <p className="text-[13.5px] leading-6 text-kolo-muted">
          {resource.description}
        </p>

        <div className="mt-6 flex items-center justify-between pb-6">
          <span className="font-mono text-[11px] text-kolo-muted-light">
            {resource.meta}
          </span>

          <a
            href="#"
            className="flex items-center gap-1 text-[12.5px] font-semibold text-kolo-ink transition-colors hover:text-kolo-currency"
          >
            Read more
            <ArrowUpRight size={13} />
          </a>
        </div>
      </div>
    </article>
  );
}

export function ResourcesSection() {
  return (
    <section id="resources" className="bg-white section">
      <div className="section-space">
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <h2 className="font-sans text-4xl font-bold leading-[1.08] tracking-[-0.03em] text-kolo-ink sm:text-5xl">
              Build a better business
            </h2>
            <p className="mt-4 text-[15px] leading-6 text-kolo-muted">
              Practical guides, tools and ideas to help you make better
              business decisions.
            </p>
          </div>

          <a
            href="/resources"
            className="flex items-center gap-1.5 text-sm font-semibold text-kolo-ink transition-colors hover:text-kolo-currency"
          >
            Explore all resources
            <ArrowUpRight size={15} />
          </a>
        </div>

        {/* Resource cards */}
        <div className="mt-16 grid gap-x-6 gap-y-10 lg:grid-cols-3">
          {resources.map((resource) => (
            <ResourceCard key={resource.title} resource={resource} />
          ))}
        </div>

        {/* Academy strip */}
        <div className="mt-14 grid gap-6 border border-kolo-ink bg-kolo-ink p-7 md:grid-cols-[auto_1fr_auto] md:items-center lg:p-9">
          <div className="grid h-12 w-12 place-items-center rounded-sm bg-kolo-currency text-white">
            <PlayCircle size={21} />
          </div>

          <div>
            <p className="font-mono text-[11px] text-kolo-mint">
              kolo academy
            </p>
            <h3 className="mt-1.5 text-lg font-bold text-white">
              Learn how to run your business better.
            </h3>
            <p className="mt-1 text-[13.5px] text-white/45">
              Short, practical lessons made for Nigerian business owners.
            </p>
          </div>

          <a
            href="/academy"
            className="flex items-center justify-center rounded-sm bg-white px-5 py-3 text-sm font-semibold text-kolo-ink transition-colors hover:bg-kolo-paper"
          >
            Visit Academy
          </a>
        </div>
      </div>
    </section>
  );
}