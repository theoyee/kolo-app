"use client";

import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import { Brain, Handshake } from 'lucide-react';
import React, { useState } from 'react';


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="grid grid-cols-1 min-h-screen bg-[#f7f9f8] font-sans text-[#10201a] text-[14px]">
      <Sidebar
        isOpen={isSidebarOpen}
        closeSidebar={() => setIsSidebarOpen(false)}
        className=" lg:w-[250px] max-md:bg-white"
      />
      <main className="w-full md:h-[100vh] overflow-hidden lg:w-[calc(100%-250px)] md:ml-[250px]">
        <Topbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <section className=' pb-20 flex relative overflow-y-auto'>
          {/* <div className="flex-1  md:min-h-[calc(100vh-88px)] overflow-y-scroll bg-[#FBF7EE]/40  lg:p-[30px] maxw-[1400px] border border-[#D9CFB8] md:rounded-3xl"> */}
          <div className=" w-full min-h-0 md:h-[calc(100vh-88px)] overflow-y-auto kolo-scrollbar-dark bg-[#FBF7EE]/40 lg:p-[30px] border border-[#D9CFB8] md:rounded-3xl">

            <div className="section-x ">
              {children}

              <div>
                a
                <br />
                v
                <br />
                a
                <br />
                v
                <br />
                a
                <br />
                v
                <br />
                a
                <br />
                v
                <br />
                a
                <br />
                v
                <br /> a
                <br />
                v
                <br /> a
                <br />
                v
                <br /> a
                <br />
                v
                <br /> a
                <br />
                v
                <br />
              </div>
            </div>
          </div>
          <div className='px-3 flex flex-col space-y-5 mt-7 max-md:hidden bgblack ml-auto'>
            <Brain className='text-kolo-currency-dark size-6.5' />

            <Handshake className='text-kolo-currency-dark size-6.5' />
          </div>
        </section>

      </main>
    </div>
  );
}