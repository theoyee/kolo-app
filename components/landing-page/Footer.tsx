"use client"

import { Check } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const TwitterIcon = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const LinkedinIcon = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const scatteredTools = [
  {
    name: 'WhatsApp',
    detail: 'Customer conversations',
    indent: '',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    ),
  },
  {
    name: 'Bank app',
    detail: 'Payment confirmation',
    indent: 'md:ml-8',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
      />
    ),
  },
  {
    name: 'Notebook',
    detail: 'Sales & inventory',
    indent: 'md:ml-16',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
      />
    ),
  },
  {
    name: 'Spreadsheet',
    detail: 'Business numbers',
    indent: 'md:ml-24',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    ),
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#FFFDF8] text-[#1B2A22] section">
      <div className="section-space md:flex items-center justify-center gap-12 flex-row-reverse  lg:gap-20">


        <div className="md:w-1/2 max-md:text-center ">
          <p className="font-mono text-[11px] text-[#2E6F4D]">
            your business, under control
          </p>

          <h2 className="mt-5 text-4xl font-bold leading-[1.1] tracking-[-0.03em] text-[#1B2A22] sm:text-5xl lg:text-6xl">
            Stop running your
            <br />
            business from memory.
          </h2>

          <p className="mt-6 max-w-xl text-base leading-7 text-[#6E6152]">
            Track sales. Manage inventory. Understand your money.
            Everything your business needs, in one place.
          </p>

          {/* CTA */}
          <div className="mt-9 flex  gap-4 sm:flex-row sm:items-center max-md:justify-center">
            <a href='/signup' className="flex w-fit items-center justify-center bg-[#2E6F4D] hover:bg-[#25583D] text-white px-5 py-3 rounded-sm font-semibold transition-colors">
              Start for free
            </a>

            <a
              href="/demo"
              className="flex w-fit items-center justify-center bg-transparent hover:bg-[#F7F4EE] text-[#1B2A22] px-5 py-3 border border-[#D9CFB8] rounded-sm font-semibold transition-colors"
            >
              Book a demo
            </a>
          </div>

          {/* Reassurance */}
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
            {['No setup fee', 'Start for free', 'Built for Nigeria'].map((item) => (
              <div
                key={item}
                className="flex items-center gap-1.5 text-xs font-medium text-white/70"
              >
                <Check size={12} strokeWidth={3} className="text-white" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className='md:w-1/2'>
          <Image src="/brand/kolo_tally_mascot.svg" width={1000} height={1000} alt="kolo mascot" className="-ml-20" />
        </div>



        {/* <div className="flex flex-col gap-3 md:pl-8 lg:pl-0">
          {scatteredTools.map((tool) => (
            <div
              key={tool.name}
              className={`flex items-center gap-3 rounded-xs border border-[#D9CFB8] bg-white p-5 shadow-sm transition-colors duration-300 hover:bg-[#FFFDF8] ${tool.indent}`}
            >
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#F7F4EE] text-[#1B2A22]">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {tool.icon}
                </svg>
              </div>
              <div>
                <p className="text-[14.5px] font-semibold text-[#1B2A22]">{tool.name}</p>
                <p className="text-[12.5px] text-[#8A7F6D]">{tool.detail}</p>
              </div>
            </div>
          ))}

          <div className="relative flex items-center gap-3 rounded-xl border-t-2 border-double border-[#C2410C] bg-[#1B2A22] p-5 shadow-lg md:ml-32">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/10 text-[#C2410C]">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
            <div>
              <p className="text-[14.5px] font-semibold text-white">Kolo</p>
              <p className="text-[12.5px] text-white/50">Everything in one place</p>
            </div>
          </div>
        </div> */}
      </div>

      {/* Receipt perforation */}
      <div className="border-b-2 border-dashed border-[#D9CFB8] my-24" />

      {/* Main footer */}
      <div className="section-space">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <span className="grid size-6 text-transparent place-items-center bg-[#2E6F4D] rounded-full text-sm font-black text[#FFFDF8]">
                K
              </span>
              <span className="font-sans text-xl font-black  tracking-[-0.03em]">
                Kolo
              </span>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-6 text-[#6E6152]">
              Simple business management software built for
              businesses in Nigeria.
            </p>

            {/* Social — plain icons, no colored circles */}
            <div className="mt-6 flex items-center gap-4">
              {[
                { icon: TwitterIcon, href: '#', label: 'Twitter' },
                { icon: InstagramIcon, href: '#', label: 'Instagram' },
                { icon: LinkedinIcon, href: '#', label: 'LinkedIn' },
              ].map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="text-[#8A7F6D] transition hover:text-[#2E6F4D]"
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Product */}
          <div>
            <p className="text-sm font-bold text-[#1B2A22]">
              Product
            </p>
            <div className="mt-5 space-y-3">
              {[
                ['Features', '/features'],
                ['Pricing', '/pricing'],
                ['Sales & POS', '/sales'],
                ['Inventory', '/inventory'],
                ['Reports', '/reports'],
              ].map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  className="block text-sm text-[#6E6152] transition hover:text-[#1B2A22]"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <p className="text-sm font-bold text-[#1B2A22]">
              Resources
            </p>
            <div className="mt-5 space-y-3">
              {[
                ['Blog', '/blog'],
                ['Guides', '/guides'],
                ['Kolo Academy', '/academy'],
                ['Templates', '/templates'],
                ['Help Centre', '/help'],
              ].map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  className="block text-sm text-[#6E6152] transition hover:text-[#1B2A22]"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <p className="text-sm font-bold text-[#1B2A22]">
              Company
            </p>
            <div className="mt-5 space-y-3">
              {[
                ['About Kolo', '/about'],
                ['Contact', '/contact'],
                ['Careers', '/careers'],
                ['Privacy', '/privacy'],
                ['Terms', '/terms'],
              ].map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  className="block text-sm text-[#6E6152] transition hover:text-[#1B2A22]"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar — mono for numerals/tagline */}
        <div className="mt-14 flex flex-col justify-between gap-4 border-t border-[#D9CFB8] pt-7 text-xs text-[#8A7F6D] sm:flex-row">
          <p>
            <span className="font-mono">© {year}</span> Kolo Technologies. All rights reserved.
          </p>
          <p className="font-mono">Built for Nigerian businesses.</p>
        </div>
      </div>
    </footer>
  );
}