import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Send, Phone, Video, Info, Paperclip, MessageSquare, Search, UserPlus, X, Loader2 } from 'lucide-react';
import api from '../../services/api';
import { io, Socket } from 'socket.io-client';

export const Chat = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  const [chats, setChats] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageText, setMessageText] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // New states for contact search
  const [searchTerm, setSearchTerm] = useState('');
  const [contacts, setContacts] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);

  // Helper to get the other participant in a chat
  const getOtherParticipant = (chat: any) => {
    return chat?.participants?.find((p: any) => p._id !== user?._id) || {};
  };

  useEffect(() => {
    if (!user) return;
    
    // Connect Socket
    const socketUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');
    const newSocket = io(socketUrl, { query: { userId: user._id } });
    setSocket(newSocket);

    // Fetch initial chat list
    fetchChats();

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  const fetchChats = async () => {
    try {
      const res = await api.get('/chat');
      setChats(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch chats:", err);
    }
  };

  // Handle incoming chat from navigation state (Admin)
  useEffect(() => {
    if (location.state?.initialChat) {
      const chat = location.state.initialChat;
      setChats(prev => {
        if (!prev.find(c => c._id === chat._id)) return [chat, ...prev];
        return prev;
      });
      setActiveChat(chat);
    }
  }, [location.state]);

  // Handle active chat selection and message loading
  useEffect(() => {
    if (!activeChat || !socket) return;

    const fetchMessages = async () => {
      try {
        const res = await api.get(`/chat/${activeChat._id}/messages`);
        setMessages(res.data.data?.messages?.reverse() || []);
        socket.emit('join_chat', activeChat._id);
        socket.emit('mark_read', activeChat._id);
        
        // Clear unread in local state
        setChats(prev => prev.map(c => c._id === activeChat._id ? { ...c, unreadCount: { ...c.unreadCount, [user!._id]: 0 } } : c));
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };
    fetchMessages();

    // Listen to new messages
    const handleNewMessage = (data: any) => {
      if (data.chatId === activeChat._id) {
        setMessages(prev => [...prev, data.message]);
        socket.emit('mark_read', activeChat._id);
      }
      
      // Update chat list lastMessage
      setChats(prev => prev.map(c => {
        if (c._id === data.chatId) {
          return { ...c, lastMessage: data.message };
        }
        return c;
      }));
    };

    socket.on('new_message', handleNewMessage);

    return () => {
      socket.off('new_message', handleNewMessage);
    };
  }, [activeChat, socket, user]);

  // Contact search logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim()) {
        searchContacts();
      } else {
        setContacts([]);
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const searchContacts = async () => {
    setIsLoadingContacts(true);
    setIsSearching(true);
    try {
      const res = await api.get(`/users?search=${searchTerm}`);
      setContacts(res.data.data || []);
    } catch (err) {
      console.error("Failed to search contacts:", err);
    } finally {
      setIsLoadingContacts(false);
    }
  };

  const handleStartChat = async (recipientId: string) => {
    try {
      const res = await api.post('/chat/start', { recipientId });
      const newChat = res.data.data;
      
      // Add to chats if not already there
      if (!chats.find(c => c._id === newChat._id)) {
        setChats(prev => [newChat, ...prev]);
      }
      
      setActiveChat(newChat);
      setSearchTerm('');
      setIsSearching(false);
    } catch (err) {
      console.error("Failed to start chat:", err);
    }
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!messageText.trim() || !activeChat || !socket) return;

    socket.emit('send_message', {
      chatId: activeChat._id,
      text: messageText,
      type: 'text'
    });
    
    setMessageText('');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row h-[calc(100vh-180px)] overflow-hidden">
      
      {/* Sidebar: Chats & Contacts List */}
      <div className="w-full md:w-80 border-r border-slate-100 flex flex-col h-full shrink-0">
        <div className="p-4 border-b border-slate-100">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-extrabold text-slate-800">Messages</h2>
            <button 
              onClick={() => setIsSearching(!isSearching)}
              className={`p-2 rounded-lg transition-colors ${isSearching ? 'bg-primary text-white' : 'bg-slate-50 text-slate-500 hover:text-primary'}`}
            >
              {isSearching ? <X className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isSearching ? "Rechercher un contact..." : "Rechercher une discussion..."}
              className="w-full bg-slate-50 border-none outline-none pl-10 pr-4 py-2.5 rounded-xl text-sm text-slate-700 font-medium" 
            />
          </div>
        </div>

        <div className="overflow-y-auto flex-1 p-3 space-y-1">
          {isSearching ? (
            /* Search Results / Contacts */
            <>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">Résultats de recherche</p>
              {isLoadingContacts ? (
                <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary opacity-20" /></div>
              ) : contacts.length === 0 ? (
                <div className="text-center text-slate-400 py-10 font-medium text-sm italic">
                  Aucun utilisateur trouvé.
                </div>
              ) : (
                contacts.map(contact => (
                  <button 
                    key={contact._id}
                    onClick={() => handleStartChat(contact._id)}
                    className="w-full text-left p-3 rounded-xl flex items-center gap-3 hover:bg-slate-50 transition-colors group"
                  >
                    <div className="h-10 w-10 bg-primary-light text-primary rounded-full flex items-center justify-center font-bold text-sm border-2 border-white shadow-sm overflow-hidden">
                      {contact.avatar ? <img src={contact.avatar} className="object-cover w-full h-full" alt="avatar"/> : contact.firstName.charAt(0)}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <h3 className="font-bold text-sm text-slate-800 group-hover:text-primary transition-colors">{contact.firstName} {contact.lastName}</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{contact.role} {contact.specialty ? `• ${contact.specialty}` : ''}</p>
                    </div>
                  </button>
                ))
              )}
            </>
          ) : (
            /* Active Chats */
            <>
              {chats.length === 0 ? (
                <div className="text-center text-slate-400 py-10 font-medium text-sm">
                  <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-20" />
                  Aucune conversation.<br/>Cherchez un contact pour commencer.
                </div>
              ) : (
                chats.map(chat => {
                  const otherUser = getOtherParticipant(chat);
                  const name = `${otherUser.firstName || ''} ${otherUser.lastName || ''}`.trim() || 'Utilisateur';
                  const unread = chat.unreadCount?.[user!._id] || 0;
                  
                  return (
                    <button 
                      key={chat._id}
                      onClick={() => setActiveChat(chat)}
                      className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-colors ${activeChat?._id === chat._id ? 'bg-primary-light/40 border-l-4 border-l-primary' : 'hover:bg-slate-50'}`}
                    >
                      <div className="relative shrink-0">
                        <div className="h-12 w-12 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold text-lg border-2 border-white shadow-sm overflow-hidden">
                          {otherUser.avatar ? <img src={otherUser.avatar} className="object-cover w-full h-full" alt="avatar"/> : name.charAt(0)}
                        </div>
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex justify-between items-center mb-0.5">
                          <h3 className={`font-bold text-sm truncate ${activeChat?._id === chat._id ? 'text-primary' : 'text-slate-800'}`}>{name}</h3>
                          {unread > 0 && <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unread}</span>}
                        </div>
                        <p className="text-xs text-slate-500 truncate font-medium">{chat.lastMessage?.text || 'Nouvelle conversation'}</p>
                      </div>
                    </button>
                  );
                })
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Main Area: Active Chat */}
      <div className="flex-1 flex flex-col h-full bg-slate-50/50 relative">
        {!activeChat ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-10 text-center">
             <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-6">
                <MessageSquare className="h-16 w-16 opacity-10" />
             </div>
             <h2 className="text-xl font-bold text-slate-700 mb-2">Vos Messages</h2>
             <p className="max-w-xs text-sm font-medium">Sélectionnez une conversation ou recherchez un professionnel pour démarrer un échange sécurisé.</p>
          </div>
        ) : (
          <>
            <div className="h-16 px-6 border-b border-slate-100 bg-white flex items-center justify-between shrink-0 shadow-sm z-10">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500 text-sm overflow-hidden">
                   {getOtherParticipant(activeChat).avatar ? <img src={getOtherParticipant(activeChat).avatar} /> : getOtherParticipant(activeChat).firstName?.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">
                    {getOtherParticipant(activeChat).firstName} {getOtherParticipant(activeChat).lastName}
                  </h3>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-wider">{getOtherParticipant(activeChat).role || 'Patient'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-slate-400">
                <button className="p-2 hover:bg-slate-50 rounded-lg hover:text-primary transition-all"><Phone className="h-5 w-5" /></button>
                <button className="p-2 hover:bg-slate-50 rounded-lg hover:text-primary transition-all"><Video className="h-5 w-5" /></button>
                <button className="p-2 hover:bg-slate-50 rounded-lg hover:text-primary transition-all"><Info className="h-5 w-5" /></button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col scrollbar-thin scrollbar-thumb-slate-200">
              {messages.map((msg, idx) => {
                const isMe = msg.sender?._id === user?._id || msg.sender === user?._id;
                
                return (
                  <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`${isMe ? 'bg-primary text-white rounded-tr-sm shadow-primary/20' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm'} rounded-2xl p-4 max-w-[75%] shadow-md`}>
                      <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                      <span className={`text-[10px] font-bold mt-2 block ${isMe ? 'text-primary-light text-right' : 'text-slate-400'}`}>
                        {new Date(msg.timestamp || new Date()).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="p-4 bg-white border-t border-slate-100 shrink-0">
              <form onSubmit={handleSendMessage} className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-2 px-3 focus-within:ring-4 focus-within:ring-primary/10 focus-within:border-primary transition-all">
                <button type="button" className="p-2 text-slate-400 hover:text-primary transition-colors">
                  <Paperclip className="h-5 w-5" />
                </button>
                <input 
                  type="text" 
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Tapez un message..." 
                  className="flex-1 bg-transparent border-none outline-none text-slate-700 text-sm py-2 font-medium placeholder:text-slate-400"
                />
                <button type="submit" disabled={!messageText.trim()} className="p-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 flex items-center justify-center disabled:opacity-50 disabled:shadow-none">
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

