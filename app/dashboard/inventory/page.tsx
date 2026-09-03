import React from 'react';

export default function InventoryPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="m-0 text-[26px] tracking-tight font-bold">Inventory</h1>
        <div className="text-[#6a7872]">Know what you have and what needs attention.</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[14px]">
        {[
          { l: 'Products', v: '128' },
          { l: 'Stock value', v: '₦8.4m' },
          { l: 'Low stock', v: '8' },
          { l: 'Out of stock', v: '3' }
        ].map((s, i) => (
          <div key={i} className="bg-white border border-[#e4eae7] rounded-[13px] p-[17px]">
            <div className="text-[12px] text-[#6a7872]">{s.l}</div>
            <div className="text-[25px] font-[820] my-2">{s.v}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-[#e4eae7] rounded-[13px] p-[17px] mt-[14px] overflow-x-auto">
        <h3 className="m-0 mb-4 text-[15px] font-bold">Stock requiring attention</h3>
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr>
              <th className="text-[#7c8883] text-[11px] font-bold p-[11px_8px] border-b border-[#e4eae7]">Product</th>
              <th className="text-[#7c8883] text-[11px] font-bold p-[11px_8px] border-b border-[#e4eae7]">Current stock</th>
              <th className="text-[#7c8883] text-[11px] font-bold p-[11px_8px] border-b border-[#e4eae7]">Reorder level</th>
              <th className="text-[#7c8883] text-[11px] font-bold p-[11px_8px] border-b border-[#e4eae7]">Action</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Black Hoodie', '3', '5'],
              ['Classic Slides', '0', '8'],
              ['Signature Cap', '2', '10']
            ].map((r, i) => (
              <tr key={i}>
                <td className="p-[14px_8px] border-b border-[#eef1ef] font-bold">{r[0]}</td>
                <td className="p-[14px_8px] border-b border-[#eef1ef]">
                  <span className="inline-block px-2 py-1 rounded-full bg-[#fff5dc] text-[#b77900] text-[10px] font-bold">{r[1]}</span>
                </td>
                <td className="p-[14px_8px] border-b border-[#eef1ef]">{r[2]}</td>
                <td className="p-[14px_8px] border-b border-[#eef1ef]">
                  <button className="border border-[#e4eae7] bg-white px-3 py-[6px] rounded-lg font-bold text-xs hover:bg-gray-50">Adjust stock</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}