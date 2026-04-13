import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Bot, User, MapPin, Phone, ShoppingBag, Eye, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../services/api';

interface Message {
  role: 'user' | 'bot';
  content: string;
  type?: string;
  results?: any[];
  suggestions?: string[];
}

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: 'Bonjour ! Je suis l\'assistant intelligent de MED-CONNECT. Je peux chercher pour vous des médicaments, des médecins ou des hôpitaux dans notre base de données. Que recherchez-vous ?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (customMessage?: string) => {
    const userMsg = customMessage || input.trim();
    if (!userMsg || isLoading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const res = await api.post('/chatbot/query', { message: userMsg });
      const data = res.data.data;
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: data.text || "J'ai traité votre demande.",
        type: data.type,
        results: data.results,
        suggestions: data.suggestions
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', content: "Désolé, j'ai rencontré une erreur technique. Veuillez réessayer plus tard." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderResults = (type: string, results: any[]) => {
    if (!results || results.length === 0) return null;

    if (type === 'products') {
      return (
        <div className="mt-3 space-y-2">
          {results.map((p, i) => (
            <div key={i} className="bg-blue-50/50 border border-blue-100 p-3 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-xl shadow-sm"><ShoppingBag className="h-4 w-4 text-primary" /></div>
                <div>
                   <p className="text-sm font-black text-slate-800 leading-none mb-1">{p.name}</p>
                   <p className="text-[10px] font-bold text-slate-400 uppercase">{p.shop?.name || 'Pharmacie'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-black text-primary">{p.price} FCFA</p>
                <Link to={`/provider/${p.shop?._id}`} className="text-[10px] font-black underline text-slate-400 hover:text-primary">Voir</Link>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (type === 'doctors') {
      return (
        <div className="mt-3 space-y-2">
          {results.map((d, i) => (
            <div key={i} className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-white rounded-full overflow-hidden border-2 border-emerald-100">
                   {d.avatar ? <img src={d.avatar} className="w-full h-full object-cover" alt="Dr"/> : <User className="h-full w-full p-2 text-emerald-400" />}
                </div>
                <div>
                   <p className="text-sm font-black text-slate-800 leading-none mb-1">Dr. {d.firstName} {d.lastName}</p>
                   <p className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">{d.specialty}</p>
                </div>
              </div>
              <button className="h-8 w-8 bg-emerald-600 text-white rounded-xl shadow-sm flex items-center justify-center hover:scale-105 active:scale-95 transition-all">
                 <Phone className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      );
    }

    if (type === 'hospitals') {
      return (
        <div className="mt-3 space-y-2">
          {results.map((h, i) => (
            <div key={i} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl shadow-sm">
               <h4 className="text-sm font-black text-slate-800 mb-1">{h.name}</h4>
               <p className="text-[10px] text-slate-500 font-bold flex items-center gap-1 mb-3 truncate">
                 <MapPin className="h-3 w-3" /> {h.address}, {h.city}
               </p>
               <div className="flex items-center gap-2">
                 <Link to={`/provider/${h._id}`} className="flex-1 py-2 bg-primary text-white rounded-xl text-[10px] font-black text-center uppercase tracking-widest shadow-lg shadow-primary/20">Dossier</Link>
                 <a href={`tel:${h.phone}`} className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-primary transition-colors"><Phone className="h-4 w-4" /></a>
               </div>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[340px] sm:w-[400px] h-[550px] bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-white/10 p-3 rounded-2xl shadow-inner rotate-3">
                  <Bot className="h-6 w-6 text-primary-light" />
                </div>
                <div>
                  <h3 className="font-black text-lg tracking-tight leading-none">MedBot</h3>
                  <p className="text-[10px] font-bold text-primary-light/60 uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
                     <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Intelligent
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="bg-white/5 hover:bg-white/10 p-3 rounded-2xl transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50"
            >
              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`h-9 w-9 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                      msg.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-400 rounded-tl-none'
                    }`}>
                      {msg.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                    </div>
                    <div className="space-y-2">
                       <div className={`p-4 rounded-[1.5rem] text-sm font-medium leading-relaxed ${
                         msg.role === 'user' 
                           ? 'bg-primary text-white rounded-tr-none shadow-xl shadow-primary/20' 
                           : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none shadow-sm'
                       }`}>
                         {msg.content}
                         {msg.results && renderResults(msg.type || 'text', msg.results)}
                       </div>
                       
                       {msg.suggestions && (
                         <div className="flex flex-wrap gap-2 pt-1 animate-in slide-in-from-left-4 duration-500">
                            {msg.suggestions.map((s, idx) => (
                              <button 
                                key={idx}
                                onClick={() => handleSend(s)}
                                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-400 hover:text-primary hover:border-primary transition-all shadow-sm"
                              >
                                {s}
                              </button>
                            ))}
                         </div>
                       )}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[90%]">
                    <div className="h-9 w-9 rounded-2xl bg-white border border-slate-200 text-slate-300 flex items-center justify-center animate-pulse">
                      <Bot className="h-5 w-5" />
                    </div>
                    <div className="bg-white border border-slate-100 p-4 rounded-[1.5rem] rounded-tl-none shadow-sm flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="h-1.5 w-1.5 bg-primary/40 rounded-full animate-bounce delay-75"></span>
                        <span className="h-1.5 w-1.5 bg-primary/40 rounded-full animate-bounce delay-150"></span>
                        <span className="h-1.5 w-1.5 bg-primary/40 rounded-full animate-bounce delay-300"></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-6 border-t border-slate-100 bg-white shadow-up">
              <div className="flex gap-3 bg-slate-50 p-2 rounded-3xl border border-slate-100 focus-within:ring-4 focus-within:ring-primary/5 transition-all group">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Posez votre question santé..."
                  className="flex-1 bg-transparent border-none px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none placeholder:text-slate-300"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  className="bg-primary text-white p-3 rounded-[1.2rem] hover:scale-105 active:scale-95 transition-all disabled:opacity-30 shadow-lg shadow-primary/20"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`h-16 w-16 rounded-[2rem] shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 relative group ${
          isOpen ? 'bg-slate-900 text-white rotate-90' : 'bg-primary text-white'
        }`}
      >
        {!isOpen && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-[10px] font-black text-white flex items-center justify-center rounded-full border-2 border-white shadow-md animate-bounce group-hover:animate-none">
            !
          </span>
        )}
        {isOpen ? <X className="h-7 w-7" /> : <MessageSquare className="h-7 w-7" />}
      </button>
    </div>
  );
};
