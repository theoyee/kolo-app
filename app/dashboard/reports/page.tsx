import React from 'react';

export default function ReportsPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="m-0 text-[26px] tracking-tight font-bold">Reports</h1>
        <div className="text-[#6a7872]">Understand revenue, profit and growth.</div>
      </div>

      <div className="flex gap-[7px] mb-[18px]">
        <button className="bg-[#eaf7f2] text-[#07553d] font-[800] border border-[#e4eae7] px-3 py-2 rounded-lg">30 days</button>
        <button className="bg-white border border-[#e4eae7] px-3 py-2 rounded-lg">90 days</button>
        <button className="bg-white border border-[#e4eae7] px-3 py-2 rounded-lg">12 months</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[14px]">
        {[
          { l: 'Revenue', v: '₦8.42m', u: '↑ 18.4%' },
          { l: 'COGS', v: '₦4.96m' },
          { l: 'Gross profit', v: '₦3.46m' },
          { l: 'Expenses', v: '₦1.02m' }
        ].map((s, i) => (
          <div key={i} className="bg-white border border-[#e4eae7] rounded-[13px] p-[17px]">
            <div className="text-[12px] text-[#6a7872]">{s.l}</div>
            <div className="text-[25px] font-[820] my-2">{s.v}</div>
            {s.u && <div className="text-[#0d7a55] text-[11px] font-bold">{s.u}</div>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-[14px] mt-[14px]">
        <div className="bg-white border border-[#e4eae7] rounded-[13px] p-[17px]">
          <h3 className="m-0 mb-4 text-[15px] font-bold">Revenue</h3>
          <div className="h-[220px] flex items-end gap-[9px]">
            {[35, 48, 42, 60, 52, 76, 68, 82, 70, 94, 78, 100].map((h, i) => (
              <div key={i} className={`flex-1 rounded-t-md ${i === 11 ? 'bg-[#0d7a55]' : 'bg-[#bfe8d8]'}`} style={{ height: `${h}%` }}></div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-[#e4eae7] rounded-[13px] p-[17px]">
          <h3 className="m-0 mb-4 text-[15px] font-bold">Top products</h3>
          {[
            ['Nike Air Force', '₦1.82m'],
            ['Black Hoodie', '₦1.24m'],
            ['Leather Bag', '₦890k'],
            ['Classic Slides', '₦720k']
          ].map((r, i) => (
            <div key={i} className="flex justify-between py-3 border-b border-[#e4eae7] last:border-0">
              <span>{r[0]}</span>
              <b>{r[1]}</b>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}