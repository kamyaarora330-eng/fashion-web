import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Tag, Plus, Check, Loader2 } from 'lucide-react';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'PERCENTAGE',
    discountValue: 15,
    minOrderAmount: 1999,
    maxDiscountAmount: 3000,
    endDate: '2028-12-31T23:59:59Z',
  });

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/coupons');
      setCoupons(res.data?.data?.coupons || []);
    } catch (err) {
      console.error(err);
      // Demo fallback
      setCoupons([
        {
          id: 'c1',
          code: 'MODERA10',
          description: '10% welcome privilege across all collections',
          discountType: 'PERCENTAGE',
          discountValue: 10,
          minOrderAmount: 1499,
          timesUsed: 142,
          isActive: true,
        },
        {
          id: 'c2',
          code: 'FESTIVE20',
          description: 'Festive season discount for luxury ensembles',
          discountType: 'PERCENTAGE',
          discountValue: 20,
          minOrderAmount: 4999,
          timesUsed: 49,
          isActive: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg('');
    try {
      await api.post('/admin/coupons', formData);
      setSuccessMsg(`Privilege voucher ${formData.code} published.`);
      setShowForm(false);
      setFormData({
        code: '',
        description: '',
        discountType: 'PERCENTAGE',
        discountValue: 15,
        minOrderAmount: 1999,
        maxDiscountAmount: 3000,
        endDate: '2028-12-31T23:59:59Z',
      });
      fetchCoupons();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating coupon');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[#A58256] text-xs font-semibold tracking-[0.25em] uppercase">
            PROMOTIONAL PRIVILEGES
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#141416] mt-1">
            Privilege Vouchers & Discounts
          </h1>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-[#141416] text-[#EFECE6] text-xs uppercase tracking-widest font-semibold hover:bg-[#C5A880] transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>{showForm ? 'Close Form' : 'Generate New Privilege Code'}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white p-6 border border-[#EAE6DF] max-w-xl space-y-4 shadow-sm">
          <h3 className="font-serif text-base font-bold text-[#141416] uppercase tracking-wider border-b border-[#EAE6DF] pb-2">
            New Voucher Parameters
          </h3>

          <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[#141416] font-semibold block mb-1">Voucher Code *</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. ROYAL25"
                  className="w-full bg-[#FAF9F5] border border-[#D5D0C6] p-2.5 font-mono uppercase focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="text-[#141416] font-semibold block mb-1">Discount Type</label>
                <select
                  value={formData.discountType}
                  onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                  className="w-full bg-[#FAF9F5] border border-[#D5D0C6] p-2.5 focus:outline-none focus:border-[#C5A880]"
                >
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FIXED">Fixed Amount (₹)</option>
                </select>
              </div>

              <div>
                <label className="text-[#141416] font-semibold block mb-1">Discount Value *</label>
                <input
                  type="number"
                  required
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                  className="w-full bg-[#FAF9F5] border border-[#D5D0C6] p-2.5 focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="text-[#141416] font-semibold block mb-1">Min Order Amount (₹)</label>
                <input
                  type="number"
                  value={formData.minOrderAmount}
                  onChange={(e) => setFormData({ ...formData, minOrderAmount: Number(e.target.value) })}
                  className="w-full bg-[#FAF9F5] border border-[#D5D0C6] p-2.5 focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div className="col-span-2">
                <label className="text-[#141416] font-semibold block mb-1">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Exclusive invitation for festive acquisitions"
                  className="w-full bg-[#FAF9F5] border border-[#D5D0C6] p-2.5 focus:outline-none focus:border-[#C5A880]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-[#141416] text-[#EFECE6] text-xs font-semibold uppercase tracking-wider hover:bg-[#C5A880] transition-colors"
            >
              {submitting ? 'Generating...' : 'Publish Voucher'}
            </button>
          </form>
        </div>
      )}

      {/* Coupons List */}
      <div className="bg-white border border-[#EAE6DF] shadow-sm overflow-hidden">
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D5D0C6] text-[#A58256] uppercase text-[10px] tracking-wider bg-[#F2EFE9]/40">
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Privilege</th>
                <th className="py-3 px-4">Min Spend</th>
                <th className="py-3 px-4">Usage Count</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE6DF] text-[#141416]">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-[#FAF9F5] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-sm text-[#141416]">{c.code}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold">
                      {c.discountType === 'PERCENTAGE' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                    </span>
                    <p className="text-[10px] text-gray-500">{c.description}</p>
                  </td>
                  <td className="py-3.5 px-4">₹{Number(c.minOrderAmount).toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-4 font-bold">{c.timesUsed || 0} patrons</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 bg-green-100 text-green-800 text-[10px] font-bold uppercase rounded">
                      ACTIVE
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

