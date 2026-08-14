import React, { useState } from 'react';

interface QuickSupportCardProps {
  userPhone?: string;
  salonName?: string;
}

export function QuickSupportCard({ userPhone, salonName }: QuickSupportCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const manager = {
    name: 'Vikram Sharma',
    role: 'Dedicated Senior Account Executive',
    phone: '+91 98765 43210',
    rawPhone: '919876543210',
    email: 'vikram.sharma@nexorasalon.com',
    hours: 'Mon - Sat: 9:00 AM - 8:00 PM',
    rating: '4.9 ★ (180+ Salon Reviews)',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200',
  };

  const getWhatsAppUrl = (customMsg?: string) => {
    const defaultText = `Hi Vikram, I am reaching out from ${salonName || 'my salon'} regarding an urgent issue with my order.`;
    const text = customMsg || defaultText;
    return `https://wa.me/${manager.rawPhone}?text=${encodeURIComponent(text)}`;
  };

  const quickTopics = [
    {
      title: 'Urgent Order Delay',
      icon: 'local_shipping',
      message: `Hi Vikram, my salon order is delayed and I need an urgent tracking update for ${salonName || 'my salon'}.`,
    },
    {
      title: 'Missing or Damaged Item',
      icon: 'inventory_2',
      message: `Hi Vikram, I received my consignment but there is a missing/damaged product in my order for ${salonName || 'my salon'}.`,
    },
    {
      title: 'GST Invoice Issue',
      icon: 'receipt_long',
      message: `Hi Vikram, I need assistance updating or correcting GST invoice tax details for ${salonName || 'my salon'}.`,
    },
    {
      title: 'Custom Bulk Order Quote',
      icon: 'request_quote',
      message: `Hi Vikram, I want a custom price quote for a large salon restock for ${salonName || 'my salon'}.`,
    },
  ];

  const handleCopyPhone = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(manager.phone).catch(() => {});
    }
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  return (
    <>
      {/* Embedded Executive Support Card in Profile */}
      <div
        id="quick-support-card"
        className="bg-gradient-to-r from-[#1c1b1b] via-[#2A1820] to-[#8e004b] rounded-2xl p-6 text-white shadow-md relative overflow-hidden border border-white/10 my-6"
      >
        {/* Background Subtle Accent Pattern */}
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-12 top-0 w-32 h-32 bg-[#8e004b]/30 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Manager Info & Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={manager.avatar}
                alt={manager.name}
                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover border-2 border-emerald-400 p-0.5 shadow-md"
              />
              <span
                className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#1c1b1b] rounded-full"
                title="Online Now"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>DEDICATED MANAGER</span>
                </span>
                <span className="text-[10px] text-amber-300 font-semibold">{manager.rating}</span>
              </div>

              <h3 className="text-lg md:text-xl font-bold text-white">{manager.name}</h3>
              <p className="text-xs text-stone-300">{manager.role}</p>
              <p className="text-[11px] text-emerald-400/90 flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-xs">schedule</span>
                <span>Avg. WhatsApp Response &lt; 5 mins • {manager.hours}</span>
              </p>
            </div>
          </div>

          {/* Direct Actions */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            <a
              id="whatsapp-chat-main-btn"
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 lg:flex-none bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs py-3 px-5 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 border border-emerald-400/30"
            >
              <span className="material-symbols-outlined text-lg">chat</span>
              <span>WhatsApp Chat Support</span>
            </a>

            <button
              id="quick-topics-toggle-btn"
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 border border-white/20"
            >
              <span className="material-symbols-outlined text-base">support_agent</span>
              <span>{isOpen ? 'Hide Quick Topics' : 'Quick Order Topics'}</span>
              <span className="material-symbols-outlined text-sm">
                {isOpen ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            <button
              id="copy-manager-phone-btn"
              type="button"
              onClick={handleCopyPhone}
              className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl transition-all border border-white/20 flex items-center justify-center"
              title="Copy Phone Number"
            >
              <span className="material-symbols-outlined text-base">
                {copiedPhone ? 'check' : 'call'}
              </span>
            </button>
          </div>
        </div>

        {/* Quick Topics Accordion Grid */}
        {isOpen && (
          <div className="mt-5 pt-5 border-t border-white/10 animate-fade-in space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-300 block">
              Select an urgent issue to launch WhatsApp with pre-filled details:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {quickTopics.map((topic) => (
                <a
                  key={topic.title}
                  href={getWhatsAppUrl(topic.message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-400/50 rounded-xl p-3 text-left transition-all flex items-start gap-3 group"
                >
                  <div className="p-2 rounded-lg bg-white/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-lg">{topic.icon}</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {topic.title}
                    </h4>
                    <p className="text-[11px] text-stone-300 mt-0.5 line-clamp-1">
                      Direct notification to Vikram Sharma
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button (FAB) Widget at Bottom Right */}
      <div id="quick-support-fab-container" className="fixed bottom-20 right-5 md:bottom-6 md:right-8 z-40">
        <div className="relative group">
          {/* Pulse Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-[#8e004b] rounded-full blur-xs opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse" />

          {/* Floating WhatsApp FAB Button */}
          <a
            id="quick-support-fab"
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="relative bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-full shadow-2xl flex items-center gap-2 transition-all active:scale-95 border-2 border-white/20"
            title="Chat directly on WhatsApp with your Account Manager"
          >
            <div className="relative flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">chat</span>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-300 rounded-full border-2 border-emerald-600" />
            </div>

            <span className="text-xs font-bold tracking-wide hidden sm:inline">
              WhatsApp Support
            </span>

            <span className="bg-emerald-700/80 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full text-emerald-100 hidden md:inline">
              &lt; 5m
            </span>
          </a>
        </div>
      </div>
    </>
  );
}
