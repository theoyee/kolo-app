import React from 'react';

interface SalesViewProps {
  cart: { name: string; price: number }[];
  addToCart: (name: string, price: number) => void;
  cartTotal: number;
}

export default function SalesView({ cart, addToCart, cartTotal }: SalesViewProps) {
  return (
    <>
      <div className="mb-6">
        <h1 className="m-0 text-[26px] tracking-tight font-bold">Sales / POS</h1>
        <div className="text-[#6a7872]">Create a sale in seconds.</div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-4">
        <div className="bg-white border border-[#e4eae7] rounded-[13px] p-[17px]">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
            <h3 className="m-0 text-[15px] font-bold">Products</h3>
            <input className="border border-[#e4eae7] bg-[#fafcfb] rounded-[9px] px-3 py-[9px] w-full sm:w-[280px]" placeholder="Search products..." />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[10px]">
            {[
              { n: 'Nike Air Force', p: 85000, s: 2 },
              { n: 'Black Hoodie', p: 45000, s: 3 },
              { n: 'Classic Slides', p: 30000, s: 4 },
              { n: 'Leather Bag', p: 65000, s: 5 },
              { n: 'Basic Tee', p: 22000, s: 6 },
              { n: 'Signature Cap', p: 18000, s: 7 }
            ].map((p, i) => (
              <button key={i} onClick={() => addToCart(p.n, p.p)} className="border border-[#e4eae7] bg-white rounded-xl p-[13px] text-left hover:border-[#0d7a55]">
                <strong className="block mt-[35px] mb-[5px]">{p.n}</strong>
                <small className="text-[#6a7872]">₦{p.p.toLocaleString()} · {p.s} in stock</small>
              </button>
            ))}
          </div>
        </div>
        <div className="bg-white border border-[#e4eae7] rounded-[13px] p-[17px] h-fit">
          <h3 className="m-0 mb-4 text-[15px] font-bold">Current sale</h3>
          <div className="min-h-[150px]">
            {cart.length === 0 ? (
              <div className="text-[#6a7872]">Select a product to begin.</div>
            ) : (
              cart.map((item, i) => (
                <div key={i} className="flex justify-between py-3 border-b border-[#e4eae7]">
                  <span>{item.name} × 1</span>
                  <b>₦{item.price.toLocaleString()}</b>
                </div>
              ))
            )}
          </div>
          <div className="text-[22px] font-[850] flex justify-between my-5">
            <span>Total</span>
            <span>₦{cartTotal.toLocaleString()}</span>
          </div>
          <select className="w-full border border-[#e4eae7] rounded-[9px] px-3 py-[11px] mb-3 bg-white outline-none">
            <option>Bank transfer</option>
            <option>POS</option>
            <option>Cash</option>
          </select>
          <button
            onClick={() => alert('Sale completed — inventory and customer records updated.')}
            className="w-full bg-[#0d7a55] text-white px-[14px] py-[10px] rounded-[9px] font-bold"
          >
            Complete sale
          </button>
        </div>
      </div>
    </>
  );
}