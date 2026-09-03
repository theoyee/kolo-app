"use client"

import { Check } from "lucide-react";
import DashboardMockup from "./DashboardMockup";

import Image from "next/image";

// Same type/color system as the other refactored sections:
// ink #1B2A22, currency green #2E6F4D, paper #FBF7EE/#FFFDF8,
// font-sans (Instrument Sans) for headline/body, font-mono (IBM Plex Mono)
// for numerals and small data labels.

export default function HeroSection() {
  return (
    <section className="section">


      <div className="section-space    xl:-mt-32">

        <div className="grid grid-cols-1 lg:grid-cols-[2fr__2fr] items-center relative">
          <div className="hero-content max-lg:text-center">
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-kolo-currency opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-kolo-currency" />
              </span>
              <span className="font-mono text-[13px] text-kolo-ink">
                ₦2,481,900 tracked today
              </span>
            </div>

            <h1 className="font-sans text-6xl lg:text-6xl leading-[1.08] font-bold tracking-[-0.03em] text-kolo-ink mb-5">
              Run your business.
              <br />
              Know your numbers.
            </h1>

            <p className="text-xl text-kolo-muted mb-10 max-lg:mx-auto max-w-[500px]">
              Kolo unifies sales, orders, inventory, customers, and payments — so
              every number in your business is one glance away.
            </p>

            <div className="flex gap-4 items-center max-lg:justify-center mb-6">
              <button className="bg-kolo-currency hover:bg-kolo-currency-dark text-white px-5 py-3 rounded-sm font-semibold transition-colors">
                Start for free
              </button>
              <button className="bg-transparent hover:bg-kolo-paper-alt text-kolo-ink px-5 py-3 border border-kolo-hairline rounded-sm font-semibold transition-colors">
                See how it works
              </button>
            </div>

            <div className="flex gap-5 text-[#6E6152] text-sm max-lg:justify-center">
              <span className="flex items-center gap-1.5">
                <Check size={14} className="text-kolo-currency" strokeWidth={2.5} />
                No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <Check size={14} className="text-kolo-currency" strokeWidth={2.5} />
                Live in minutes
              </span>
              <span className="flex items-center gap-1.5 max-md:hidden">
                <Check size={14} className="text-kolo-currency" strokeWidth={2.5} />
                Built for Naira
              </span>
            </div>
          </div>

          <div className="bgblack max-lg:absolute max-lg:-bottom-20 max-lg:-right-8 max-lg:rotate-18 max-lg:size-40">
            <Image src="/brand/kolo_keeper_mascot.svg" width={1000} height={1000} alt="kolo mascot" className="max-l:hidden" />

          </div>

        </div>

        <DashboardMockup className="hover:perspective-dramatic" />

      </div>

    </section>
  );
}