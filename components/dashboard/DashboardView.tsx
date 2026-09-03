import React from 'react';

export default function DashboardView({ go }: { go: (route: string) => void }) {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3">
        <div>
          <h1 className="m-0 text-[22px] sm:text-[26px] tracking-tight font-bold">Good morning, Ada</h1>
          <div className="text-[#6a7872]">Here{`'`}s what{`'`}s happening with your business today.</div>
        </div>
        <button onClick={() => go('sales')} className="bg-[#0d7a55] text-white px-[14px] py-[10px] rounded-[9px] font-bold">
          + New sale
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[14px]">
        {[
          { l: 'Today’s sales', v: '₦245,000', u: '↑ 18.4% vs yesterday' },
          { l: 'Orders', v: '17', u: '↑ 6 today' },
          { l: 'Estimated profit', v: '₦72,000', u: '↑ 12.1%' },
          { l: 'Customers', v: '124', u: '+12 new' }
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
          <h3 className="m-0 mb-4 text-[15px] font-bold">Revenue · Last 7 days</h3>
          <div className="h-[220px] flex items-end gap-[9px]">
            {[45, 58, 42, 70, 55, 88, 66, 100].map((h, i) => (
              <div key={i} className={`flex-1 rounded-t-md ${i === 7 ? 'bg-[#0d7a55]' : 'bg-[#bfe8d8]'}`} style={{ height: `${h}%` }}></div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-[#e4eae7] rounded-[13px] p-[17px]">
          <h3 className="m-0 mb-4 text-[15px] font-bold">Kolo Insights</h3>
          <div className="flex justify-between py-3 border-b border-[#e4eae7]"><span>Sales are up <b>18%</b></span></div>
          <div className="flex justify-between py-3 border-b border-[#e4eae7]"><span>Nike Air Force is your <b>best seller</b></span></div>
          <div className="flex justify-between py-3 border-b border-[#e4eae7] border-0"><span><b>8 products</b> are low on stock</span></div>
        </div>
      </div>

      <div className="bg-white border border-[#e4eae7] rounded-[13px] p-[17px] mt-[14px] overflow-x-auto">
        <h3 className="m-0 mb-4 text-[15px] font-bold">Recent orders</h3>
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr>
              <th className="text-[#7c8883] text-[11px] font-bold p-[11px_8px] border-b border-[#e4eae7]">Order</th>
              <th className="text-[#7c8883] text-[11px] font-bold p-[11px_8px] border-b border-[#e4eae7]">Customer</th>
              <th className="text-[#7c8883] text-[11px] font-bold p-[11px_8px] border-b border-[#e4eae7]">Amount</th>
              <th className="text-[#7c8883] text-[11px] font-bold p-[11px_8px] border-b border-[#e4eae7]">Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['#1024', 'Ada Okafor', '₦85,000', 'Paid'],
              ['#1023', 'Daniel James', '₦45,000', 'Paid'],
              ['#1022', 'Tolu Adebayo', '₦60,000', 'Processing']
            ].map((r, i) => (
              <tr key={i}>
                <td className="p-[14px_8px] border-b border-[#eef1ef] font-bold">{r[0]}</td>
                <td className="p-[14px_8px] border-b border-[#eef1ef]">{r[1]}</td>
                <td className="p-[14px_8px] border-b border-[#eef1ef]">{r[2]}</td>
                <td className="p-[14px_8px] border-b border-[#eef1ef]">
                  <span className="inline-block px-2 py-1 rounded-full bg-[#eaf7f2] text-[#07553d] text-[10px] font-bold">{r[3]}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}