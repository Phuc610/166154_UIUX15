import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  MagnifyingGlass, PhoneCall, VideoCamera, PaperPlaneRight, 
  PhoneDisconnect, Microphone, VideoCameraSlash, User, FileText, Clock, Paperclip, Pill
} from '@phosphor-icons/react';

const TAG_STYLES: Record<string, string> = {
  'Lâm sàng': 'bg-sky-100 text-sky-700',
  'Dị ứng': 'bg-emerald-100 text-emerald-700',
  'Cảnh báo': 'bg-rose-100 text-rose-700'
};

const MOCK_NOTES_DB: Record<string, any[]> = {
  'c1': [{ id: 'n1', tag: 'Cảnh báo', tagClass: 'bg-rose-100 text-rose-700', date: 'Hôm qua', text: 'Bệnh nhân có tiền sử bệnh mạch vành, lưu ý khi kê thuốc.' }],
};

const INITIAL_CONTACTS = [
  { id: 'c1', name: 'Phạm Văn Đức', avatarBg: 'bg-emerald-100', lastMessage: 'Bác sĩ ơi, tôi hơi mệt...', time: '10:30', status: 'online', unread: 2 },
  { id: 'c2', name: 'Nguyễn Thị Hoa', avatarBg: 'bg-rose-100', lastMessage: 'Cảm ơn bác sĩ nhiều ạ.', time: 'Hôm qua', status: 'offline', unread: 1 },
  { id: 'c3', name: 'Trần Minh Tuấn', avatarBg: 'bg-blue-100', lastMessage: 'Mai tôi ghé phòng khám.', time: 'Hôm qua', status: 'offline', unread: 0 },
  { id: 'c4', name: 'Hoàng Thị Mai', avatarBg: 'bg-amber-200', lastMessage: 'Chào bác sĩ, lát nữa mình gọi ạ.', time: '09:50', status: 'online', unread: 1 },
];

const MOCK_MESSAGES_DB: Record<string, { id: string, text: string, sender: string, time: string, attachment?: string }[]> = {
  'c1': [
    { id: 'm1', text: 'Chào chú Đức, chú thấy mệt thế nào ạ?', sender: 'doctor', time: '10:32' },
    { id: 'm2', text: 'Tôi hơi tức ngực bên trái từ sáng.', sender: 'patient', time: '10:33' },
    { id: 'm3', text: 'Bác sĩ ơi, tôi hơi mệt...', sender: 'patient', time: '10:35' },
  ],
  'c2': [
    { id: 'm4', text: 'Nhớ uống thuốc đúng giờ nhé chị.', sender: 'doctor', time: 'Hôm qua' },
    { id: 'm5', text: 'Cảm ơn bác sĩ nhiều ạ.', sender: 'patient', time: 'Hôm qua' },
  ],
  'c3': [
    { id: 'm6', text: 'Mai tôi ghé phòng khám.', sender: 'patient', time: 'Hôm qua' },
  ],
  'c4': [
    { id: 'm7', text: 'Chào bác sĩ, lát nữa mình gọi ạ.', sender: 'patient', time: '09:50' },
  ]
};

const Messages = () => {
  const [contacts, setContacts] = useState(INITIAL_CONTACTS);
  const [activeContactId, setActiveContactId] = useState(INITIAL_CONTACTS[0].id);
  const [messagesDb, setMessagesDb] = useState(MOCK_MESSAGES_DB);
  const [inputText, setInputText] = useState('');
  
  const activeContact = contacts.find(c => c.id === activeContactId)!;
  const activeMessages = messagesDb[activeContactId] || [];

  const [notesMap, setNotesMap] = useState<Record<string, any[]>>(MOCK_NOTES_DB);
  const [noteText, setNoteText] = useState('');
  const [noteTag, setNoteTag] = useState('Lâm sàng');
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    const newNote = {
      id: Date.now().toString(),
      tag: noteTag,
      tagClass: TAG_STYLES[noteTag] || 'bg-slate-100 text-slate-700',
      date: 'Vừa xong',
      text: noteText.trim()
    };
    setNotesMap(prev => ({
      ...prev,
      [activeContactId]: [newNote, ...(prev[activeContactId] || [])]
    }));
    setNoteText('');
  };

  // Clear unread on mount for the first contact
  useEffect(() => {
    setContacts(prev => prev.map(c => c.id === activeContactId ? { ...c, unread: 0 } : c));
  }, []);

  const handleSelectContact = (id: string) => {
    if (isCalling) return;
    setActiveContactId(id);
    setContacts(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c));
  };
  
  // Call State
  const location = useLocation();
  const [isCalling, setIsCalling] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const contactId = searchParams.get('contact');
    if (contactId) {
      setActiveContactId(contactId);
      setContacts(prev => prev.map(c => c.id === contactId ? { ...c, unread: 0 } : c));
    }
    if (searchParams.get('call') === 'true') {
      setIsCalling(true);
    }
  }, [location.search]);

  useEffect(() => {
    let timer: any;
    if (isCalling) {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [isCalling]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const newMsg = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'doctor',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessagesDb(prev => ({
      ...prev,
      [activeContactId]: [...(prev[activeContactId] || []), newMsg]
    }));
    setContacts(prev => prev.map(c => 
      c.id === activeContactId ? { ...c, lastMessage: inputText, time: 'Vừa xong' } : c
    ));
    setInputText('');
  };

  const sendAttachment = (type: 'record' | 'prescription') => {
    const newMsg = {
      id: Date.now().toString(),
      text: type === 'record' ? '[Đính kèm: Hồ sơ bệnh án]' : '[Đính kèm: Đơn thuốc]',
      sender: 'doctor',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachment: type
    };
    setMessagesDb(prev => ({
      ...prev,
      [activeContactId]: [...(prev[activeContactId] || []), newMsg]
    }));
    setContacts(prev => prev.map(c => 
      c.id === activeContactId ? { ...c, lastMessage: newMsg.text, time: 'Vừa xong' } : c
    ));
    setShowAttachMenu(false);
  };

  const startCall = () => {
    setIsCalling(true);
  };

  const endCall = () => {
    setIsCalling(false);
  };

  return (
    <div className="h-full flex bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
      
      {/* ── Left Sidebar: Contacts ── */}
      <div className="w-[320px] border-r border-slate-200 flex flex-col shrink-0 bg-slate-50/50">
        <div className="p-4 border-b border-slate-200 bg-white">
          <h2 className="font-bold text-slate-800 text-lg mb-4">Nhắn tin</h2>
          <div className="relative">
            <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm bệnh nhân..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {contacts.map(contact => (
            <div 
              key={contact.id}
              onClick={() => handleSelectContact(contact.id)}
              className={`p-4 border-b border-slate-100 cursor-pointer transition-all flex gap-3
                ${isCalling ? 'opacity-50 pointer-events-none' : ''}
                ${activeContactId === contact.id ? 'bg-blue-50/50 border-l-4 border-l-blue-500' : 'hover:bg-white border-l-4 border-l-transparent'}`}
            >
              <div className={`w-12 h-12 rounded-full ${contact.avatarBg} flex items-center justify-center shrink-0 relative`}>
                <User size={20} className="text-slate-600" />
                {contact.status === 'online' && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-sm truncate ${contact.unread > 0 ? 'font-black text-slate-900' : 'font-bold text-slate-700'}`}>
                    {contact.name}
                  </span>
                  <span className={`text-[10px] shrink-0 ${contact.unread > 0 ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>
                    {contact.time}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <p className={`text-xs truncate ${contact.unread > 0 ? 'text-slate-800 font-semibold' : 'text-slate-500'}`}>
                    {contact.lastMessage}
                  </p>
                  {contact.unread > 0 && (
                    <span className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[9px] font-bold shrink-0 shadow-sm">
                      {contact.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Content: Chat / Call UI ── */}
      <div className="flex-1 flex flex-col relative bg-[#f8fafc]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-slate-200 flex justify-between items-center z-10 shadow-sm relative">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${activeContact.avatarBg} flex items-center justify-center`}>
              <User size={18} className="text-slate-600" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">{activeContact.name}</h2>
              <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Trực tuyến
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {!isCalling && (
              <>
                <button 
                  onClick={startCall}
                  className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                >
                  <PhoneCall size={20} weight="fill" />
                </button>
                <button 
                  onClick={startCall}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold shadow-md shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:scale-95"
                >
                  <VideoCamera size={20} weight="fill" /> Tư vấn trực tuyến
                </button>
              </>
            )}
          </div>
        </div>

        {/* Dynamic Content Area: Either Chat or Call UI */}
        <div className="flex-1 relative overflow-hidden flex flex-col">
          
          {isCalling ? (
            /* --- CALLING UI --- */
            <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-900 animate-fade-in-up">
              {/* Blurred background effect */}
              <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center blur-md" />
              
              <div className="relative z-30 flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-emerald-100 flex items-center justify-center mb-6 shadow-2xl border-4 border-slate-800 ring-4 ring-emerald-500/30 animate-pulse">
                  <User size={64} className="text-emerald-600" />
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-2">{activeContact.name}</h2>
                <div className="text-emerald-400 font-mono text-xl tracking-widest bg-slate-800/80 px-4 py-1.5 rounded-full backdrop-blur-sm">
                  {formatTime(callDuration)}
                </div>

                <div className="mt-12 flex items-center gap-6">
                  <button className="w-14 h-14 rounded-full bg-slate-700/80 text-white flex items-center justify-center hover:bg-slate-600 backdrop-blur-md transition-colors">
                    <Microphone size={24} weight="fill" />
                  </button>
                  <button className="w-14 h-14 rounded-full bg-slate-700/80 text-white flex items-center justify-center hover:bg-slate-600 backdrop-blur-md transition-colors">
                    <VideoCameraSlash size={24} weight="fill" />
                  </button>
                  <button 
                    onClick={endCall}
                    className="w-16 h-16 rounded-full bg-rose-600 text-white flex items-center justify-center hover:bg-rose-700 hover:scale-105 transition-all shadow-lg shadow-rose-600/30"
                  >
                    <PhoneDisconnect size={28} weight="fill" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* --- CHAT UI --- */
            <>
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                {activeMessages.map(msg => (
                  <div key={msg.id} className={`flex flex-col ${msg.sender === 'doctor' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm
                      ${msg.sender === 'doctor' 
                        ? 'bg-blue-600 text-white rounded-tr-sm' 
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'}`}
                    >
                      {msg.attachment ? (
                        <div className={`flex items-center gap-3 p-2 rounded-xl border ${msg.sender === 'doctor' ? 'bg-white/10 border-white/20' : 'bg-slate-50 border-slate-100'}`}>
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${msg.attachment === 'record' ? 'bg-blue-500 text-white' : 'bg-emerald-500 text-white'}`}>
                            {msg.attachment === 'record' ? <FileText size={20} /> : <Pill size={20} />}
                          </div>
                          <div>
                            <div className="font-bold text-[13px]">{msg.attachment === 'record' ? 'Hồ sơ bệnh án' : 'Đơn thuốc'}</div>
                            <div className="text-[10px] opacity-80">{activeContact.name} - {new Date().toLocaleDateString('vi-VN')}</div>
                          </div>
                        </div>
                      ) : (
                        msg.text
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 mx-1">{msg.time}</span>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-white border-t border-slate-200">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full pr-2 pl-2 py-1.5 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  
                  <div className="relative">
                    <button 
                      onClick={() => setShowAttachMenu(!showAttachMenu)} 
                      className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-100 transition-colors"
                    >
                      <Paperclip size={18} className="transform rotate-[-45deg]" />
                    </button>
                    {showAttachMenu && (
                      <div className="absolute bottom-[calc(100%+12px)] left-0 w-52 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200 py-2 animate-fade-in-up z-50 overflow-hidden">
                        <button onClick={() => sendAttachment('record')} className="w-full px-4 py-2.5 text-left text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-3 transition-colors">
                          <FileText size={18} className="text-blue-500" weight="fill" /> Đính kèm Bệnh án
                        </button>
                        <button onClick={() => sendAttachment('prescription')} className="w-full px-4 py-2.5 text-left text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-3 transition-colors">
                          <Pill size={18} className="text-emerald-500" weight="fill" /> Đính kèm Đơn thuốc
                        </button>
                      </div>
                    )}
                  </div>

                  <input 
                    type="text" 
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Nhập tin nhắn..." 
                    className="flex-1 bg-transparent text-sm focus:outline-none py-2"
                  />
                  <button 
                    onClick={handleSendMessage}
                    disabled={!inputText.trim()}
                    className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors shadow-sm shrink-0"
                  >
                    <PaperPlaneRight size={18} weight="fill" />
                  </button>
                </div>
              </div>
            </>
          )}

        </div>
      </div>

      {/* ── Right Sidebar (Notes) ── */}
      <div className="w-[340px] flex flex-col shrink-0 bg-white border-l border-slate-200">
        <div className="flex border-b border-slate-200">
          <div className="flex-1 py-4 text-sm font-bold text-blue-700 border-b-2 border-blue-600 flex items-center justify-center gap-2">
            <FileText size={18} weight="fill" /> Ghi chú nội bộ
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-5 bg-slate-50/50 flex flex-col gap-4">
          {/* Add Note Form */}
          <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-4 shadow-sm relative overflow-hidden transition-all focus-within:shadow-md focus-within:border-blue-300">
            <div className="flex items-center gap-2 text-blue-700 font-bold mb-3 text-sm relative z-10">
              <FileText size={16} /> Thêm ghi chú mới
            </div>
            <textarea 
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              placeholder="Nhập ghi chú lâm sàng nhanh..." 
              className="w-full bg-white border border-blue-100 rounded-xl p-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none h-24 mb-3 relative z-10"
            />
            <div className="flex items-center gap-3 relative z-10">
              <select 
                value={noteTag}
                onChange={e => setNoteTag(e.target.value)}
                className="flex-1 bg-white border border-blue-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 font-medium text-slate-700 cursor-pointer"
              >
                <option>Lâm sàng</option>
                <option>Dị ứng</option>
                <option>Cảnh báo</option>
              </select>
              <button 
                onClick={handleAddNote}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-lg text-sm transition-all shadow-md shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5 active:scale-95 active:translate-y-0"
              >
                + Lưu
              </button>
            </div>
          </div>

          {/* Saved Notes */}
          {(!notesMap[activeContactId] || notesMap[activeContactId].length === 0) ? (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center bg-white border border-slate-200 border-dashed rounded-2xl">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                <FileText size={24} className="text-slate-300" />
              </div>
              <h3 className="text-sm font-bold text-slate-700 mb-1">Chưa có ghi chú nào</h3>
              <p className="text-xs text-slate-500">Ghi chú của bạn về bệnh nhân này sẽ hiển thị ở đây.</p>
            </div>
          ) : (
            notesMap[activeContactId].map(note => (
              <div key={note.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex justify-between items-center mb-3">
                  <span className={`${note.tagClass} px-2.5 py-1 rounded-full text-xs font-bold`}>{note.tag}</span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 group-hover:text-slate-500 transition-colors"><Clock size={12}/> {note.date}</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{note.text}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
