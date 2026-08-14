import { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Phone, 
  Check, 
  ExternalLink, 
  ChevronRight, 
  MessageSquare, 
  Info,
  Calendar,
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'manager' | 'user';
  timestamp: Date;
}

export function NexoraSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  
  // Callback states
  const [callbackRequested, setCallbackRequested] = useState(false);
  const [phoneConfirm, setPhoneConfirm] = useState('');
  const [callbackStep, setCallbackStep] = useState<'none' | 'input' | 'sending' | 'success'>('none');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Smooth delayed entrance of the floating support button
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 1200); // graceful 1.2s delay for a premium initial load feel
    return () => clearTimeout(timer);
  }, []);

  // Set up initial greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setMessages([
          {
            id: 'init-1',
            text: 'Namaste! Welcome to Nexora Premium Support. 🙏',
            sender: 'manager',
            timestamp: new Date(),
          },
          {
            id: 'init-2',
            text: 'I am Aarav Sharma, your dedicated Nexora Account Manager. How can I help your salon business grow today?',
            sender: 'manager',
            timestamp: new Date(),
          },
        ]);
        setIsTyping(false);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isOpen, messages.length]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSendMessage = (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!messageText.trim()) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    const originalText = messageText;
    setMessageText('');

    // Simulated Account Manager replies
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      let replyText = '';
      const textLower = originalText.toLowerCase();

      if (textLower.includes('discount') || textLower.includes('offer') || textLower.includes('price')) {
        replyText = "Sure, I can unlock exclusive wholesale volume discounts for your salon! Let's connect directly on WhatsApp to finalize the custom prices.";
      } else if (textLower.includes('delivery') || textLower.includes('order') || textLower.includes('track')) {
        replyText = "I've flagged your delivery details. Our shipping partners generally dispatch within 24 hours. Let's look up your dispatch invoice number together!";
      } else if (textLower.includes('gst') || textLower.includes('invoice') || textLower.includes('bill')) {
        replyText = "All GST invoices are auto-generated and sent to your registered email. Let me trigger a duplicate copy or edit your GSTIN details via WhatsApp chat.";
      } else {
        replyText = "Understood. I am online right now! Click the direct 'Chat on WhatsApp' button below to continue this support session instantly on your phone.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `msg-reply-${Date.now()}`,
          text: replyText,
          sender: 'manager',
          timestamp: new Date(),
        },
      ]);
    }, 1500);
  };

  const startWhatsAppChat = (customText?: string) => {
    const phone = '919876543210'; // Simulated Nexora manager helpline
    const defaultText = customText 
      ? encodeURIComponent(customText) 
      : encodeURIComponent("Hello Aarav, I need assistance with my salon orders on Nexora. Please help me.");
    const url = `https://wa.me/${phone}?text=${defaultText}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleTriggerCallback = () => {
    setCallbackStep('input');
  };

  const handleSubmitCallback = (e: FormEvent) => {
    e.preventDefault();
    if (!phoneConfirm.trim() || phoneConfirm.length < 10) return;

    setCallbackStep('sending');
    setTimeout(() => {
      setCallbackStep('success');
      // Append a message inside chat too
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-callback-${Date.now()}`,
          text: `✅ Request received! I will call you back on your number ${phoneConfirm} within 15 minutes.`,
          sender: 'manager',
          timestamp: new Date(),
        },
      ]);
    }, 1200);
  };

  const quickReplies = [
    { text: '💬 Chat on WhatsApp', action: () => startWhatsAppChat() },
    { text: '📞 Request Callback', action: handleTriggerCallback },
    { text: '📦 Track My Orders', textVal: "I want to track my latest order." },
    { text: '🧾 Request GST Invoice', textVal: "I need my GST tax invoice." },
  ];

  return (
    <>
      {/* 1. Floating Support Trigger Button */}
      <AnimatePresence>
        {showButton && (
          <motion.button
            id="nexora-support-trigger"
            onClick={() => setIsOpen(!isOpen)}
            initial={{ opacity: 0, scale: 0.75, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.75, y: 30 }}
            transition={{ 
              type: 'spring', 
              stiffness: 260, 
              damping: 20, 
              delay: 0.2 
            }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            className={`fixed bottom-24 md:bottom-8 right-6 z-40 flex items-center gap-2.5 px-4.5 py-3.5 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.16)] border transition-all text-xs font-extrabold select-none ${
              isOpen 
                ? 'bg-[#1c1b1b] text-white border-[#1c1b1b]' 
                : 'bg-gradient-to-r from-[#8e004b] to-[#b30f6c] text-white border-[#8e004b]/20 hover:from-[#a00055] hover:to-[#cb1b7f]'
            }`}
          >
            {isOpen ? (
              <>
                <X size={16} className="animate-spin-once" />
                <span>Close Support</span>
              </>
            ) : (
              <>
                <div className="relative">
                  <MessageCircle size={17} className="fill-white/10" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 border border-white rounded-full animate-pulse" />
                </div>
                <span>Nexora Support</span>
                <span className="hidden md:inline-flex items-center justify-center bg-white/20 px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase">
                  Online
                </span>
              </>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* 2. Interactive Support Card / Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="nexora-support-panel"
            initial={{ opacity: 0, scale: 0.9, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 25 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed bottom-[160px] md:bottom-24 right-6 w-[360px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.15)] border border-[#E8E8E8] z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-[#8e004b] text-white p-4.5 pb-5 relative overflow-hidden">
              <div className="absolute right-[-10px] top-[-10px] w-24 h-24 bg-white/5 rounded-full pointer-events-none" />
              <div className="absolute left-[-20px] bottom-[-20px] w-20 h-20 bg-white/5 rounded-full pointer-events-none" />

              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {/* Account Manager Avatar */}
                  <div className="relative">
                    <div className="w-11 h-11 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center font-bold text-white shadow-inner">
                      AS
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#8e004b] rounded-full animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-sm text-white tracking-wide">Aarav Sharma</h4>
                      <span className="bg-emerald-500/20 text-emerald-300 text-[9px] px-1 rounded font-extrabold uppercase tracking-wide">
                        Manager
                      </span>
                    </div>
                    <p className="text-xs text-rose-100 mt-0.5 flex items-center gap-1">
                      <span>Nexora Help Desk</span>
                      <span className="inline-block w-1 h-1 rounded-full bg-rose-200" />
                      <span>Replies in 2m</span>
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Support Quick Stats Banner */}
            <div className="bg-[#FDF8F8] border-b border-[#F0EDEC] px-4 py-2 flex items-center justify-between text-[11px] text-[#594047]">
              <span className="flex items-center gap-1 font-medium">
                <Sparkles size={11} className="text-[#8e004b]" />
                Premium Wholesale Support Active
              </span>
              <span className="font-semibold text-[#8e004b]">GST Invoicing Support</span>
            </div>

            {/* Chat Messages Log Area */}
            <div className="flex-1 min-h-[220px] max-h-[300px] overflow-y-auto p-4 space-y-3 bg-stone-50/70">
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-3xs ${
                    msg.sender === 'user'
                      ? 'bg-[#8e004b] text-white rounded-br-none'
                      : 'bg-white border border-[#E8E8E8] text-[#1c1b1b] rounded-bl-none'
                  }`}>
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <span className={`block text-[9px] mt-1 text-right ${
                      msg.sender === 'user' ? 'text-white/60' : 'text-stone-400'
                    }`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-[#E8E8E8] rounded-2xl rounded-bl-none px-4 py-3 shadow-3xs">
                    <div className="flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 bg-[#8e004b] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-[#8e004b] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-[#8e004b] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Interactive Callback Form overlay */}
            {callbackStep !== 'none' && (
              <div className="bg-[#FDF8F8] border-t border-[#F0EDEC] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#8e004b] flex items-center gap-1.5">
                    <Phone size={12} /> Call Back Request
                  </span>
                  <button 
                    onClick={() => setCallbackStep('none')}
                    className="text-stone-400 hover:text-stone-600 text-xs"
                  >
                    Cancel
                  </button>
                </div>

                {callbackStep === 'input' && (
                  <form onSubmit={handleSubmitCallback} className="space-y-2">
                    <p className="text-[11px] text-[#594047]">
                      Aarav will call you directly to resolve any bulk order or payment questions.
                    </p>
                    <div className="flex gap-2">
                      <input 
                        type="tel"
                        required
                        placeholder="Enter mobile number"
                        value={phoneConfirm}
                        onChange={(e) => setPhoneConfirm(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className="flex-1 bg-white border border-[#E8E8E8] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#8e004b]"
                      />
                      <button 
                        type="submit"
                        disabled={phoneConfirm.length < 10}
                        className="bg-[#8e004b] text-white px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-[#a00055] transition-colors disabled:opacity-50"
                      >
                        Request
                      </button>
                    </div>
                  </form>
                )}

                {callbackStep === 'sending' && (
                  <div className="flex items-center justify-center py-4 gap-2 text-xs font-semibold text-[#594047]">
                    <div className="w-4 h-4 border-2 border-[#8e004b] border-t-transparent rounded-full animate-spin" />
                    Connecting with account manager...
                  </div>
                )}

                {callbackStep === 'success' && (
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                    <Check size={16} />
                    <span>Callback Scheduled! Aarav will call shortly.</span>
                  </div>
                )}
              </div>
            )}

            {/* Quick Action Suggestion Chips */}
            {callbackStep === 'none' && (
              <div className="px-3 py-2 border-t border-[#F0EDEC] bg-white flex items-center gap-1.5 overflow-x-auto hide-scrollbar">
                {quickReplies.map((reply, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (reply.action) {
                        reply.action();
                      } else if (reply.textVal) {
                        setMessageText(reply.textVal);
                      }
                    }}
                    className="whitespace-nowrap px-3 py-1.5 bg-[#FDF8F8] hover:bg-[#FDE7F3] text-[#8e004b] border border-[#8e004b]/10 hover:border-[#8e004b]/20 rounded-full text-[10px] font-bold transition-all"
                  >
                    {reply.text}
                  </button>
                ))}
              </div>
            )}

            {/* WhatsApp Callout Action & Message Form */}
            <div className="p-3 bg-stone-50 border-t border-[#E8E8E8] space-y-2">
              {/* Primary Direct WhatsApp Action Button */}
              <button
                onClick={() => startWhatsAppChat()}
                className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 shadow-sm hover:shadow transition-all"
              >
                <MessageSquare size={14} className="fill-white" />
                <span>Chat Instantly on WhatsApp</span>
                <ExternalLink size={11} className="opacity-80" />
              </button>

              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Ask Aarav a question..."
                  className="flex-1 bg-white border border-[#E8E8E8] rounded-xl px-3.5 py-2 text-xs text-[#1c1b1b] focus:outline-none focus:ring-2 focus:ring-[#8e004b]/20 focus:border-[#8e004b] placeholder-stone-400 transition-all"
                />
                <button
                  type="submit"
                  disabled={!messageText.trim()}
                  className="bg-[#1c1b1b] text-white p-2 rounded-xl hover:bg-[#2c2b2b] transition-all disabled:opacity-40"
                >
                  <Send size={14} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
