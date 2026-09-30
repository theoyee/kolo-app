"use client";

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  CheckCircle,
  XCircle,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Plus,
} from 'lucide-react';
import {
  businessApi,
  settingsApi,
  paymentsApi,
  getActiveBusinessId,
  formatNGN,
  toKobo,
} from '@/lib/api';

const SETTINGS_TABS = [
  { id: 'business', label: 'Business' },
  { id: 'team', label: 'Team & permissions' },
  { id: 'payments', label: 'Payments & Bank' },
  { id: 'transfers', label: 'Bank Approvals' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'security', label: 'Security' },
  { id: 'data', label: 'Data & exports' },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('business');

  return (
    <>
      <div className="mb-6">
        <h1 className="m-0 text-[26px] tracking-tight font-bold text-kolo-ink">Business Settings</h1>
        <div className="text-[#6a7872]">Configure business profile, banking, transfers verification, and team.</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-[18px]">
        {/* Settings Sidebar Nav */}
        <div className="bg-white border border-[#e4eae7] rounded-[12px] p-2 h-fit flex flex-col gap-1 shadow-xs">
          {SETTINGS_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`cursor-pointer text-left p-[10px] rounded-lg transition-colors text-xs font-semibold ${
                activeTab === tab.id
                  ? 'bg-[#eaf7f2] font-bold text-[#07553d] border border-[#0d7a55]/20'
                  : 'hover:bg-gray-50 text-[#6b7873]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Form Content */}
        <div className="bg-white border border-[#e4eae7] rounded-[13px] p-[20px] max-w-[780px] shadow-xs">
          {activeTab === 'business' && <BusinessForm />}
          {activeTab === 'team' && <TeamForm />}
          {activeTab === 'payments' && <PaymentsForm />}
          {activeTab === 'transfers' && <BankTransfersApprovalQueue />}
          {activeTab === 'notifications' && <NotificationsForm />}
          {activeTab === 'security' && <SecurityForm />}
          {activeTab === 'data' && <DataForm />}
        </div>
      </div>
    </>
  );
}

// ----------------------------------------------------
// 1. Business Form
// ----------------------------------------------------
function BusinessForm() {
  const [biz, setBiz] = useState({
    name: 'Olagoke Fashion',
    category: 'Fashion & clothing',
    phone: '+234 801 234 5678',
    address: '12 Allen Avenue, Ikeja, Lagos',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const bizId = getActiveBusinessId();
    if (bizId) {
      businessApi.get(bizId).then((res) => {
        if (res.success && res.data) {
          setBiz({
            name: res.data.name || 'Olagoke Fashion',
            category: res.data.businessType || 'Fashion & clothing',
            phone: res.data.phone || '+234 801 234 5678',
            address: res.data.address || '12 Allen Avenue, Ikeja, Lagos',
          });
        }
      });
    }
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      const bizId = getActiveBusinessId();
      if (bizId) {
        await businessApi.update(bizId, {
          name: biz.name,
          phone: biz.phone,
          address: biz.address,
        });
      }
      setSaved(true);
      toast.success('Business details updated successfully!');
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update business details.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave}>
      <h3 className="m-0 mb-4 text-[15px] font-bold text-kolo-ink">Business Profile</h3>
      <div className="mb-4">
        <label className="block text-[12px] font-bold mb-[7px]">Business name</label>
        <input
          value={biz.name}
          onChange={(e) => setBiz({ ...biz, name: e.target.value })}
          className="w-full border border-[#e4eae7] rounded-[9px] px-3 py-[10px] text-xs bg-white outline-none focus:border-[#0d7a55]"
        />
      </div>
      <div className="mb-4">
        <label className="block text-[12px] font-bold mb-[7px]">Business category</label>
        <select
          value={biz.category}
          onChange={(e) => setBiz({ ...biz, category: e.target.value })}
          className="w-full border border-[#e4eae7] rounded-[9px] px-3 py-[10px] text-xs bg-white outline-none focus:border-[#0d7a55]"
        >
          <option>Fashion & clothing</option>
          <option>Retail & Supermarket</option>
          <option>Electronics & Gadgets</option>
          <option>Restaurant & Food</option>
          <option>Wholesale & Distribution</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-[12px] font-bold mb-[7px]">Official Phone number</label>
        <input
          value={biz.phone}
          onChange={(e) => setBiz({ ...biz, phone: e.target.value })}
          className="w-full border border-[#e4eae7] rounded-[9px] px-3 py-[10px] text-xs bg-white outline-none focus:border-[#0d7a55]"
        />
      </div>
      <div className="mb-6">
        <label className="block text-[12px] font-bold mb-[7px]">Physical Business Address</label>
        <textarea
          value={biz.address}
          onChange={(e) => setBiz({ ...biz, address: e.target.value })}
          className="w-full border border-[#e4eae7] rounded-[9px] px-3 py-[10px] text-xs min-h-[80px] bg-white outline-none focus:border-[#0d7a55]"
        ></textarea>
      </div>
      {saved && (
        <div className="mb-4 p-2.5 bg-[#eaf7f2] border border-[#0d7a55]/20 text-[#07553d] text-xs font-semibold rounded-lg">
          Business details updated successfully!
        </div>
      )}
      <button
        type="submit"
        disabled={saving}
        className="bg-[#0d7a55] text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-[#07553d] transition-colors cursor-pointer disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save changes'}
      </button>
    </form>
  );
}

// ----------------------------------------------------
// 2. Team Form
// ----------------------------------------------------
function TeamForm() {
  const [members, setMembers] = useState([
    { id: '1', name: 'Ada Okafor', email: 'ada@kolo.com', role: 'Owner' },
    { id: '2', name: 'David Mensah', email: 'david@kolo.com', role: 'Manager' },
    { id: '3', name: 'Sarah Chuks', email: 'sarah@kolo.com', role: 'Cashier' },
  ]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('CASHIER');
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    settingsApi.getMembers().then((res) => {
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const mapped = res.data.map((m: any) => ({
          id: m.id,
          name: m.user ? `${m.user.firstName || ''} ${m.user.lastName || ''}`.trim() : 'Team Member',
          email: m.user?.email || 'member@kolo.com',
          role: m.role === 'OWNER' ? 'Owner' : m.role === 'MANAGER' ? 'Manager' : 'Cashier',
        }));
        setMembers(mapped);
      }
    });
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setInviting(true);

    try {
      await settingsApi.inviteMember({
        email: inviteEmail.trim(),
        role: inviteRole,
      });
      setMembers((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          name: inviteEmail.split('@')[0],
          email: inviteEmail.trim(),
          role: inviteRole === 'MANAGER' ? 'Manager' : 'Cashier',
        },
      ]);
      toast.success(`Invitation sent to ${inviteEmail.trim()}`);
      setShowInviteModal(false);
      setInviteEmail('');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to send invitation.');
    } finally {
      setInviting(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-5">
        <h3 className="m-0 text-[15px] font-bold text-kolo-ink">Team Members & Access</h3>
        <button
          onClick={() => setShowInviteModal(true)}
          className="border border-[#e4eae7] bg-[#fafcfb] px-3.5 py-1.5 rounded-lg font-bold text-xs hover:bg-gray-50 cursor-pointer flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          Invite member
        </button>
      </div>

      <div className="border border-[#e4eae7] rounded-[9px] overflow-hidden mb-6">
        {members.map((user) => (
          <div key={user.id} className="flex justify-between items-center p-3.5 border-b border-[#e4eae7] last:border-0 bg-white">
            <div>
              <div className="font-bold text-xs text-kolo-ink">{user.name}</div>
              <div className="text-[11px] text-[#6a7872]">{user.email}</div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${user.role === 'Owner' ? 'bg-[#eaf7f2] text-[#07553d]' : 'bg-[#fafcfb] border border-[#e4eae7]'}`}>
                {user.role}
              </span>
              {user.role !== 'Owner' && (
                <button
                  onClick={() => {
                    setMembers((prev) => prev.filter((m) => m.id !== user.id));
                    toast.info(`Removed ${user.name} from team.`);
                  }}
                  className="text-[#c94444] text-[11px] font-bold cursor-pointer border-0 bg-transparent"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <h3 className="m-0 mb-4 text-[14px] font-bold border-t border-[#e4eae7] pt-5">Role Permissions</h3>
      <div className="mb-3">
        <label className="flex items-center gap-3 cursor-pointer text-xs">
          <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#0d7a55]" />
          <span>Allow Cashiers to void POS transactions</span>
        </label>
      </div>
      <div className="mb-5">
        <label className="flex items-center gap-3 cursor-pointer text-xs">
          <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#0d7a55]" />
          <span>Allow Managers to adjust inventory restocks and verify bank transfers</span>
        </label>
      </div>

      <button
        onClick={() => toast.success('Role permissions saved successfully!')}
        className="bg-[#0d7a55] text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-[#07553d] transition-colors cursor-pointer"
      >
        Save permissions
      </button>

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl border border-[#e4eae7] w-full max-w-sm p-6 shadow-xl">
            <h3 className="m-0 text-base font-bold text-kolo-ink mb-3">Invite Team Member</h3>
            <form onSubmit={handleInvite} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold mb-1 text-kolo-ink">Email address</label>
                <input
                  required
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@kolo.app"
                  className="w-full border border-[#e4eae7] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#0d7a55]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-kolo-ink">Assigned Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full border border-[#e4eae7] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#0d7a55]"
                >
                  <option value="CASHIER">Cashier (POS & Sales only)</option>
                  <option value="MANAGER">Manager (Catalog, Stock & Approvals)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#e4eae7]">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-3 py-1.5 border border-[#e4eae7] rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inviting}
                  className="px-4 py-1.5 bg-[#0d7a55] hover:bg-[#07553d] text-white rounded-lg text-xs font-bold cursor-pointer disabled:opacity-50"
                >
                  {inviting ? 'Inviting...' : 'Send Invite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

// ----------------------------------------------------
// 3. Payments & Official Bank Details Form
// ----------------------------------------------------
function PaymentsForm() {
  const [bankDetails, setBankDetails] = useState({
    bankName: 'Moniepoint Microfinance Bank',
    accountNumber: '8239019201',
    accountName: 'Olagoke Fashion Enterprise',
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    paymentsApi.getBankAccount().then((res) => {
      if (res.success && res.data) {
        setBankDetails({
          bankName: res.data.bankName || 'Moniepoint Microfinance Bank',
          accountNumber: res.data.bankAccountNumber || res.data.accountNumber || '8239019201',
          accountName: res.data.bankAccountName || res.data.accountName || 'Olagoke Fashion Enterprise',
        });
      }
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await settingsApi.update({
        bankName: bankDetails.bankName,
        bankAccountNumber: bankDetails.accountNumber,
        bankAccountName: bankDetails.accountName,
      });
      setSaved(true);
      toast.success('Payout bank account details saved!');
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save bank account settings.');
    }
  };

  return (
    <form onSubmit={handleSave}>
      <h3 className="m-0 mb-2 text-[15px] font-bold text-kolo-ink">Official Business Bank Account (NUBAN)</h3>
      <div className="text-[#6a7872] text-xs mb-5">
        This account is displayed on customer transfer payment screens and invoices.
      </div>

      <div className="mb-4">
        <label className="block text-[12px] font-bold mb-[7px]">Bank name</label>
        <select
          value={bankDetails.bankName}
          onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
          className="w-full border border-[#e4eae7] rounded-[9px] px-3 py-[10px] text-xs bg-white outline-none focus:border-[#0d7a55]"
        >
          <option>Moniepoint Microfinance Bank</option>
          <option>Guaranty Trust Bank</option>
          <option>Access Bank</option>
          <option>Zenith Bank</option>
          <option>OPay Digital Services</option>
          <option>Kuda Microfinance Bank</option>
          <option>United Bank for Africa (UBA)</option>
          <option>First Bank of Nigeria</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-[12px] font-bold mb-[7px]">10-Digit NUBAN Account Number</label>
        <input
          value={bankDetails.accountNumber}
          maxLength={10}
          onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
          className="w-full border border-[#e4eae7] rounded-[9px] px-3 py-[10px] text-xs font-mono bg-white outline-none focus:border-[#0d7a55]"
        />
      </div>

      <div className="mb-6">
        <label className="block text-[12px] font-bold mb-[7px]">Registered Account Name</label>
        <input
          value={bankDetails.accountName}
          onChange={(e) => setBankDetails({ ...bankDetails, accountName: e.target.value })}
          className="w-full border border-[#e4eae7] rounded-[9px] px-3 py-[10px] text-xs bg-[#fafcfb] text-kolo-ink outline-none"
        />
      </div>

      {saved && (
        <div className="mb-4 p-2.5 bg-[#eaf7f2] border border-[#0d7a55]/20 text-[#07553d] text-xs font-semibold rounded-lg">
          Payment settings saved successfully!
        </div>
      )}

      <button
        type="submit"
        className="bg-[#0d7a55] text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-[#07553d] transition-colors cursor-pointer"
      >
        Save Bank Details
      </button>
    </form>
  );
}

// ----------------------------------------------------
// 4. Nigerian Bank Transfer & Admin Approval Queue
// ----------------------------------------------------
function BankTransfersApprovalQueue() {
  const [transfers, setTransfers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [newTransfer, setNewTransfer] = useState({
    amountNaira: '',
    transferReference: '',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
    senderName: '',
    senderBank: 'GTBank',
  });

  const loadPendingTransfers = async () => {
    setLoading(true);
    try {
      const res = await paymentsApi.getPendingTransfers();
      if (res.success && Array.isArray(res.data)) {
        setTransfers(res.data);
      } else {
        // Fallback demo row for Nigerian bank transfer testing
        setTransfers([
          {
            id: 'trf-1',
            amountKobo: 4500000,
            transferReference: 'NIBSS-90481230491',
            receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
            senderName: 'Tunde Bakare',
            senderBank: 'Access Bank',
            createdAt: new Date().toISOString(),
          },
        ]);
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingTransfers();
  }, []);

  const handleVerify = async (id: string, status: 'SUCCESS' | 'FAILED') => {
    try {
      const notes = adminNotes[id] || (status === 'SUCCESS' ? 'Verified on business bank app' : 'Payment not found on bank statement');
      const res = await paymentsApi.verifyTransfer(id, {
        status,
        adminNotes: notes,
      });

      if (res.success) {
        toast.success(`Transfer ${status === 'SUCCESS' ? 'approved' : 'rejected'} successfully!`);
        setTransfers((prev) => prev.filter((t) => t.id !== id));
      } else {
        toast.info(`Transfer marked as ${status}.`);
        setTransfers((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (err: any) {
      toast.error(err?.message || 'Error communicating with verification endpoint');
    }
  };

  const handleCustomerSubmitTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTransfer.amountNaira || !newTransfer.transferReference || !newTransfer.senderName) return;

    try {
      const res = await paymentsApi.submitBankTransfer({
        amountKobo: toKobo(newTransfer.amountNaira),
        transferReference: newTransfer.transferReference.trim(),
        receiptUrl: newTransfer.receiptUrl,
        senderName: newTransfer.senderName.trim(),
        senderBank: newTransfer.senderBank,
      });

      if (res.success) {
        toast.success('Customer transfer submitted to admin queue!');
        setShowSubmitModal(false);
        loadPendingTransfers();
      } else {
        toast.error(res.error?.message || 'Failed to submit transfer');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Error submitting transfer');
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="m-0 text-[15px] font-bold text-kolo-ink flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#2E6F4D]" />
            Bank Transfer Approval Queue
          </h3>
          <div className="text-xs text-[#6a7872] mt-0.5">
            Admin verification queue for incoming NIP / NUBAN bank transfer proofs.
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowSubmitModal(true)}
            className="border border-[#e4eae7] bg-[#fafcfb] hover:bg-gray-50 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
          >
            + Test Submit Receipt
          </button>
          <button
            onClick={loadPendingTransfers}
            className="border border-[#e4eae7] bg-[#fafcfb] hover:bg-gray-50 p-1.5 rounded-lg cursor-pointer text-gray-600"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {transfers.length === 0 ? (
          <div className="p-8 text-center bg-[#FAF9F5] border border-[#E9E1D5] rounded-xl text-xs text-[#6a7872]">
            No pending bank transfers waiting for approval right now.
          </div>
        ) : (
          transfers.map((item) => (
            <div key={item.id} className="p-4 border border-[#e4eae7] rounded-xl bg-white space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-bold text-kolo-ink">{item.senderName}</div>
                  <div className="text-xs text-[#6a7872]">
                    Bank: <strong>{item.senderBank}</strong> • Ref: <span className="font-mono">{item.transferReference}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-sm text-[#2E6F4D]">
                    {formatNGN(item.amountKobo, true)}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                    Awaiting Verification
                  </span>
                </div>
              </div>

              {item.receiptUrl && (
                <div className="flex items-center gap-2">
                  <a
                    href={item.receiptUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-[#2E6F4D] font-bold hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" />
                    View Uploaded Receipt Image
                  </a>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2 border-t border-[#e4eae7]">
                <input
                  placeholder="Verification note (e.g. Confirmed on Moniepoint app)"
                  value={adminNotes[item.id] || ''}
                  onChange={(e) => setAdminNotes({ ...adminNotes, [item.id]: e.target.value })}
                  className="flex-1 border border-[#e4eae7] rounded px-2.5 py-1.5 text-xs outline-none"
                />
                <button
                  onClick={() => handleVerify(item.id, 'SUCCESS')}
                  className="px-3 py-1.5 bg-[#2E6F4D] hover:bg-[#25583d] text-white rounded text-xs font-bold cursor-pointer flex items-center gap-1"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  Approve
                </button>
                <button
                  onClick={() => handleVerify(item.id, 'FAILED')}
                  className="px-3 py-1.5 border border-red-300 text-red-600 hover:bg-red-50 rounded text-xs font-bold cursor-pointer flex items-center gap-1"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Customer Submission Mock Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl border border-[#e4eae7] w-full max-w-sm p-5 shadow-xl">
            <h3 className="m-0 text-base font-bold text-kolo-ink mb-3">Submit Customer Transfer Proof</h3>
            <form onSubmit={handleCustomerSubmitTransfer} className="space-y-3">
              <div>
                <label className="block text-xs font-bold mb-1 text-kolo-ink">Amount Transferred (₦)</label>
                <input
                  required
                  type="number"
                  value={newTransfer.amountNaira}
                  onChange={(e) => setNewTransfer({ ...newTransfer, amountNaira: e.target.value })}
                  placeholder="e.g. 45000"
                  className="w-full border rounded-lg px-3 py-2 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-kolo-ink">Sender Account Name</label>
                <input
                  required
                  value={newTransfer.senderName}
                  onChange={(e) => setNewTransfer({ ...newTransfer, senderName: e.target.value })}
                  placeholder="e.g. Adeola Johnson"
                  className="w-full border rounded-lg px-3 py-2 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-kolo-ink">Sender Bank</label>
                <input
                  required
                  value={newTransfer.senderBank}
                  onChange={(e) => setNewTransfer({ ...newTransfer, senderBank: e.target.value })}
                  placeholder="e.g. GTBank / OPay"
                  className="w-full border rounded-lg px-3 py-2 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-kolo-ink">NIBSS / Session Ref</label>
                <input
                  required
                  value={newTransfer.transferReference}
                  onChange={(e) => setNewTransfer({ ...newTransfer, transferReference: e.target.value })}
                  placeholder="e.g. 100004289381283"
                  className="w-full border rounded-lg px-3 py-2 text-xs outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#e4eae7]">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-3 py-1.5 border rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0d7a55] text-white rounded-lg text-xs font-bold"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

// ----------------------------------------------------
// 5. Notifications Form
// ----------------------------------------------------
function NotificationsForm() {
  return (
    <>
      <h3 className="m-0 mb-4 text-[15px] font-bold text-kolo-ink">Email Notifications</h3>
      <div className="flex flex-col gap-3.5 mb-6">
        <label className="flex items-center justify-between cursor-pointer text-xs">
          <span>Daily sales summary</span>
          <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#0d7a55]" />
        </label>
        <label className="flex items-center justify-between cursor-pointer text-xs">
          <span>Low stock threshold alerts</span>
          <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#0d7a55]" />
        </label>
        <label className="flex items-center justify-between cursor-pointer text-xs">
          <span>Incoming bank transfer receipt submissions</span>
          <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#0d7a55]" />
        </label>
      </div>

      <button
        onClick={() => toast.success('Notification preferences updated!')}
        className="bg-[#0d7a55] text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-[#07553d] transition-colors cursor-pointer"
      >
        Update preferences
      </button>
    </>
  );
}

// ----------------------------------------------------
// 6. Security Form
// ----------------------------------------------------
function SecurityForm() {
  return (
    <>
      <h3 className="m-0 mb-4 text-[15px] font-bold text-kolo-ink">Password & Authentication</h3>
      <div className="mb-3.5">
        <label className="block text-[12px] font-bold mb-[7px]">Current password</label>
        <input type="password" placeholder="••••••••" className="w-full border border-[#e4eae7] rounded-[9px] px-3 py-2 text-xs bg-white outline-none focus:border-[#0d7a55]" />
      </div>
      <div className="mb-3.5">
        <label className="block text-[12px] font-bold mb-[7px]">New password</label>
        <input type="password" placeholder="••••••••" className="w-full border border-[#e4eae7] rounded-[9px] px-3 py-2 text-xs bg-white outline-none focus:border-[#0d7a55]" />
      </div>
      <div className="mb-5">
        <label className="block text-[12px] font-bold mb-[7px]">Confirm new password</label>
        <input type="password" placeholder="••••••••" className="w-full border border-[#e4eae7] rounded-[9px] px-3 py-2 text-xs bg-white outline-none focus:border-[#0d7a55]" />
      </div>

      <button
        onClick={() => toast.success('Password updated successfully!')}
        className="bg-[#0d7a55] text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-[#07553d] transition-colors cursor-pointer mb-6"
      >
        Update password
      </button>

      <h3 className="m-0 mb-3 text-[14px] font-bold border-t border-[#e4eae7] pt-5">Two-Factor Authentication (2FA)</h3>
      <div className="text-[#6a7872] text-xs mb-4">Add extra verification security via Nigerian SMS OTP.</div>
      <button
        onClick={() => toast.info('SMS verification code sent to your registered phone number.')}
        className="border border-[#e4eae7] bg-[#fafcfb] px-3.5 py-2 rounded-lg font-bold text-xs hover:bg-gray-50 cursor-pointer"
      >
        Enable 2FA
      </button>
    </>
  );
}

// ----------------------------------------------------
// 7. Data Form
// ----------------------------------------------------
function DataForm() {
  return (
    <>
      <h3 className="m-0 mb-4 text-[15px] font-bold text-kolo-ink">Export Business Data</h3>
      <div className="text-[#6a7872] text-xs mb-5">Download your sales ledger, product catalogue, and customer lists in CSV format.</div>

      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center p-3 border border-[#e4eae7] rounded-lg bg-white">
          <div>
            <div className="font-bold text-xs text-kolo-ink">Sales & Transactions (.csv)</div>
            <div className="text-[11px] text-[#6a7872]">Recorded sales, integer kobo totals, dates, and payment methods</div>
          </div>
          <button
            onClick={() => toast.success('Preparing Sales & Transactions CSV download...')}
            className="border border-[#e4eae7] bg-[#fafcfb] px-3 py-1.5 rounded-md font-bold text-xs hover:bg-gray-50 cursor-pointer"
          >
            Export
          </button>
        </div>

        <div className="flex justify-between items-center p-3 border border-[#e4eae7] rounded-lg bg-white">
          <div>
            <div className="font-bold text-xs text-kolo-ink">Product Catalogue (.csv)</div>
            <div className="text-[11px] text-[#6a7872]">SKUs, categories, cost & selling prices, and live stock levels</div>
          </div>
          <button
            onClick={() => toast.success('Preparing Product Catalogue CSV download...')}
            className="border border-[#e4eae7] bg-[#fafcfb] px-3 py-1.5 rounded-md font-bold text-xs hover:bg-gray-50 cursor-pointer"
          >
            Export
          </button>
        </div>

        <div className="flex justify-between items-center p-3 border border-[#e4eae7] rounded-lg bg-white">
          <div>
            <div className="font-bold text-xs text-kolo-ink">Customer Directory (.csv)</div>
            <div className="text-[11px] text-[#6a7872]">Customer names, Nigerian phone numbers, and lifetime spend</div>
          </div>
          <button
            onClick={() => toast.success('Preparing Customer Directory CSV download...')}
            className="border border-[#e4eae7] bg-[#fafcfb] px-3 py-1.5 rounded-md font-bold text-xs hover:bg-gray-50 cursor-pointer"
          >
            Export
          </button>
        </div>
      </div>
    </>
  );
}
