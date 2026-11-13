import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  ShoppingBag, 
  Search, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  XCircle, 
  Loader2 
} from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState('');

  // Status edit form
  const [newStatus, setNewStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('Delhivery Express');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/orders${statusFilter ? `?status=${statusFilter}` : ''}`);
      setOrders(res.data?.data?.orders || []);
    } catch (err) {
      console.error(err);
      // Fallback demo order
      setOrders([
        {
          id: 'ord-demo-1',
          orderNumber: 'MOD-202611-A890F',
          status: 'CONFIRMED',
          paymentStatus: 'COMPLETED',
          paymentMethod: 'RAZORPAY',
          totalAmount: 13499,
          subtotalAmount: 11999,
          taxAmount: 1500,
          shippingAmount: 0,
          createdAt: new Date().toISOString(),
          user: { firstName: 'Aanya', lastName: 'Kapoor', email: 'aanya@example.com', phone: '+91 98222 33344' },
          address: { fullName: 'Aanya Kapoor', streetAddress: 'Altamount Road', apartment: 'Penthouse 14B', city: 'Mumbai', state: 'Maharashtra', postalCode: '400026' },
          items: [
            {
              quantity: 1,
              unitPrice: 13499,
              product: { name: 'Mulberry Silk Bias-Cut Column Gown', sku: 'MOD-WDR-005' },
              variant: { size: 'S', colorName: 'Champagne Pearl' },
            },
          ],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleOpenEdit = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setTrackingNumber(order.trackingNumber || '');
    setCarrier(order.shippingCarrier || 'Delhivery Express');
    setUpdateMsg('');
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setUpdating(true);
    try {
      await api.patch(`/admin/orders/${selectedOrder.id}/status`, {
        status: newStatus,
        trackingNumber,
        shippingCarrier: carrier,
      });
      setUpdateMsg(`Order updated to ${newStatus}.`);
      fetchOrders();
      setSelectedOrder(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating order');
    } finally {
      setUpdating(false);
    }
  };

  const filteredOrders = orders.filter((o) =>
    o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
    o.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
    o.user?.firstName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <span className="text-[#A58256] text-xs font-semibold tracking-[0.25em] uppercase">
          FULFILLMENT SUITE
        </span>
        <h1 className="font-serif text-3xl font-bold text-[#141416] mt-1">
          Patron Orders & Consignment Tracking
        </h1>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 border border-[#EAE6DF]">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ref, patron name, email..."
            className="w-full bg-[#FAF9F5] border border-[#D5D0C6] py-2 pl-9 pr-3 text-xs text-[#141416] focus:outline-none focus:border-[#C5A880]"
          />
          <Search className="w-4 h-4 text-[#8A8A93] absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-[#71717A] uppercase tracking-wider">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#FAF9F5] border border-[#D5D0C6] px-3 py-1.5 text-xs text-[#141416] focus:outline-none focus:border-[#C5A880]"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-[#EAE6DF] shadow-sm overflow-hidden">
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D5D0C6] text-[#A58256] uppercase text-[10px] tracking-wider bg-[#F2EFE9]/40">
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Patron & Destination</th>
                <th className="py-3 px-4">Total Amount (₹)</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Consignment Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE6DF] text-[#141416]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[#71717A]">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#C5A880] mb-2" />
                    Retrieving consignments...
                  </td>
                </tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#FAF9F5] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-xs">
                      {o.orderNumber}
                      <span className="block font-sans font-normal text-[10px] text-gray-500">
                        {new Date(o.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold">{o.user?.firstName} {o.user?.lastName}</p>
                      <p className="text-[10px] text-gray-500">{o.address?.city}, {o.address?.state} ({o.address?.postalCode})</p>
                    </td>
                    <td className="py-3.5 px-4 font-bold">
                      ₹{Number(o.totalAmount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold block">{o.paymentMethod}</span>
                      <span className="text-[10px] text-gray-500">
                        {o.paymentStatus === 'COMPLETED' ? 'Settled' : o.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                        o.status === 'DELIVERED' 
                          ? 'bg-green-100 text-green-800' 
                          : o.status === 'CANCELLED' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-amber-100 text-amber-800'
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenEdit(o)}
                        className="px-3 py-1 bg-[#141416] text-[#EFECE6] text-[11px] font-semibold hover:bg-[#C5A880] transition-colors"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    No orders matching filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Status Management Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF9F5] max-w-lg w-full p-6 sm:p-8 border border-[#EAE6DF] shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-[#EAE6DF] pb-4">
              <div>
                <span className="text-[#A58256] text-[10px] font-semibold tracking-widest uppercase">
                  CONSIGNMENT FULFILLMENT
                </span>
                <h3 className="font-mono text-lg font-bold text-[#141416]">
                  {selectedOrder.orderNumber}
                </h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-500 hover:text-black">
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
              <div>
                <label className="text-[#141416] font-semibold block mb-1">Update Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-white border border-[#D5D0C6] p-2.5 focus:outline-none focus:border-[#C5A880]"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="PROCESSING">PROCESSING (Artisan Tailoring)</option>
                  <option value="SHIPPED">SHIPPED (In Transit)</option>
                  <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY (Out for Handover)</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED (Restores Inventory)</option>
                </select>
              </div>

              <div>
                <label className="text-[#141416] font-semibold block mb-1">Carrier Partner</label>
                <select
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  className="w-full bg-white border border-[#D5D0C6] p-2.5 focus:outline-none focus:border-[#C5A880]"
                >
                  <option value="Delhivery Express">Delhivery Express</option>
                  <option value="Blue Dart Apex">Blue Dart Apex</option>
                  <option value="DTDC Prime">DTDC Prime</option>
                  <option value="Shadowfax VIP">Shadowfax VIP</option>
                </select>
              </div>

              <div>
                <label className="text-[#141416] font-semibold block mb-1">Airway Bill / Tracking Number</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. DEL-984210459"
                  className="w-full bg-white border border-[#D5D0C6] p-2.5 font-mono focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#EAE6DF]">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 border border-gray-300 hover:bg-gray-100 uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2 bg-[#141416] text-[#EFECE6] font-semibold uppercase tracking-wider hover:bg-[#C5A880] transition-colors"
                >
                  {updating ? 'Updating...' : 'Save Consignment Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

