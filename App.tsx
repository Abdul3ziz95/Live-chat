
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Phone, 
  Send, 
  History, 
  Share2, 
  Smartphone, 
  Sparkles, 
  Trash2, 
  ChevronDown, 
  Search,
  MessageSquareText,
  Copy,
  Check
} from 'lucide-react';
import { COUNTRIES, DEFAULT_COUNTRY } from './constants';
import { Country, ChatHistoryItem, MessageTone } from './types';
import { generateSmartMessage } from './services/geminiService';

const App: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<ChatHistoryItem[]>([]);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'history'>('chat');
  const [copied, setCopied] = useState(false);

  // Persistence: Load history
  useEffect(() => {
    const savedHistory = localStorage.getItem('chat_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Persistence: Save history
  useEffect(() => {
    localStorage.setItem('chat_history', JSON.stringify(history));
  }, [history]);

  const filteredCountries = useMemo(() => {
    return COUNTRIES.filter(c => 
      c.name.includes(searchQuery) || 
      c.code.includes(searchQuery) || 
      c.iso.includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleOpenWhatsApp = useCallback(() => {
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    if (cleanNumber.length < 5) {
      alert('يرجى إدخال رقم هاتف صحيح');
      return;
    }

    const fullNumber = `${selectedCountry.code}${cleanNumber}`;
    const waUrl = `https://wa.me/${fullNumber}?text=${encodeURIComponent(message)}`;
    
    // Add to history
    const newItem: ChatHistoryItem = {
      id: Date.now().toString(),
      phoneNumber: cleanNumber,
      fullNumber,
      timestamp: Date.now(),
      countryIso: selectedCountry.iso
    };

    setHistory(prev => {
      const filtered = prev.filter(item => item.fullNumber !== fullNumber);
      return [newItem, ...filtered].slice(0, 20); // Keep last 20
    });

    window.open(waUrl, '_blank');
  }, [phoneNumber, selectedCountry, message]);

  const handleGenerateAiMessage = async (tone: MessageTone) => {
    if (!aiPrompt.trim()) {
      alert('يرجى إدخال موضوع الرسالة أولاً');
      return;
    }
    setIsLoadingAi(true);
    const generated = await generateSmartMessage(aiPrompt, tone);
    setMessage(generated);
    setIsLoadingAi(false);
  };

  const removeFromHistory = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const reuseHistoryItem = (item: ChatHistoryItem) => {
    const country = COUNTRIES.find(c => c.iso === item.countryIso) || DEFAULT_COUNTRY;
    setSelectedCountry(country);
    setPhoneNumber(item.phoneNumber);
    setActiveTab('chat');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-white shadow-2xl relative">
      {/* Header */}
      <header className="whatsapp-gradient pt-10 pb-6 px-6 text-white rounded-b-[2rem] shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-extrabold flex items-center gap-2">
            <Smartphone className="w-8 h-8" />
            دردشة مباشرة <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-normal">PRO</span>
          </h1>
          <button 
            onClick={handleCopyLink}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            {copied ? <Check className="w-5 h-5 text-green-300" /> : <Share2 className="w-5 h-5" />}
          </button>
        </div>
        <p className="text-sm opacity-90 leading-relaxed font-light">
          تواصل فورياً على واتساب دون الحاجة لحفظ الرقم في جهات الاتصال الخاصة بك.
        </p>
      </header>

      {/* Navigation Tabs */}
      <div className="flex px-6 mt-6 gap-2">
        <button 
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-3 rounded-2xl flex items-center justify-center gap-2 transition-all ${activeTab === 'chat' ? 'bg-green-50 text-green-700 shadow-sm border border-green-100 font-bold' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Send className="w-4 h-4" />
          دردشة جديدة
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-3 rounded-2xl flex items-center justify-center gap-2 transition-all ${activeTab === 'history' ? 'bg-green-50 text-green-700 shadow-sm border border-green-100 font-bold' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <History className="w-4 h-4" />
          السجل
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-6 py-4">
        {activeTab === 'chat' ? (
          <div className="space-y-6">
            {/* Phone Input Card */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
              <label className="block text-sm font-semibold text-slate-600 mb-1">بيانات التواصل</label>
              
              <div className="flex gap-2">
                {/* Country Selector */}
                <div className="relative">
                  <button 
                    onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                    className="flex items-center gap-1.5 h-14 px-3 bg-slate-50 border border-slate-200 rounded-2xl hover:border-green-300 transition-all text-lg"
                  >
                    <span className="text-xl">{selectedCountry.flag}</span>
                    <span className="font-bold text-slate-700">+{selectedCountry.code}</span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>

                  {isCountryDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-72 bg-white shadow-2xl rounded-2xl border border-slate-100 z-50 overflow-hidden">
                      <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                        <Search className="w-4 h-4 text-slate-400" />
                        <input 
                          type="text" 
                          placeholder="ابحث عن دولة..."
                          className="bg-transparent border-none outline-none w-full text-sm py-1"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {filteredCountries.map(c => (
                          <button
                            key={c.iso}
                            onClick={() => {
                              setSelectedCountry(c);
                              setIsCountryDropdownOpen(false);
                            }}
                            className="w-full text-right px-4 py-3 hover:bg-slate-50 flex items-center gap-3 transition-colors border-b border-slate-50 last:border-0"
                          >
                            <span className="text-xl">{c.flag}</span>
                            <span className="flex-1 font-medium">{c.name}</span>
                            <span className="text-slate-400 text-sm">+{c.code}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Local Number Input */}
                <div className="flex-1 relative">
                  <input 
                    type="tel"
                    placeholder="رقم الهاتف المحلي"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-green-400 focus:ring-4 focus:ring-green-500/10 outline-none text-xl tracking-wider transition-all"
                  />
                </div>
              </div>
            </div>

            {/* AI Assistant Section */}
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-3xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-green-700">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-bold">مساعد الكتابة الذكي (AI)</h3>
              </div>
              
              <div className="space-y-3">
                <textarea 
                  placeholder="عن ماذا تريد أن تكون الرسالة؟ (مثال: طلب عرض سعر، تحية صباحية...)"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="w-full p-4 rounded-2xl border border-slate-200 focus:border-green-400 outline-none h-24 text-sm resize-none"
                />
                
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    disabled={isLoadingAi}
                    onClick={() => handleGenerateAiMessage('professional')}
                    className="py-2.5 px-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-all disabled:opacity-50"
                  >
                    رسمي
                  </button>
                  <button 
                    disabled={isLoadingAi}
                    onClick={() => handleGenerateAiMessage('friendly')}
                    className="py-2.5 px-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-all disabled:opacity-50"
                  >
                    ودي
                  </button>
                  <button 
                    disabled={isLoadingAi}
                    onClick={() => handleGenerateAiMessage('funny')}
                    className="py-2.5 px-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-all disabled:opacity-50"
                  >
                    فكاهي
                  </button>
                  <button 
                    disabled={isLoadingAi}
                    onClick={() => handleGenerateAiMessage('short')}
                    className="py-2.5 px-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-all disabled:opacity-50"
                  >
                    مختصر
                  </button>
                </div>
              </div>
            </div>

            {/* Message Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-semibold text-slate-600">نص الرسالة (اختياري)</label>
                {isLoadingAi && <span className="text-[10px] text-green-600 animate-pulse font-bold">جاري التوليد بواسطة Gemini...</span>}
              </div>
              <textarea 
                placeholder="اكتب رسالتك هنا..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-4 rounded-3xl border border-slate-200 focus:border-green-400 outline-none h-32 text-slate-700 shadow-sm transition-all"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4 pb-20">
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-300">
                <History className="w-16 h-16 mb-4 opacity-20" />
                <p>لا يوجد سجل محادثات بعد</p>
              </div>
            ) : (
              history.map(item => {
                const country = COUNTRIES.find(c => c.iso === item.countryIso);
                return (
                  <div key={item.id} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-2xl">
                      {country?.flag || '🏳️'}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-slate-800">+{item.fullNumber}</div>
                      <div className="text-[10px] text-slate-400">{new Date(item.timestamp).toLocaleString('ar-EG')}</div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => reuseHistoryItem(item)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-colors"
                        title="إعادة مراسلة"
                      >
                        <MessageSquareText className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => removeFromHistory(item.id)}
                        className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors"
                        title="حذف من السجل"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      {activeTab === 'chat' && (
        <div className="p-6 sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent">
          <button 
            onClick={handleOpenWhatsApp}
            className="w-full py-5 rounded-[2rem] whatsapp-gradient text-white font-extrabold text-xl shadow-2xl shadow-green-500/40 flex items-center justify-center gap-3 active:scale-95 transition-transform"
          >
            بدء المحادثة الآن
            <Send className="w-6 h-6 rotate-[15deg]" />
          </button>
        </div>
      )}

      {/* Footer Branding */}
      <footer className="py-6 text-center border-t border-slate-50">
        <p className="text-slate-400 text-xs font-medium">جميع الحقوق محفوظة © 2025</p>
        <a 
          href="https://linktr.ee/abdul3ziz95" 
          target="_blank" 
          className="text-green-600 text-sm font-bold mt-1 hover:underline inline-block"
        >
          Abdul3ziz95
        </a>
      </footer>

      {/* Overlay for dropdown to close when clicked outside */}
      {isCountryDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsCountryDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
