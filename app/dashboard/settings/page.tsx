"use client";

import React, { useState } from 'react';

const SETTINGS_TABS = [
  { id: 'business', label: 'Business' },
  { id: 'team', label: 'Team & permissions' },
  { id: 'payments', label: 'Payments' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'security', label: 'Security' },
  { id: 'data', label: 'Data & exports' },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('business');

  return (
    <>
      <div className="mb-6">
        <h1 className="m-0 text-[26px] tracking-tight font-bold">Settings</h1>
        <div className="text-[#6a7872]">Manage your business and team.</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[210px_1fr] gap-[18px]">
        {/* Settings Sidebar Nav */}
        <div className="bg-white border border-[#e4eae7] rounded-[12px] p-2 h-fit flex flex-col gap-1">
          {SETTINGS_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`cursor-pointer text-left p-[10px] rounded-lg transition-colors ${activeTab === tab.id
                ? 'bg-[#eaf7f2] font-[750] text-[#07553d]'
                : 'hover:bg-gray-50 text-[#6b7873]'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Form Content */}
        <div className="bg-white border border-[#e4eae7] rounded-[13px] p-[17px] max-w-[760px]">
          {activeTab === 'business' && <BusinessForm />}
          {activeTab === 'team' && <TeamForm />}
          {activeTab === 'payments' && <PaymentsForm />}
          {activeTab === 'notifications' && <NotificationsForm />}
          {activeTab === 'security' && <SecurityForm />}
          {activeTab === 'data' && <DataForm />}
        </div>
      </div>
    </>
  );
}

// --- Individual Form Components ---

function BusinessForm() {
  return (
    <>
      <h3 className="m-0 mb-5 text-[15px] font-bold">Business details</h3>
      <div className="mb-4">
        <label className="block text-[12px] font-[750] mb-[7px]">Business name</label>
        <input defaultValue="Olagoke Fashion" className="w-full border border-[#e4eae7] rounded-[9px] px-3 py-[11px] bg-white outline-none focus:border-[#0d7a55]" />
      </div>
      <div className="mb-4">
        <label className="block text-[12px] font-[750] mb-[7px]">Business category</label>
        <select className="w-full border border-[#e4eae7] rounded-[9px] px-3 py-[11px] bg-white outline-none focus:border-[#0d7a55]">
          <option>Fashion & clothing</option>
          <option>Retail</option>
          <option>Electronics</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-[12px] font-[750] mb-[7px]">Phone number</label>
        <input defaultValue="+234 801 234 5678" className="w-full border border-[#e4eae7] rounded-[9px] px-3 py-[11px] bg-white outline-none focus:border-[#0d7a55]" />
      </div>
      <div className="mb-6">
        <label className="block text-[12px] font-[750] mb-[7px]">Business address</label>
        <textarea defaultValue="12 Allen Avenue, Ikeja, Lagos" className="w-full border border-[#e4eae7] rounded-[9px] px-3 py-[11px] min-h-[100px] bg-white outline-none focus:border-[#0d7a55]"></textarea>
      </div>
      <button className="bg-[#0d7a55] text-white px-[14px] py-[10px] rounded-[9px] font-bold hover:bg-[#07553d] transition-colors">
        Save changes
      </button>
    </>
  );
}

function TeamForm() {
  return (
    <>
      <div className="flex justify-between items-center mb-5">
        <h3 className="m-0 text-[15px] font-bold">Team Members</h3>
        <button className="border border-[#e4eae7] bg-[#fafcfb] px-[14px] py-[8px] rounded-[9px] font-bold text-xs hover:bg-gray-50">
          + Invite member
        </button>
      </div>

      <div className="border border-[#e4eae7] rounded-[9px] overflow-hidden mb-6">
        {[
          { name: 'Ada Okafor', email: 'ada@kolo.com', role: 'Owner' },
          { name: 'David Mensah', email: 'david@kolo.com', role: 'Manager' },
          { name: 'Sarah Chuks', email: 'sarah@kolo.com', role: 'Cashier' },
        ].map((user, i) => (
          <div key={i} className="flex justify-between items-center p-4 border-b border-[#e4eae7] last:border-0 bg-white">
            <div>
              <div className="font-bold text-[14px]">{user.name}</div>
              <div className="text-[12px] text-[#6a7872]">{user.email}</div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${user.role === 'Owner' ? 'bg-[#eaf7f2] text-[#07553d]' : 'bg-[#fafcfb] border border-[#e4eae7]'}`}>
                {user.role}
              </span>
              {user.role !== 'Owner' && <button className="text-[#c94444] text-[12px] font-bold">Remove</button>}
            </div>
          </div>
        ))}
      </div>

      <h3 className="m-0 mb-4 text-[15px] font-bold border-t border-[#e4eae7] pt-6">Role Permissions</h3>
      <div className="mb-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#0d7a55]" />
          <span className="text-[14px]">Allow Cashiers to process refunds</span>
        </label>
      </div>
      <div className="mb-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#0d7a55]" />
          <span className="text-[14px]">Allow Managers to edit inventory levels</span>
        </label>
      </div>

      <button className="bg-[#0d7a55] text-white px-[14px] py-[10px] rounded-[9px] font-bold hover:bg-[#07553d] transition-colors">
        Save permissions
      </button>
    </>
  );
}

function PaymentsForm() {
  return (
    <>
      <h3 className="m-0 mb-5 text-[15px] font-bold">Payout Bank Account</h3>
      <div className="text-[#6a7872] text-[13px] mb-5">This is where your online card payments and POS settlements will be sent.</div>

      <div className="mb-4">
        <label className="block text-[12px] font-[750] mb-[7px]">Bank name</label>
        <select className="w-full border border-[#e4eae7] rounded-[9px] px-3 py-[11px] bg-white outline-none focus:border-[#0d7a55]">
          <option>Guaranty Trust Bank</option>
          <option>Access Bank</option>
          <option>Zenith Bank</option>
          <option>Moniepoint Microfinance Bank</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-[12px] font-[750] mb-[7px]">Account number</label>
        <input defaultValue="0123456789" className="w-full border border-[#e4eae7] rounded-[9px] px-3 py-[11px] bg-white outline-none focus:border-[#0d7a55]" />
      </div>
      <div className="mb-6">
        <label className="block text-[12px] font-[750] mb-[7px]">Account name</label>
        <input defaultValue="Olagoke Fashion Enterprise" disabled className="w-full border border-[#e4eae7] rounded-[9px] px-3 py-[11px] bg-[#fafcfb] text-[#6a7872] outline-none" />
      </div>

      <h3 className="m-0 mb-4 text-[15px] font-bold border-t border-[#e4eae7] pt-6">Tax Settings</h3>
      <div className="mb-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#0d7a55]" />
          <span className="text-[14px]">Apply 7.5% VAT to all sales automatically</span>
        </label>
      </div>

      <button className="bg-[#0d7a55] text-white px-[14px] py-[10px] rounded-[9px] font-bold hover:bg-[#07553d] transition-colors">
        Save payment settings
      </button>
    </>
  );
}

function NotificationsForm() {
  return (
    <>
      <h3 className="m-0 mb-5 text-[15px] font-bold">Email Notifications</h3>
      <div className="flex flex-col gap-4 mb-6">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-[14px]">Daily sales summary</span>
          <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#0d7a55]" />
        </label>
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-[14px]">Low stock alerts</span>
          <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#0d7a55]" />
        </label>
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-[14px]">New online orders</span>
          <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#0d7a55]" />
        </label>
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-[14px]">Monthly account statements</span>
          <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#0d7a55]" />
        </label>
      </div>

      <h3 className="m-0 mb-5 text-[15px] font-bold border-t border-[#e4eae7] pt-6">SMS Alerts</h3>
      <div className="flex flex-col gap-4 mb-6">
        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <div className="text-[14px]">Failed payment alerts</div>
            <div className="text-[11px] text-[#6a7872]">Get notified immediately if a card or transfer fails.</div>
          </div>
          <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#0d7a55]" />
        </label>
      </div>

      <button className="bg-[#0d7a55] text-white px-[14px] py-[10px] rounded-[9px] font-bold hover:bg-[#07553d] transition-colors">
        Update preferences
      </button>
    </>
  );
}

function SecurityForm() {
  return (
    <>
      <h3 className="m-0 mb-5 text-[15px] font-bold">Change Password</h3>
      <div className="mb-4">
        <label className="block text-[12px] font-[750] mb-[7px]">Current password</label>
        <input type="password" placeholder="••••••••" className="w-full border border-[#e4eae7] rounded-[9px] px-3 py-[11px] bg-white outline-none focus:border-[#0d7a55]" />
      </div>
      <div className="mb-4">
        <label className="block text-[12px] font-[750] mb-[7px]">New password</label>
        <input type="password" placeholder="••••••••" className="w-full border border-[#e4eae7] rounded-[9px] px-3 py-[11px] bg-white outline-none focus:border-[#0d7a55]" />
      </div>
      <div className="mb-6">
        <label className="block text-[12px] font-[750] mb-[7px]">Confirm new password</label>
        <input type="password" placeholder="••••••••" className="w-full border border-[#e4eae7] rounded-[9px] px-3 py-[11px] bg-white outline-none focus:border-[#0d7a55]" />
      </div>
      <button className="border border-[#e4eae7] bg-[#fafcfb] px-[14px] py-[10px] rounded-[9px] font-bold text-[14px] hover:bg-gray-50 mb-8">
        Update password
      </button>

      <h3 className="m-0 mb-4 text-[15px] font-bold border-t border-[#e4eae7] pt-6">Two-Factor Authentication</h3>
      <div className="flex items-center justify-between p-4 border border-[#e4eae7] rounded-[9px] bg-white">
        <div>
          <div className="font-bold text-[14px]">Authenticator App</div>
          <div className="text-[12px] text-[#6a7872]">Use an app like Google Authenticator to secure your account.</div>
        </div>
        <button className="bg-[#0d7a55] text-white px-[14px] py-[8px] rounded-[9px] text-[12px] font-bold">
          Enable 2FA
        </button>
      </div>
    </>
  );
}

function DataForm() {
  return (
    <>
      <h3 className="m-0 mb-5 text-[15px] font-bold">Export Business Data</h3>
      <div className="text-[#6a7872] text-[13px] mb-5">Download your records as CSV files for accounting or backup purposes.</div>

      <div className="mb-4">
        <label className="block text-[12px] font-[750] mb-[7px]">Select data to export</label>
        <select className="w-full border border-[#e4eae7] rounded-[9px] px-3 py-[11px] bg-white outline-none focus:border-[#0d7a55]">
          <option>All Sales & Transactions</option>
          <option>Current Inventory List</option>
          <option>Customer Directory</option>
          <option>Expense Reports</option>
        </select>
      </div>
      <div className="mb-6">
        <label className="block text-[12px] font-[750] mb-[7px]">Date range</label>
        <select className="w-full border border-[#e4eae7] rounded-[9px] px-3 py-[11px] bg-white outline-none focus:border-[#0d7a55]">
          <option>Last 30 Days</option>
          <option>This Year</option>
          <option>All Time</option>
        </select>
      </div>

      <button className="border border-[#e4eae7] bg-[#fafcfb] px-[14px] py-[10px] rounded-[9px] font-bold text-[14px] hover:bg-gray-50 mb-8">
        Download CSV
      </button>

      <h3 className="m-0 mb-4 text-[15px] font-bold text-[#c94444] border-t border-[#e4eae7] pt-6">Danger Zone</h3>
      <div className="border border-[#ffdbdb] bg-[#fff0f0] p-4 rounded-[9px]">
        <div className="font-bold text-[14px] text-[#c94444] mb-1">Delete Account</div>
        <div className="text-[12px] text-[#c94444] mb-4">Once you delete your account, there is no going back. Please be certain.</div>
        <button className="bg-[#c94444] text-white px-[14px] py-[8px] rounded-[9px] text-[12px] font-bold">
          Delete my account
        </button>
      </div>
    </>
  );
}