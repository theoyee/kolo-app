import React from 'react';

export default function ExpensesPage() {
  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <div>
          <h1 className="m-0 text-[26px] tracking-tight font-bold">Expenses</h1>
          <div className="text-[#6a7872]">Keep your real business costs in view.</div>
        </div>
        <button className="bg-[#0d7a55] text-white px-[14px] py-[10px] rounded-[9px] font-bold">
          + Add expense
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[14px]">
        {[
          { l: 'This month', v: '₦380k' },
          { l: 'Inventory', v: '₦210k' },
          { l: 'Delivery', v: '₦72k' },
          { l: 'Other', v: '₦98k' }
        ].map((s, i) => (
          <div key={i} className="bg-white border border-[#e4eae7] rounded-[13px] p-[17px]">
            <div className="text-[12px] text-[#6a7872]">{s.l}</div>
            <div className="text-[25px] font-[820] my-2">{s.v}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-[#e4eae7] rounded-[13px] p-[17px] mt-[14px] overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr>
              <th className="text-[#7c8883] text-[11px] font-bold p-[11px_8px] border-b border-[#e4eae7]">Description</th>
              <th className="text-[#7c8883] text-[11px] font-bold p-[11px_8px] border-b border-[#e4eae7]">Category</th>
              <th className="text-[#7c8883] text-[11px] font-bold p-[11px_8px] border-b border-[#e4eae7]">Amount</th>
              <th className="text-[#7c8883] text-[11px] font-bold p-[11px_8px] border-b border-[#e4eae7]">Date</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Stock restock', 'Inventory', '₦210,000', 'Aug 27'],
              ['Customer delivery', 'Delivery', '₦72,000', 'Aug 26'],
              ['Instagram ads', 'Marketing', '₦55,000', 'Aug 25'],
              ['Electricity', 'Utilities', '₦43,000', 'Aug 22']
            ].map((r, i) => (
              <tr key={i}>
                <td className="p-[14px_8px] border-b border-[#eef1ef] font-bold">{r[0]}</td>
                <td className="p-[14px_8px] border-b border-[#eef1ef]">{r[1]}</td>
                <td className="p-[14px_8px] border-b border-[#eef1ef]">{r[2]}</td>
                <td className="p-[14px_8px] border-b border-[#eef1ef]">{r[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}