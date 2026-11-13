import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import api from '../services/api';
import { 
  User, 
  Package, 
  MapPin, 
  LogOut, 
  Clock, 
  CheckCircle, 
  ShieldCheck, 
  ArrowRight, 
  LayoutDashboard 
} from 'lucide-react';

export default function AccountPage() {
  const { user, isAdmin, logout, updateProfile } = useAuthStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'profile' | 'addresses'
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Profile form
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
  });
  const [profileMsg, setProfileMsg] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchCustomerData = async () => {
      setLoading(true);
      try {
        const [ordersRes, addrRes] = await Promise.allSettled([
          api.get('/users/orders'),
          api.get('/users/addresses'),
        ]);

        if (ordersRes.status === 'fulfilled') {
          setOrders(ordersRes.value.data?.data?.orders || []);
        }
        if (addrRes.status === 'fulfilled') {
          setAddresses(addrRes.value.data?.data?.addresses || []);
        }
      } catch (err) {
        console.error('Error fetching account data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [user, navigate]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileMsg('');
    const res = await updateProfile(profileForm);
    if (res.success) {
      setProfileMsg('Profile information updated successfully.');
    }
  };

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="border-b border-[#EAE6DF] pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-[#A58256] text-xs font-semibold tracking-[0.25em] uppercase">
              PATRON PROFILE
            </span>
            <h1 className="font-serif text-3xl font-bold text-[#141416] mt-1">
              Welcome, {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-xs text-[#71717A]">{user?.email}</p>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link
                to="/admin"
                className="px-4 py-2 bg-[#141416] text-[#C5A880] text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors flex items-center gap-1.5"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Admin Console</span>
              </Link>
            )}

            <button
              onClick={handleSignOut}
              className="px-4 py-2 border border-[#141416] text-[#141416] text-xs uppercase tracking-wider hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#EAE6DF] text-xs font-semibold tracking-wider uppercase space-x-8">
          {[
            { id: 'orders', label: 'My Consignments', icon: Package },
            { id: 'profile', label: 'Personal Information', icon: User },
            { id: 'addresses', label: 'Address Book', icon: MapPin },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 flex items-center gap-2 relative transition-colors ${
                  activeTab === tab.id ? 'text-[#141416]' : 'text-[#71717A] hover:text-[#141416]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C5A880]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="bg-white p-12 border border-[#EAE6DF] text-center space-y-4">
                <Package className="w-10 h-10 text-[#C5A880] mx-auto" />
                <h3 className="font-serif text-lg font-bold text-[#141416]">No Consignments Placed Yet</h3>
                <p className="text-xs text-[#71717A] max-w-sm mx-auto">
                  Your acquisitions will appear here with live transit tracking.
                </p>
                <Link
                  to="/shop/collections"
                  className="inline-block px-6 py-2.5 bg-[#141416] text-[#EFECE6] text-xs uppercase tracking-widest hover:bg-[#C5A880]"
                >
                  Explore Silhouettes
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((o) => (
                  <div key={o.id} className="bg-white border border-[#EAE6DF] p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-[#EAE6DF] pb-3 text-xs">
                      <div>
                        <span className="font-mono font-bold text-sm text-[#141416]">{o.orderNumber}</span>
                        <span className="text-[#71717A] ml-3">
                          {new Date(o.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 bg-[#F2EFE9] text-[#141416] text-[10px] font-bold uppercase tracking-wider">
                          Status: {o.status}
                        </span>
                        <span className="font-bold text-[#141416]">
                          ₹{Number(o.totalAmount).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-3">
                      {o.items?.map((item, idx) => (
                        <div key={idx} className="flex gap-4 text-xs">
                          <img
                            src={item.product?.images?.[0]?.url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=200&q=80'}
                            alt=""
                            className="w-14 h-18 object-cover bg-neutral-100"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-[#141416]">{item.product?.name}</h4>
                            <p className="text-[11px] text-[#71717A]">
                              Size: {item.variant?.size} • Color: {item.variant?.colorName} • Qty: {item.quantity}
                            </p>
                            <p className="font-medium text-[#141416] mt-1">₹{Number(item.totalPrice).toLocaleString('en-IN')}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Action */}
                    <div className="pt-3 border-t border-[#EAE6DF] flex justify-end">
                      <Link
                        to={`/track-order?ref=${o.orderNumber}`}
                        className="text-xs text-[#A58256] font-semibold hover:underline flex items-center gap-1"
                      >
                        <span>Live Tracking Updates</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white p-8 border border-[#EAE6DF] max-w-xl space-y-6">
            <h3 className="font-serif text-lg font-bold text-[#141416] uppercase tracking-wider border-b border-[#EAE6DF] pb-3">
              Personal Information
            </h3>

            {profileMsg && <p className="text-xs text-green-700 bg-green-50 p-2.5 border border-green-200">{profileMsg}</p>}

            <form onSubmit={handleProfileSave} className="space-y-4 text-xs">
              <div>
                <label className="text-[#141416] font-semibold block mb-1">First Name</label>
                <input
                  type="text"
                  value={profileForm.firstName}
                  onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                  className="w-full bg-[#FAF9F5] border border-[#D5D0C6] p-2.5 text-xs focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="text-[#141416] font-semibold block mb-1">Last Name</label>
                <input
                  type="text"
                  value={profileForm.lastName}
                  onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                  className="w-full bg-[#FAF9F5] border border-[#D5D0C6] p-2.5 text-xs focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="text-[#141416] font-semibold block mb-1">Mobile (+91)</label>
                <input
                  type="text"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full bg-[#FAF9F5] border border-[#D5D0C6] p-2.5 text-xs focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#141416] text-[#EFECE6] text-xs uppercase tracking-wider hover:bg-[#C5A880] transition-colors"
              >
                Save Changes
              </button>
            </form>
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {addresses.map((a) => (
                <div key={a.id} className="bg-white p-6 border border-[#EAE6DF] space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#141416] text-sm">{a.fullName}</span>
                    {a.isDefault && (
                      <span className="px-2 py-0.5 bg-[#C5A880] text-white text-[9px] font-bold uppercase">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-[#4A4A4F]">{a.apartment}, {a.streetAddress}</p>
                  <p className="text-[#4A4A4F]">{a.city}, {a.state} - {a.postalCode}</p>
                  <p className="text-[#71717A] pt-1">Contact: {a.phone}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

