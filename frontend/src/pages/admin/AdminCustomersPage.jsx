import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Users, Search, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/customers');
      setCustomers(res.data?.data?.customers || []);
    } catch (err) {
      console.error(err);
      // Demo fallback
      setCustomers([
        {
          id: 'cust-1',
          firstName: 'Aanya',
          lastName: 'Kapoor',
          email: 'customer@modera-fashion.com',
          phone: '+91 98222 33344',
          isActive: true,
          totalOrders: 3,
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleToggleStatus = async (id) => {
    try {
      await api.patch(`/admin/customers/${id}/toggle-status`);
      fetchCustomers();
    } catch (err) {
      alert('Error updating customer status');
    }
  };

  const filtered = customers.filter((c) =>
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.firstName.toLowerCase().includes(search.toLowerCase()) ||
    c.lastName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <span className="text-[#A58256] text-xs font-semibold tracking-[0.25em] uppercase">
          CLIENTELE ATELIER
        </span>
        <h1 className="font-serif text-3xl font-bold text-[#141416] mt-1">
          Registered Patrons Directory
        </h1>
      </div>

      <div className="bg-white p-4 border border-[#EAE6DF] max-w-md">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by patron name or email..."
            className="w-full bg-[#FAF9F5] border border-[#D5D0C6] py-2 pl-9 pr-3 text-xs text-[#141416] focus:outline-none focus:border-[#C5A880]"
          />
          <Search className="w-4 h-4 text-[#8A8A93] absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div className="bg-white border border-[#EAE6DF] shadow-sm overflow-hidden">
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D5D0C6] text-[#A58256] uppercase text-[10px] tracking-wider bg-[#F2EFE9]/40">
                <th className="py-3 px-4">Patron Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Mobile</th>
                <th className="py-3 px-4">Total Consignments</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE6DF] text-[#141416]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[#71717A]">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#C5A880] mb-2" />
                    Loading patrons...
                  </td>
                </tr>
              ) : filtered.map((c) => (
                <tr key={c.id} className="hover:bg-[#FAF9F5] transition-colors">
                  <td className="py-3.5 px-4 font-bold">{c.firstName} {c.lastName}</td>
                  <td className="py-3.5 px-4 text-gray-600">{c.email}</td>
                  <td className="py-3.5 px-4">{c.phone || '—'}</td>
                  <td className="py-3.5 px-4 font-bold">{c.totalOrders || 0}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                      c.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {c.isActive ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleToggleStatus(c.id)}
                      className="text-xs text-[#A58256] hover:underline font-semibold"
                    >
                      {c.isActive ? 'Suspend' : 'Reactivate'}
                    </button>
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

