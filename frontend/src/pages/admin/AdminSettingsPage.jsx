import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Settings, Save, Check, Loader2 } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    storeName: 'MODÉRA',
    contactEmail: 'concierge@modera-fashion.com',
    contactPhone: '+91 98765 43210',
    gstPercent: 12.0,
    freeShippingThreshold: 1999.0,
    standardShippingFee: 149.0,
    codEnabled: true,
    codFee: 49.0,
    announcementText: 'Complimentary Express Delivery on orders above ₹1,999 across India | Code: MODERA10',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/admin/settings');
        if (res.data?.data?.settings) {
          setSettings(res.data.data.settings);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    try {
      await api.put('/admin/settings', settings);
      setSuccessMsg('Store settings updated and deployed across the online boutique.');
    } catch (err) {
      alert('Error updating store settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <span className="text-[#A58256] text-xs font-semibold tracking-[0.25em] uppercase">
          OPERATIONAL CONFIGURATION
        </span>
        <h1 className="font-serif text-3xl font-bold text-[#141416] mt-1">
          Store Settings & Indian Taxation
        </h1>
        <p className="text-xs text-[#71717A] mt-1">
          Configure financial rules, GST rates, courier dispatch parameters, and global announcements.
        </p>
      </div>

      {successMsg && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-8 border border-[#EAE6DF] space-y-6 shadow-sm text-xs">
        
        {/* Brand identity */}
        <div className="space-y-4">
          <h3 className="font-serif text-sm font-bold text-[#141416] uppercase tracking-wider border-b border-[#EAE6DF] pb-2">
            Brand & Concierge Contact
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[#141416] font-semibold block mb-1">Store Name</label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full bg-[#FAF9F5] border border-[#D5D0C6] p-2.5 focus:outline-none focus:border-[#C5A880]"
              />
            </div>
            <div>
              <label className="text-[#141416] font-semibold block mb-1">Concierge Email</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full bg-[#FAF9F5] border border-[#D5D0C6] p-2.5 focus:outline-none focus:border-[#C5A880]"
              />
            </div>
            <div>
              <label className="text-[#141416] font-semibold block mb-1">Concierge Phone (+91)</label>
              <input
                type="text"
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                className="w-full bg-[#FAF9F5] border border-[#D5D0C6] p-2.5 focus:outline-none focus:border-[#C5A880]"
              />
            </div>
          </div>
        </div>

        {/* Taxation and shipping */}
        <div className="space-y-4 pt-4 border-t border-[#EAE6DF]">
          <h3 className="font-serif text-sm font-bold text-[#141416] uppercase tracking-wider border-b border-[#EAE6DF] pb-2">
            Indian Taxation & Shipping Thresholds
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[#141416] font-semibold block mb-1">Indian GST Rate (%)</label>
              <input
                type="number"
                step="0.01"
                value={settings.gstPercent}
                onChange={(e) => setSettings({ ...settings, gstPercent: Number(e.target.value) })}
                className="w-full bg-[#FAF9F5] border border-[#D5D0C6] p-2.5 focus:outline-none focus:border-[#C5A880]"
              />
              <p className="text-[10px] text-gray-500 mt-1">Configurable Indian GST percentage applied during checkout.</p>
            </div>

            <div>
              <label className="text-[#141416] font-semibold block mb-1">Free Shipping Order Threshold (₹)</label>
              <input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                className="w-full bg-[#FAF9F5] border border-[#D5D0C6] p-2.5 focus:outline-none focus:border-[#C5A880]"
              />
              <p className="text-[10px] text-gray-500 mt-1">Orders above this value unlock complimentary insured shipping.</p>
            </div>

            <div>
              <label className="text-[#141416] font-semibold block mb-1">Standard Shipping Fee (₹)</label>
              <input
                type="number"
                value={settings.standardShippingFee}
                onChange={(e) => setSettings({ ...settings, standardShippingFee: Number(e.target.value) })}
                className="w-full bg-[#FAF9F5] border border-[#D5D0C6] p-2.5 focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div>
              <label className="text-[#141416] font-semibold block mb-1">Cash on Delivery (COD) Fee (₹)</label>
              <input
                type="number"
                value={settings.codFee}
                onChange={(e) => setSettings({ ...settings, codFee: Number(e.target.value) })}
                className="w-full bg-[#FAF9F5] border border-[#D5D0C6] p-2.5 focus:outline-none focus:border-[#C5A880]"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.codEnabled}
                onChange={(e) => setSettings({ ...settings, codEnabled: e.target.checked })}
                className="accent-[#C5A880]"
              />
              <span className="font-semibold text-[#141416]">Enable Cash on Delivery option at checkout</span>
            </label>
          </div>
        </div>

        {/* Announcement bar copy */}
        <div className="space-y-4 pt-4 border-t border-[#EAE6DF]">
          <h3 className="font-serif text-sm font-bold text-[#141416] uppercase tracking-wider border-b border-[#EAE6DF] pb-2">
            Announcement Bar Ribbon
          </h3>
          <div>
            <label className="text-[#141416] font-semibold block mb-1">Announcement Message</label>
            <textarea
              rows={2}
              value={settings.announcementText}
              onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
              className="w-full bg-[#FAF9F5] border border-[#D5D0C6] p-2.5 focus:outline-none focus:border-[#C5A880]"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-[#EAE6DF]">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-[#141416] text-[#EFECE6] text-xs font-semibold uppercase tracking-wider hover:bg-[#C5A880] transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Deploy Settings'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}

