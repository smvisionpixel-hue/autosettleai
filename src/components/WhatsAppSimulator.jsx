import React, { useState } from 'react';
import { Send, CheckCheck, Phone, Video, MoreVertical, ShieldCheck, RefreshCw, Smartphone } from 'lucide-react';
import { useClaims } from '../context/ClaimsContext';

export default function WhatsAppSimulator({ claim, customMessage = null }) {
  const { showToast } = useClaims();
  const [messages, setMessages] = useState([
    {
      id: 'm-1',
      sender: 'bot',
      text: customMessage || claim?.whatsappLog?.message || `Claim #${claim?.id || 'AS-8942'} auto-approved for ${claim?.payoutBreakdown?.totalPayout ? '₹' + claim.payoutBreakdown.totalPayout.toLocaleString('en-IN') : '₹12,500'}. Transferred to ${claim?.preferredGarage || 'Apex Garage'} linked account. Digital settlement receipt generated.`,
      time: '10:17 AM',
      status: 'read',
    }
  ]);
  const [isSending, setIsSending] = useState(false);
  const [inputVal, setInputVal] = useState('');

  const handleSimulateResend = () => {
    setIsSending(true);
    showToast('Triggering WhatsApp Webhook notification...', 'info');
    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newMsg = {
        id: `m-${Date.now()}`,
        sender: 'bot',
        text: `⚡ PUSH NOTIFICATION: Payout authorization confirmed for Claim #${claim?.id || 'AS-8942'}. Work order dispatched to authorized repair partner.`,
        time: timeStr,
        status: 'read',
      };
      setMessages((prev) => [...prev, newMsg]);
      setIsSending(false);
      showToast('WhatsApp settlement notification delivered!', 'success');
    }, 900);
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = {
      id: `m-u-${Date.now()}`,
      sender: 'user',
      text: inputVal,
      time: timeStr,
      status: 'delivered',
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');

    // Auto bot response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `m-bot-${Date.now()}`,
          sender: 'bot',
          text: `AutoSettle Bot: Thanks! Your inquiry for Claim #${claim?.id || 'AS-8942'} has been acknowledged. Dedicated support agent is on standby.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'read',
        }
      ]);
    }, 1200);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg max-w-sm mx-auto flex flex-col font-sans">
      {/* Phone Chrome / Top Header */}
      <div className="bg-[#075E54] text-white px-3 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-sm border-2 border-white/20">
              AS
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white"></span>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold leading-tight">AutoSettle AI Bot</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300 inline fill-emerald-300/30" />
            </div>
            <span className="text-[10px] text-emerald-100 opacity-90 block">Official Verified Business</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-white/90">
          <button
            type="button"
            onClick={handleSimulateResend}
            title="Resend Simulated Alert"
            className="p-1 hover:bg-white/10 rounded transition-colors text-white"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSending ? 'animate-spin' : ''}`} />
          </button>
          <Phone className="w-3.5 h-3.5 opacity-80" />
          <MoreVertical className="w-3.5 h-3.5 opacity-80" />
        </div>
      </div>

      {/* WhatsApp Chat Body */}
      <div
        className="p-3 bg-[#E5DDD5] min-h-[220px] max-h-[280px] overflow-y-auto flex flex-col gap-2.5"
        style={{
          backgroundImage: `radial-gradient(#CBD5E1 1px, transparent 1px)`,
          backgroundSize: '16px 16px',
        }}
      >
        {/* Encryption notice */}
        <div className="text-center my-1">
          <span className="bg-[#FFF9C4] text-[#54656F] text-[10px] px-2.5 py-1 rounded-md shadow-xs inline-block">
            🔒 Messages are end-to-end encrypted with IRDAI Claims Gateway.
          </span>
        </div>

        {/* Message items */}
        {messages.map((m) => {
          const isBot = m.sender === 'bot';
          return (
            <div
              key={m.id}
              className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}
            >
              <div
                className={`max-w-[85%] rounded-lg p-2.5 shadow-sm text-xs relative ${
                  isBot
                    ? 'bg-white text-slate-800 rounded-tl-none border-l-4 border-emerald-500'
                    : 'bg-[#DCF8C6] text-slate-900 rounded-tr-none'
                }`}
              >
                {isBot && (
                  <div className="text-[10px] font-bold text-emerald-700 mb-1 flex items-center justify-between">
                    <span>⚡ AutoSettle Instant Pay</span>
                    <span className="bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded text-[9px]">Verified</span>
                  </div>
                )}
                <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-slate-400">
                  <span>{m.time}</span>
                  <CheckCheck className="w-3 h-3 text-cyan-500 inline" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Simulated Message Input */}
      <form onSubmit={handleSendReply} className="bg-[#F0F2F5] p-2 flex items-center gap-1.5 border-t border-slate-200">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Type 'status' or reply..."
          className="flex-1 text-xs bg-white border border-slate-200 rounded-full px-3 py-1.5 focus:outline-none focus:border-emerald-500 text-slate-700"
        />
        <button
          type="submit"
          className="w-7 h-7 rounded-full bg-[#128C7E] hover:bg-[#075E54] text-white flex items-center justify-center transition-colors flex-shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Action Footer */}
      <div className="bg-emerald-50 px-3 py-1.5 border-t border-emerald-100 flex items-center justify-between text-[11px] text-emerald-800">
        <span className="flex items-center gap-1 font-medium">
          <Smartphone className="w-3 h-3 text-emerald-600" /> WhatsApp Live Simulator
        </span>
        <button
          type="button"
          onClick={handleSimulateResend}
          className="text-emerald-700 hover:text-emerald-900 underline font-semibold"
        >
          Re-trigger SMS/Alert
        </button>
      </div>
    </div>
  );
}
