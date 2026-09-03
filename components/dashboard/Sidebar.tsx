/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart, Boxes, CreditCard, Home, Package, Receipt, Settings, ShoppingBag, Users } from 'lucide-react';

const NAV_ITEMS = [
  {
    href: '/dashboard',
    label: 'Overview',
    icon: <Home className="w-5 h-5" /> // Matches your house SVG
  },
  {
    href: '/dashboard/sales',
    label: 'Sales / POS',
    icon: <CreditCard className="w-5 h-5" />
  },
  {
    href: '/dashboard/orders',
    label: 'Orders',
    icon: <Package className="w-5 h-5" /> // Matches your 3D Box SVG
  },
  {
    href: '/dashboard/products',
    label: 'Products',
    icon: <ShoppingBag className="w-5 h-5" />
  },
  {
    href: '/dashboard/inventory',
    label: 'Inventory',
    icon: <Boxes className="w-5 h-5" /> // Great for inventory/stock
  },
  {
    href: '/dashboard/customers',
    label: 'Customers',
    icon: <Users className="w-5 h-5" /> // Matches your person SVG
  },
  {
    href: '/dashboard/expenses',
    label: 'Expenses',
    icon: <Receipt className="w-5 h-5" />
  },
  {
    href: '/dashboard/reports',
    label: 'Reports',
    icon: <BarChart className="w-5 h-5" /> // Matches your bar chart SVG
  },
  {
    href: '/dashboard/settings',
    label: 'Settings',
    icon: <Settings className="w-5 h-5" />
  }
];



interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
  className?: any
}

export default function Sidebar({ isOpen, closeSidebar, className }: SidebarProps) {
  const pathname = usePathname();


  // const [activeTab, setActiveTab] = useState<string>("/dashboard");

  // useEffect(() => {
  //   if (pathname) {
  //     setActiveTab(pathname)
  //   }
  // }, [pathname])

  console.log(pathname)

  const activeTab = pathname || '/dashboard';



  return (
    <>
      {isOpen && (
        <div className="fixed inset0 bg-[#10201a]/40  lg:hidden transition-opacity" onClick={closeSidebar} />
      )}

      <aside className={`${className} space-y-10 md:block borderr border[#D9CFB8] bgwhite p-[20px_14px] fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0  ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="text-[15px] px-2 flex items-center gap-2.5  text-[#1B2A22] mb-10">
          <span className="w-6 h-6 rounded-md bg-[#1B2A22] flex items-center justify-center text-white text-[11px] font-black">K</span>
          Kolo
        </div>

        <nav className="text-[#6b7873] flex flex-col gap-3 mt-4">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base cursor-pointer transition-colors ${activeTab == item?.href
                ? 'bg-[#F7F4EE] text-[#1B2A22] font-bold border border-[#D9CFB8]'
                : 'text-[#8A7F6D] font-medium hover:bg-[#F7F4EE]/60 hover:text-[#1B2A22]'
                }`}
            >
              <svg viewBox="0 0 20 20" className={`w-4 h-4 shrink-0 ${activeTab == item?.href ? 'text-[#2E6F4D]' : ''}`}>{item.icon}</svg>
              {item.label}
            </Link>


          ))}
          <small className="block px-3 pt-[18px] pb-[7px] uppercase text-[10px] tracking-[0.1em] text-[#9aa49f]">Account</small>
          <Link href="/auth" className="block w-full text-left px-3 py-[11px] rounded-[9px] my-[3px] hover:bg-gray-50">
            Log out
          </Link>
        </nav>



        <div className="mt-8 border-t border-[#1B2A22]/10 pt-6">
          <p className="px-3 font-mono text-[10px] text-[#8A7F6D]">
            business
          </p>

          <div className="mt-3 flex items-center gap-3 px-3">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-[#2E6F4D] font-mono text-[10px] font-medium text-white">
              LF
            </div>

            <div>
              <p className="text-[11px] font-bold text-[#1B2A22]">
                Lumo Foods
              </p>
              <p className="text-[9px] text-[#8A7F6D]">
                Business account
              </p>
            </div>
          </div>
        </div>

      </aside>
    </>
  );
}