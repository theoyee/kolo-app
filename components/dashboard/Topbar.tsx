"use react"

import { Settings } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { InputField } from '../ui/InputField';


interface TopbarProps {
  toggleSidebar: () => void;
}

export default function Topbar({ toggleSidebar }: TopbarProps) {
  return (
    <header className="h-[67px] borderb border[#e4eae7] flex items-center justify-between px-4 lg:pr-3 lg:pl-10 sticky top-0 z-10">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="lg:hidden mr-4 text-[22px] p-1 cursor-pointer bg-transparent border-0"
        >
          ☰
        </button>

        {/* <InputField placeholder={'Search Kolo...'} className='text-[#1B2A22]' /> */}
        <input
          className="hidden sm:block min-w-3xl bg-[#FBF7EE]/40 backdrop-blur-3xl
           border border-[#D9C5B8] rounded-xl px-3 py-[9px] w-[280px] font-mono outline-none focus:border-[#0d7a55]"
          placeholder="Search Kolo    or    ctrl + k..."
        />
      </div>
      <div className="flex items-center gap-4 ml-auto">
        <span className="font-medium">Ada Okafor</span>
        <Settings className='size-6 text-[#1B2A22]/60' />
        {/* <div className="size-10 rounded-full bg-[#d8eee5] grid place-items-center font-[800] text-[#07553d]">AO</div> */}
        <Image src={'/brand/panel-background2.jpg'} width={100} height={100} alt='' className="size-9 border-2 border-[#FBF7EE]/40 rounded-full" />
      </div>
    </header>
  );
}