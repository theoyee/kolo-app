/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import {
  BarChart,
  Boxes,
  CreditCard,
  Home,
  Package,
  Receipt,
  Settings,
  ShoppingBag,
  Users,
  ChevronDown,
  Building2,
  Check,
} from 'lucide-react';
import {
  clearAuthSession,
  getActiveBusinessId,
  setActiveBusinessId,
  businessApi,
} from '@/lib/api';

const NAV_ITEMS = [
  {
    href: '/dashboard',
    label: 'Overview',
    icon: <Home className="w-5 h-5" />,
  },
  {
    href: '/dashboard/sales',
    label: 'Sales / POS',
    icon: <CreditCard className="w-5 h-5" />,
  },
  {
    href: '/dashboard/orders',
    label: 'Orders',
    icon: <Package className="w-5 h-5" />,
  },
  {
    href: '/dashboard/products',
    label: 'Products',
    icon: <ShoppingBag className="w-5 h-5" />,
  },
  {
    href: '/dashboard/inventory',
    label: 'Inventory',
    icon: <Boxes className="w-5 h-5" />,
  },
  {
    href: '/dashboard/customers',
    label: 'Customers',
    icon: <Users className="w-5 h-5" />,
  },
  {
    href: '/dashboard/expenses',
    label: 'Expenses',
    icon: <Receipt className="w-5 h-5" />,
  },
  {
    href: '/dashboard/reports',
    label: 'Reports',
    icon: <BarChart className="w-5 h-5" />,
  },
  {
    href: '/dashboard/settings',
    label: 'Settings',
    icon: <Settings className="w-5 h-5" />,
  },
];

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
  className?: any;
}

export default function Sidebar({ isOpen, closeSidebar, className }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const activeTab = pathname || '/dashboard';
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [activeBizId, setActiveBizIdState] = useState<string>('');
  const [showBizSwitcher, setShowBizSwitcher] = useState(false);

  const loadBusinesses = async () => {
    const currentBizId = getActiveBusinessId();
    setActiveBizIdState(currentBizId);

    try {
      const res = await businessApi.list();
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setBusinesses(res.data);
        if (!currentBizId || !res.data.some((b) => b.id === currentBizId)) {
          setActiveBizIdState(res.data[0].id);
          setActiveBusinessId(res.data[0].id);
        }
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadBusinesses();
    const handleBizChange = (e: any) => {
      if (e.detail?.businessId) {
        setActiveBizIdState(e.detail.businessId);
      }
    };
    window.addEventListener('kolo_business_changed', handleBizChange);
    return () => window.removeEventListener('kolo_business_changed', handleBizChange);
  }, []);

  const handleSelectBusiness = (biz: any) => {
    setActiveBizIdState(biz.id);
    setActiveBusinessId(biz.id);
    setShowBizSwitcher(false);
    toast.success(`Switched to "${biz.name}"`);
    // Reload active dashboard view
    router.refresh();
  };

  const handleLogout = () => {
    clearAuthSession();
    toast.info('Logged out successfully.');
    router.push('/login');
  };

  const currentBiz = businesses.find((b) => b.id === activeBizId) || {
    name: 'Olagoke Fashion',
  };

  const initials = currentBiz.name
    ? currentBiz.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'OF';

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-[#10201a]/40 lg:hidden transition-opacity z-40" onClick={closeSidebar} />
      )}

      <aside className={`${className || ''} space-y-6 md:block border-r border-[#D9CFB8] bg-white p-[20px_14px] fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 overflow-y-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="text-[15px] px-2 flex items-center justify-between text-[#1B2A22] mb-6">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-md bg-[#1B2A22] flex items-center justify-center text-white text-[11px] font-black">K</span>
            <span className="font-bold">Kolo</span>
          </div>
          <span className="text-[10px] font-mono uppercase bg-[#2E6F4D]/10 text-[#2E6F4D] px-2 py-0.5 rounded-full font-bold">
            Live
          </span>
        </div>

        {/* Store / Branch Switcher */}
        <div className="relative mb-4 px-1">
          <button
            type="button"
            onClick={() => setShowBizSwitcher(!showBizSwitcher)}
            className="w-full flex items-center justify-between p-2.5 rounded-xl border border-[#1B2A22]/10 bg-[#fafcfb] hover:border-[#2E6F4D]/40 transition text-left"
          >
            <div className="flex items-center gap-2.5 truncate">
              <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#2E6F4D] font-mono text-[10px] font-bold text-white">
                {initials}
              </div>
              <div className="truncate">
                <div className="text-[12px] font-bold text-[#1B2A22] truncate">{currentBiz.name}</div>
                <div className="text-[10px] text-[#8A7F6D] font-mono">Store Branch</div>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#8A7F6D] shrink-0 ml-1" />
          </button>

          {showBizSwitcher && (
            <div className="absolute left-1 right-1 top-full mt-1.5 bg-white border border-[#D9CFB8] rounded-xl shadow-xl z-50 p-1.5 space-y-1">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#8A7F6D]">
                Your Stores / Businesses
              </div>
              {businesses.length === 0 ? (
                <div className="p-2 text-xs text-[#8A7F6D]">No other stores found.</div>
              ) : (
                businesses.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => handleSelectBusiness(b)}
                    className="w-full flex items-center justify-between p-2 rounded-lg text-left text-xs font-medium hover:bg-[#F7F4EE] transition text-[#1B2A22]"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Building2 className="w-3.5 h-3.5 text-[#2E6F4D]" />
                      <span className="truncate">{b.name}</span>
                    </div>
                    {b.id === activeBizId && <Check className="w-3.5 h-3.5 text-[#2E6F4D]" />}
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <nav className="text-[#6b7873] flex flex-col gap-1.5">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-colors ${activeTab === item.href
                ? 'bg-[#F7F4EE] text-[#1B2A22] font-bold border border-[#D9CFB8]'
                : 'text-[#8A7F6D] font-medium hover:bg-[#F7F4EE]/60 hover:text-[#1B2A22]'
                }`}
            >
              <span className={`shrink-0 ${activeTab === item.href ? 'text-[#2E6F4D]' : ''}`}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
          <small className="block px-3 pt-[18px] pb-[7px] uppercase text-[10px] tracking-[0.1em] text-[#9aa49f]">Account</small>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-3 py-[11px] rounded-[9px] my-[3px] text-[#8A7F6D] hover:bg-gray-50 hover:text-[#1B2A22] transition-colors border-0 bg-transparent cursor-pointer font-sans text-sm"
          >
            Log out
          </button>
        </nav>
      </aside>
    </>
  );
}
