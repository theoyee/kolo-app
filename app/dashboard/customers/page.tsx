import React from 'react';

export default function CustomersPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="m-0 text-[26px] tracking-tight font-bold">Customers</h1>
        <div className="text-[#6a7872]">Build relationships from every sale.</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[14px]">
        {[
          { l: 'Customers', v: '1,284', u: '+12 this week' },
          { l: 'Returning', v: '68%' },
          { l: 'Top customer', v: '₦840k' },
          { l: 'Avg. order', v: '₦48k' }
        ].map((s, i) => (
          <div key={i} className="bg-white border border-[#e4eae7] rounded-[13px] p-[17px]">
            <div className="text-[12px] text-[#6a7872]">{s.l}</div>
            <div className="text-[25px] font-[820] my-2">{s.v}</div>
            {s.u && <div className="text-[#0d7a55] text-[11px] font-bold">{s.u}</div>}
          </div>
        ))}
      </div>

      <div className="bg-white border border-[#e4eae7] rounded-[13px] p-[17px] mt-[14px] overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr>
              <th className="text-[#7c8883] text-[11px] font-bold p-[11px_8px] border-b border-[#e4eae7]">Customer</th>
              <th className="text-[#7c8883] text-[11px] font-bold p-[11px_8px] border-b border-[#e4eae7]">Phone</th>
              <th className="text-[#7c8883] text-[11px] font-bold p-[11px_8px] border-b border-[#e4eae7]">Orders</th>
              <th className="text-[#7c8883] text-[11px] font-bold p-[11px_8px] border-b border-[#e4eae7]">Total spent</th>
              <th className="text-[#7c8883] text-[11px] font-bold p-[11px_8px] border-b border-[#e4eae7]">Last purchase</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Ada Okafor', '0803 123 4567', '18', '₦840,000', 'Today'],
              ['Daniel James', '0812 555 1098', '11', '₦510,000', 'Yesterday'],
              ['Tolu Adebayo', '0901 222 8811', '7', '₦295,000', 'Aug 26']
            ].map((r, i) => (
              <tr key={i}>
                <td className="p-[14px_8px] border-b border-[#eef1ef] font-bold">{r[0]}</td>
                <td className="p-[14px_8px] border-b border-[#eef1ef]">{r[1]}</td>
                <td className="p-[14px_8px] border-b border-[#eef1ef]">{r[2]}</td>
                <td className="p-[14px_8px] border-b border-[#eef1ef]">{r[3]}</td>
                <td className="p-[14px_8px] border-b border-[#eef1ef]">{r[4]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}