"use client";

import { Settings } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { getCurrentUser, authApi } from '@/lib/api';

interface TopbarProps {
  toggleSidebar: () => void;
}

export default function Topbar({ toggleSidebar }: TopbarProps) {
  const [user, setUser] = useState<{ firstName?: string; lastName?: string }>(() => getCurrentUser());

  useEffect(() => {
    authApi.getMe().then((res) => {
      if (res.success && res.data) {
        setUser(res.data);
      }
    });
  }, []);

  const displayName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Ada Okafor';

  return (
    <header className="h-[67px] max-md:border-b border-[#e4eae7] flex items-center justify-between px-4 lg:pr-3 lg:pl-10 sticky top-0 z-10 bg-white/70 backdrop-blur-md">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="lg:hidden mr-4 text-[22px] p-1 cursor-pointer bg-transparent border-0"
        >
          ☰
        </button>

        <input
          className="hidden sm:block min-w-3xl bg-[#FBF7EE]/40 backdrop-blur-3xl
           border border-[#D9C5B8] rounded-xl px-3 py-[9px] w-[280px] font-mono outline-none focus:border-[#0d7a55]"
          placeholder="Search Kolo    or    ctrl + k..."
        />
      </div>
      <div className="flex items-center gap-4 ml-auto">
        <span className="font-medium">{displayName}</span>
        <Link href="/dashboard/settings" title="Settings">
          <Settings className='size-6 text-[#1B2A22]/60 hover:text-[#1B2A22] transition-colors cursor-pointer' />
        </Link>
        <Image src={'/brand/panel-background2.jpg'} width={100} height={100} alt='Profile' className="size-9 border-2 border-[#FBF7EE]/40 rounded-full object-cover" />
      </div>
    </header>
  );
}