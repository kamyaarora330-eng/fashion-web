import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Truck, RotateCcw, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

export default function PolicyPage() {
  const { policyType } = useParams(); // 'shipping' | 'returns' | 'privacy' | 'terms'

  const policyContent = {
    shipping: {
      title: 'Pan-India Express Shipping Policy',
      icon: Truck,
      subtitle: 'Insured luxury delivery protocols tailored for Indian metropolitan zones.',
      body: (
        <div className="space-y-6 text-xs text-[#38383E] leading-relaxed">
          <section className="space-y-2">
            <h3 className="font-serif text-base font-bold text-[#141416]">1. Complimentary Delivery Threshold</h3>
            <p>
              MODÉRA offers complimentary, fully-insured Express Courier delivery across India on all orders exceeding ₹1,999. 
              Orders below this amount incur a nominal flat standard handling fee of ₹149.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif text-base font-bold text-[#141416]">2. Transit Timelines & Carrier Partners</h3>
            <p>
              Consignments are dispatched directly from our flagship Mumbai fulfillment atelier via premier courier networks (Delhivery Express, Blue Dart Apex). 
              Delivery to tier-1 metropolitan hubs (Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Kolkata, Pune) is completed within 2 to 3 business days. 
              Other regional pin codes typically require 4 to 6 business days.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif text-base font-bold text-[#141416]">3. Cash on Delivery (COD) Guidelines</h3>
            <p>
              Cash on Delivery is available up to ₹15,000 per order across supported PIN codes. 
              A nominal COD handling surcharge of ₹49 applies. Valid mobile phone OTP confirmation may be requested prior to dispatch.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif text-base font-bold text-[#141416]">4. Packaging Integrity</h3>
            <p>
              Every garment arrives encased in breathable protective garment covers nestled within rigid custom magnetic-clasp presentation boxes with tamper-evident security seals.
            </p>
          </section>
        </div>
      ),
    },
    returns: {
      title: 'Returns & Refund Framework',
      icon: RotateCcw,
      subtitle: 'Effortless 7-day doorstep pickup and inspection process.',
      body: (
        <div className="space-y-6 text-xs text-[#38383E] leading-relaxed">
          <section className="space-y-2">
            <h3 className="font-serif text-base font-bold text-[#141416]">1. 7-Day Curated Return Window</h3>
            <p>
              We want you to be completely enamored with your silhouette. If a piece does not fulfill your expectations or requires size adjustment, 
              you may initiate an exchange or return within 7 calendar days of verified delivery.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif text-base font-bold text-[#141416]">2. Garment Condition Standards</h3>
            <p>
              Garments must remain unworn, unwashed, unaltered, and with all original brand tags, spare buttons, and security ribbons intact. 
              Customized, monogrammed, or made-to-measure bespoke creations are exempt from returns.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif text-base font-bold text-[#141416]">3. Refund Processing Timelines</h3>
            <p>
              Upon physical receipt and quality inspection at our atelier, refunds are initiated within 48 hours. 
              Prepaid transactions (Razorpay, UPI, Cards) are refunded directly to the original source instrument within 4 to 7 banking days. 
              For Cash on Delivery orders, refunds are disbursed via secure NEFT/IMPS bank transfer.
            </p>
          </section>
        </div>
      ),
    },
    privacy: {
      title: 'Patron Privacy & Data Confidentiality',
      icon: ShieldCheck,
      subtitle: 'Adherence to Indian Digital Personal Data Protection standards.',
      body: (
        <div className="space-y-6 text-xs text-[#38383E] leading-relaxed">
          <section className="space-y-2">
            <h3 className="font-serif text-base font-bold text-[#141416]">1. Confidentiality Commitment</h3>
            <p>
              MODÉRA respects your personal privacy. We never monetize, sell, or rent patron records to third-party marketing networks.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif text-base font-bold text-[#141416]">2. Data Collected</h3>
            <p>
              We collect only pertinent contact details (name, email, mobile number, delivery address) essential for order fulfillment and taxation compliance under Indian GST regulations.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif text-base font-bold text-[#141416]">3. Payment Data Security</h3>
            <p>
              Payment credentials, CVV codes, and netbanking passwords are never stored on MODÉRA servers. 
              All financial operations are tokenized and processed via RBI-authorized payment aggregator Razorpay with 256-bit SSL encryption.
            </p>
          </section>
        </div>
      ),
    },
    terms: {
      title: 'Terms of Service & Indian GST Invoicing',
      icon: FileText,
      subtitle: 'Transparent commercial terms complying with Indian law.',
      body: (
        <div className="space-y-6 text-xs text-[#38383E] leading-relaxed">
          <section className="space-y-2">
            <h3 className="font-serif text-base font-bold text-[#141416]">1. GST Compliance & Invoicing</h3>
            <p>
              All prices displayed on MODÉRA are in Indian Rupees (INR ₹) and are inclusive of Goods and Services Tax (GST) at statutory apparel rates (12%). 
              A compliant tax invoice with HSN code breakdown is generated and dispatched with each consignment.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif text-base font-bold text-[#141416]">2. Pricing & Inventory Accuracy</h3>
            <p>
              While we make every endeavor to maintain absolute inventory accuracy, rare discrepancies may occur. 
              In the unlikely event an item is unavailable after placement, our concierge will promptly contact you to provide immediate full reimbursement.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif text-base font-bold text-[#141416]">3. Governing Jurisdiction</h3>
            <p>
              Any disputes arising in connection with orders placed on MODÉRA shall be subject to the exclusive jurisdiction of the competent courts of Mumbai, Maharashtra.
            </p>
          </section>
        </div>
      ),
    },
  };

  const current = policyContent[policyType] || policyContent.shipping;
  const Icon = current.icon;

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Navigation pills */}
        <div className="flex flex-wrap gap-2 border-b border-[#EAE6DF] pb-4">
          {[
            { id: 'shipping', label: 'Shipping & Delivery' },
            { id: 'returns', label: 'Returns & Refunds' },
            { id: 'privacy', label: 'Privacy Policy' },
            { id: 'terms', label: 'Terms & GST' },
          ].map((tab) => (
            <Link
              key={tab.id}
              to={`/policies/${tab.id}`}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-colors ${
                policyType === tab.id
                  ? 'bg-[#141416] text-[#EFECE6]'
                  : 'bg-white border border-[#D5D0C6] text-[#141416] hover:border-[#C5A880]'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {/* Content Box */}
        <div className="bg-white border border-[#EAE6DF] p-8 sm:p-12 space-y-8 shadow-sm">
          <div className="space-y-2 border-b border-[#EAE6DF] pb-6">
            <div className="flex items-center gap-2 text-[#C5A880]">
              <Icon className="w-5 h-5" />
              <span className="text-[10px] uppercase tracking-widest font-bold">Official Document</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#141416]">
              {current.title}
            </h1>
            <p className="text-xs text-[#71717A]">{current.subtitle}</p>
          </div>

          <div>{current.body}</div>

          <div className="pt-6 border-t border-[#EAE6DF] flex items-center justify-between text-[11px] text-[#A1A1AA]">
            <span>Last Updated: November 2026</span>
            <span>Concierge: concierge@modera-fashion.com</span>
          </div>
        </div>

      </div>
    </div>
  );
}

