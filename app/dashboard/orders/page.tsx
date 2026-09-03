import React from 'react';

export default function OrdersPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="m-0 text-[26px] tracking-tight font-bold">Orders</h1>
        <div className="text-[#6a7872]">Track every order from pending to completed.</div>
      </div>

      <div className="flex gap-[7px] mb-[18px] overflow-x-auto">
        <button className="bg-[#eaf7f2] text-[#07553d] font-[800] border border-[#e4eae7] px-3 py-2 rounded-lg whitespace-nowrap">All</button>
        <button className="bg-white border border-[#e4eae7] px-3 py-2 rounded-lg whitespace-nowrap">Pending</button>
        <button className="bg-white border border-[#e4eae7] px-3 py-2 rounded-lg whitespace-nowrap">Processing</button>
        <button className="bg-white border border-[#e4eae7] px-3 py-2 rounded-lg whitespace-nowrap">Completed</button>
      </div>

      <div className="bg-white border border-[#e4eae7] rounded-[13px] p-[17px] overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr>
              <th className="text-[#7c8883] text-[11px] font-bold p-[11px_8px] border-b border-[#e4eae7]">Order</th>
              <th className="text-[#7c8883] text-[11px] font-bold p-[11px_8px] border-b border-[#e4eae7]">Customer</th>
              <th className="text-[#7c8883] text-[11px] font-bold p-[11px_8px] border-b border-[#e4eae7]">Items</th>
              <th className="text-[#7c8883] text-[11px] font-bold p-[11px_8px] border-b border-[#e4eae7]">Amount</th>
              <th className="text-[#7c8883] text-[11px] font-bold p-[11px_8px] border-b border-[#e4eae7]">Payment</th>
              <th className="text-[#7c8883] text-[11px] font-bold p-[11px_8px] border-b border-[#e4eae7]">Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['#1024', 'Ada Okafor', 'Nike Air Force', '₦85,000', 'Paid', 'Completed'],
              ['#1023', 'Daniel James', 'Black Hoodie', '₦45,000', 'Paid', 'Processing'],
              ['#1022', 'Tolu Adebayo', 'Slides × 2', '₦60,000', 'Paid', 'Completed'],
              ['#1021', 'Mary Aina', 'Leather Bag', '₦65,000', 'Pending', 'Pending']
            ].map((r, i) => (
              <tr key={i}>
                <td className="p-[14px_8px] border-b border-[#eef1ef] font-bold">{r[0]}</td>
                <td className="p-[14px_8px] border-b border-[#eef1ef]">{r[1]}</td>
                <td className="p-[14px_8px] border-b border-[#eef1ef]">{r[2]}</td>
                <td className="p-[14px_8px] border-b border-[#eef1ef]">{r[3]}</td>
                <td className="p-[14px_8px] border-b border-[#eef1ef]">{r[4]}</td>
                <td className="p-[14px_8px] border-b border-[#eef1ef]">
                  <span className={`inline-block px-2 py-1 rounded-full text-[10px] font-bold ${r[5] === 'Pending' ? 'bg-[#fff5dc] text-[#b77900]' : 'bg-[#eaf7f2] text-[#07553d]'
                    }`}>{r[5]}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}