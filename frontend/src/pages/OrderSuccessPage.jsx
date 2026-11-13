import React from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

export default function OrderSuccessPage() {
  const { orderNumber } = useParams();
  const location = useLocation();
  const order = location.state?.order;

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#EAE6DF] p-8 sm:p-12 text-center space-y-6 shadow-sm">
          
          <div className="w-16 h-16 bg-[#F2EFE9] rounded-full flex items-center justify-center mx-auto text-[#C5A880]">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-[#A58256] text-xs font-semibold tracking-[0.25em] uppercase">
              ACQUISITION CONFIRMED
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#141416]">
              Thank You for Your Order
            </h1>
            <p className="text-xs sm:text-sm text-[#71717A] max-w-md mx-auto leading-relaxed">
              Our master artisans have commenced preparation of your bespoke couture pieces. 
              Confirmation dispatched to your registered address.
            </p>
          </div>

          {/* Reference Box */}
          <div className="bg-[#FAF9F5] p-6 border border-[#EAE6DF] max-w-md mx-auto text-xs space-y-3">
            <div className="flex justify-between border-b border-[#EAE6DF] pb-2">
              <span className="text-[#71717A] uppercase tracking-wider">Order Reference</span>
              <span className="font-mono font-bold text-[#141416] text-sm">{orderNumber}</span>
            </div>

            <div className="flex justify-between border-b border-[#EAE6DF] pb-2">
              <span className="text-[#71717A]">Estimated Dispatch</span>
              <span className="font-semibold text-[#141416]">Within 24 Hours</span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#71717A]">Delivery Zone</span>
              <span className="font-semibold text-[#141416]">
                {order?.address?.city || 'India Express'}
              </span>
            </div>
          </div>

          {/* Action Links */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to={`/track-order?ref=${orderNumber}`}
              className="px-6 py-3 bg-[#141416] text-[#EFECE6] text-xs uppercase tracking-widest font-semibold hover:bg-[#C5A880] transition-colors flex items-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              <span>Track Consignment</span>
            </Link>

            <Link
              to="/shop/collections"
              className="px-6 py-3 border border-[#141416] text-[#141416] text-xs uppercase tracking-widest font-semibold hover:bg-[#FAF9F5] transition-colors"
            >
              Continue Exploring
            </Link>
          </div>

          <div className="pt-6 border-t border-[#EAE6DF] text-[11px] text-[#A1A1AA] flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
            <span>MODÉRA Authenticity & Craft Guarantee included with consignment.</span>
          </div>

        </div>
      </div>
    </div>
  );
}

