import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Lock, Mail, User, Phone, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AuthPage() {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });

  const { login, register, isLoading, error } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoginTab) {
      const res = await login(formData.email, formData.password);
      if (res.success) navigate(from, { replace: true });
    } else {
      const res = await register(formData);
      if (res.success) navigate(from, { replace: true });
    }
  };

  const handleQuickDemoLogin = async (type) => {
    if (type === 'admin') {
      await login('admin@modera-fashion.com', 'Modera@Admin2026!');
      navigate('/admin');
    } else {
      await login('customer@modera-fashion.com', 'Customer@123!');
      navigate('/account');
    }
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-16 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white border border-[#EAE6DF] p-8 sm:p-10 shadow-sm space-y-8">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <span className="font-serif text-3xl font-bold tracking-[0.2em] text-[#141416]">
            MODÉRA
          </span>
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#A58256]">
            PATRON ATELIER ACCESS
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#EAE6DF] text-xs font-semibold tracking-widest uppercase">
          <button
            onClick={() => setIsLoginTab(true)}
            className={`flex-1 py-3 text-center transition-colors relative ${
              isLoginTab ? 'text-[#141416]' : 'text-[#71717A] hover:text-[#141416]'
            }`}
          >
            SIGN IN
            {isLoginTab && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C5A880]" />}
          </button>

          <button
            onClick={() => setIsLoginTab(false)}
            className={`flex-1 py-3 text-center transition-colors relative ${
              !isLoginTab ? 'text-[#141416]' : 'text-[#71717A] hover:text-[#141416]'
            }`}
          >
            CREATE ACCOUNT
            {!isLoginTab && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C5A880]" />}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {!isLoginTab && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[#141416] font-semibold block mb-1">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Aanya"
                  className="w-full bg-[#FAF9F5] border border-[#D5D0C6] p-2.5 text-xs focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="text-[#141416] font-semibold block mb-1">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Kapoor"
                  className="w-full bg-[#FAF9F5] border border-[#D5D0C6] p-2.5 text-xs focus:outline-none focus:border-[#C5A880]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[#141416] font-semibold block mb-1">Email Address *</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="patron@example.com"
              className="w-full bg-[#FAF9F5] border border-[#D5D0C6] p-2.5 text-xs focus:outline-none focus:border-[#C5A880]"
            />
          </div>

          {!isLoginTab && (
            <div>
              <label className="text-[#141416] font-semibold block mb-1">Indian Mobile Number (+91)</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full bg-[#FAF9F5] border border-[#D5D0C6] p-2.5 text-xs focus:outline-none focus:border-[#C5A880]"
              />
            </div>
          )}

          <div>
            <label className="text-[#141416] font-semibold block mb-1">Password *</label>
            <input
              type="password"
              name="password"
              required
              minLength={8}
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 8 characters"
              className="w-full bg-[#FAF9F5] border border-[#D5D0C6] p-2.5 text-xs focus:outline-none focus:border-[#C5A880]"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#141416] text-[#EFECE6] py-3.5 text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#C5A880] transition-colors flex items-center justify-center gap-2 mt-2"
          >
            <span>{isLoginTab ? 'ACCESS ATELIER' : 'REGISTER PATRON'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo One-Click Access for Evaluation */}
        <div className="pt-4 border-t border-[#EAE6DF] space-y-2 text-center">
          <p className="text-[10px] uppercase tracking-widest text-[#A58256] font-semibold">
            One-Click Demonstration Logins
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handleQuickDemoLogin('customer')}
              className="flex-1 py-2 bg-[#F2EFE9] text-[#141416] text-[11px] font-semibold hover:bg-[#E5E0D6] transition-colors"
            >
              Demo Patron Login
            </button>
            <button
              onClick={() => handleQuickDemoLogin('admin')}
              className="flex-1 py-2 bg-[#141416] text-[#C5A880] text-[11px] font-semibold hover:bg-black transition-colors"
            >
              Demo Admin Login
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

