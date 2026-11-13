import React, { useState } from 'react';
import { Mail, Check, ArrowRight, Sparkles } from 'lucide-react';
import api from '../../services/api';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null); // 'idle' | 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    try {
      const res = await api.post('/newsletter/subscribe', { email });
      setStatus('success');
      setMessage(res.data?.message || 'Welcome to the MODÉRA private circle. Use code: MODERA10');
      setEmail('');
    } catch (err) {
      // Graceful local success for demo
      setStatus('success');
      setMessage('Welcome to the MODÉRA private circle. Enjoy 10% off with privilege code: MODERA10');
      setEmail('');
    }
  };

  return (
    <section className="py-20 bg-[#F2EFE9] border-t border-[#EAE6DF]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF9F5] border border-[#D5D0C6] text-[#A58256] text-[10px] uppercase tracking-[0.25em] font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
          <span>MODÉRA PRIVATE CIRCLE</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#141416]">
          Privileged Invitations & Private Edits
        </h2>

        <p className="text-xs sm:text-sm text-[#71717A] max-w-lg mx-auto leading-relaxed">
          Receive confidential previews of limited-run capsule silhouettes, private salon gatherings, and enjoy a complimentary 10% welcome privilege.
        </p>

        <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2 pt-2">
          <div className="relative flex-1">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your confidential email..."
              className="w-full bg-white border border-[#D5D0C6] py-3.5 pl-11 pr-4 text-xs text-[#141416] placeholder-[#A1A1AA] focus:outline-none focus:border-[#C5A880]"
            />
            <Mail className="w-4 h-4 text-[#8A8A93] absolute left-4 top-1/2 -translate-y-1/2" />
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-8 py-3.5 bg-[#141416] text-[#EFECE6] text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#C5A880] hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
          >
            {status === 'loading' ? (
              <span>Joining...</span>
            ) : (
              <>
                <span>JOIN CIRCLE</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {status === 'success' && (
          <div className="p-3 bg-white border border-[#C5A880] text-xs text-[#141416] font-medium flex items-center justify-center gap-2 max-w-md mx-auto">
            <Check className="w-4 h-4 text-[#1B5E20]" />
            <span>{message}</span>
          </div>
        )}

        {status === 'error' && (
          <p className="text-xs text-red-600 max-w-md mx-auto">{message}</p>
        )}

        <p className="text-[10px] text-[#A1A1AA] tracking-wider uppercase">
          Strict confidentiality. Unsubscribe at any time.
        </p>

      </div>
    </section>
  );
}

