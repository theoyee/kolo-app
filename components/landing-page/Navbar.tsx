"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`sticky top-0 z-50 ${isScrolled ? "bg-kolo-paper-soft/85 backdrop-blur-xl backdrop-saturate-150 shadow-kolo-nav border border-kolo-hairline/80" : "py-3 md:py-4"}`}>
      <header className="max-w-7xl w-[calc(100%-48px)] mx-auto relative">
        <nav
          className={`h-[64px] flex border-0 items-center justify-between px-5 transition-all duration-400 ease-out ${isScrolled
            ? ''
            : 'bg-transparent border border-transparent'
            }`}
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-[10px] text-[22px] font-bold tracking-tight text-kolo-ink z-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kolo-currency rounded-md"
          >
            <span className="w-8 h-8 rounded-md bg-kolo-ink flex items-center justify-center text-white font-black text-lg transition-colors hover:bg-kolo-currency">
              K
            </span>
            Kolo
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-8 text-kolo-muted text-[14px] font-semibold">
            <Link href="#features" className="hover:text-kolo-ink focus-visible:text-kolo-ink focus-visible:outline-none transition-colors">Features</Link>
            <Link href="#solutions" className="hover:text-kolo-ink focus-visible:text-kolo-ink focus-visible:outline-none transition-colors">Solutions</Link>
            <Link href="#pricing" className="hover:text-kolo-ink focus-visible:text-kolo-ink focus-visible:outline-none transition-colors">Pricing</Link>
            <Link href="#resources" className="hover:text-kolo-ink focus-visible:text-kolo-ink focus-visible:outline-none transition-colors">Resources</Link>
          </div>

          {/* Actions & Hamburger */}
          <div className="flex gap-4 items-center z-50">
            <Link
              href="/login"
              className="hidden md:inline-block text-kolo-ink text-[14px] font-bold hover:text-kolo-currency focus-visible:outline-none transition-colors px-2"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="hidden md:inline-block bg-kolo-ink text-white px-5 py-2.5 rounded-lg text-[14px] font-bold shadow-sm hover:bg-kolo-ink-dark active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kolo-currency focus-visible:ring-offset-2 transition-all"
            >
              Create account
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden flex items-center justify-center w-11 h-11 border border-kolo-hairline/60 bg-white/50 rounded-lg text-kolo-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kolo-currency active:scale-95 transition-all"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="absolute top-[calc(100%+12px)] left-0 w-full bg-white/95 backdrop-blur-xl border border-kolo-hairline/70 rounded-2xl shadow-2xl p-6 flex flex-col gap-2 md:hidden z-40 transform origin-top animate-in fade-in slide-in-from-top-2 duration-200">
            <Link href="#features" onClick={toggleMenu} className="text-kolo-ink text-[16px] font-bold py-3 border-b border-kolo-hairline/50 hover:text-kolo-currency transition-colors">Features</Link>
            <Link href="#solutions" onClick={toggleMenu} className="text-kolo-ink text-[16px] font-bold py-3 border-b border-kolo-hairline/50 hover:text-kolo-currency transition-colors">Solutions</Link>
            <Link href="#pricing" onClick={toggleMenu} className="text-kolo-ink text-[16px] font-bold py-3 border-b border-kolo-hairline/50 hover:text-kolo-currency transition-colors">Pricing</Link>
            <Link href="#resources" onClick={toggleMenu} className="text-kolo-ink text-[16px] font-bold py-3 hover:text-kolo-currency transition-colors">Resources</Link>

            <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-kolo-hairline/70">
              <Link
                href="/login"
                onClick={toggleMenu}
                className="w-full text-center bg-kolo-paper-alt text-kolo-ink px-5 py-3.5 rounded-xl text-[15px] font-bold hover:bg-kolo-paper-alt-dark transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                onClick={toggleMenu}
                className="w-full text-center bg-kolo-ink text-white px-5 py-3.5 rounded-xl text-[15px] font-bold shadow-md active:scale-[0.98] transition-transform"
              >
                Create account
              </Link>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}