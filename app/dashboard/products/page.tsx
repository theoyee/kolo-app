import React from 'react';

export default function ProductsPage() {
  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <div>
          <h1 className="m-0 text-[26px] tracking-tight font-bold">Products</h1>
          <div className="text-[#6a7872]">Manage your catalogue and pricing.</div>
        </div>
        <button className="bg-[#0d7a55] text-white px-[14px] py-[10px] rounded-[9px] font-bold">
          + Add product
        </button>
      </div>
      <div className="bg-white border border-[#e4eae7] rounded-[13px] p-[17px] overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr>
              <th className="text-[#7c8883] text-[11px] font-bold p-[11px_8px] border-b border-[#e4eae7]">Product</th>
              <th className="text-[#7c8883] text-[11px] font-bold p-[11px_8px] border-b border-[#e4eae7]">Category</th>
              <th className="text-[#7c8883] text-[11px] font-bold p-[11px_8px] border-b border-[#e4eae7]">Price</th>
              <th className="text-[#7c8883] text-[11px] font-bold p-[11px_8px] border-b border-[#e4eae7]">Stock</th>
              <th className="text-[#7c8883] text-[11px] font-bold p-[11px_8px] border-b border-[#e4eae7]">Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Nike Air Force', 'Shoes', '₦85,000', '24', 'In stock'],
              ['Black Hoodie', 'Clothing', '₦45,000', '3', 'Low stock'],
              ['Classic Slides', 'Shoes', '₦30,000', '0', 'Out of stock'],
              ['Leather Bag', 'Accessories', '₦65,000', '18', 'In stock'],
              ['Basic Tee', 'Clothing', '₦22,000', '42', 'In stock']
            ].map((r, i) => (
              <tr key={i}>
                <td className="p-[14px_8px] border-b border-[#eef1ef] font-bold">{r[0]}</td>
                <td className="p-[14px_8px] border-b border-[#eef1ef]">{r[1]}</td>
                <td className="p-[14px_8px] border-b border-[#eef1ef]">{r[2]}</td>
                <td className="p-[14px_8px] border-b border-[#eef1ef]">{r[3]}</td>
                <td className="p-[14px_8px] border-b border-[#eef1ef]">
                  <span className={`inline-block px-2 py-1 rounded-full text-[10px] font-bold ${r[4] === 'Low stock' ? 'bg-[#fff5dc] text-[#b77900]' :
                    r[4] === 'Out of stock' ? 'bg-[#fff0f0] text-[#c94444]' : 'bg-[#eaf7f2] text-[#07553d]'
                    }`}>{r[4]}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}