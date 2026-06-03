import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { MagnifyingGlass, Phone, Paperclip, PaperPlaneRight, VideoCamera, Microphone, MicrophoneSlash, PhoneDisconnect, FileText, CaretDown } from '@phosphor-icons/react';
import NewAppointmentModal from './NewAppointmentModal';

const INITIAL_DOCTORS = [
  { id: 1, name: 'BS. Phạm Văn Đức', msg: 'Bác sĩ ơi, tôi hơi mệt...', time: '10:30', bg: 'bg-green-100', dot: 'bg-green-500' },
  { id: 2, name: 'BS. Nguyễn Thị Hoa', msg: 'Cảm ơn bác sĩ nhiều ạ.', time: 'Hôm qua', bg: 'bg-red-100', dot: 'bg-transparent' },
  { id: 3, name: 'BS. Trần Minh Tuấn', msg: 'Mai tôi ghé phòng khám.', time: 'Hôm qua', bg: 'bg-slate-100', dot: 'bg-transparent' },
];

export default function PatientConsultDoctor() {
  const location = useLocation();
  const targetDoctorName = location.state?.targetDoctorName;
  
  const initialNewDoc = {
    id: 999, // use a fixed mock ID for the new doc
    name: targetDoctorName || '',
    msg: 'Bắt đầu cuộc trò chuyện',
    time: 'Vừa xong',
    bg: 'bg-blue-100',
    dot: 'bg-transparent'
  };

  const [doctorsList, setDoctorsList] = useState(() => {
    if (targetDoctorName && !INITIAL_DOCTORS.some(d => d.name === targetDoctorName)) {
      return [initialNewDoc, ...INITIAL_DOCTORS];
    }
    return INITIAL_DOCTORS;
  });

  const [activeDoc, setActiveDoc] = useState(() => {
    if (targetDoctorName) {
      const existing = INITIAL_DOCTORS.find(d => d.name === targetDoctorName);
      return existing || initialNewDoc;
    }
    return INITIAL_DOCTORS[1];
  });
  const [isCalling, setIsCalling] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(false);
  const [notes, setNotes] = useState<string[]>([]);
  const [noteText, setNoteText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messagesRecord, setMessagesRecord] = useState<Record<number, any[]>>({
    1: [
      { id: 1, text: 'Bác sĩ ơi, tôi hơi mệt...', isMe: true, time: '10:30' },
      { id: 2, text: 'Chào bạn, bạn có triệu chứng gì?', isMe: false, time: '10:35' },
    ],
    2: [
      { id: 1, text: 'Nhớ uống thuốc đúng giờ nhé anh/chị.', isMe: false, time: 'Hôm qua' },
      { id: 2, text: 'Cảm ơn bác sĩ nhiều ạ.', isMe: true, time: 'Hôm qua' }
    ],
    3: [
      { id: 1, text: 'Mai tôi ghé phòng khám.', isMe: true, time: 'Hôm qua' },
    ]
  });
  const currentMessages = messagesRecord[activeDoc.id] || [];
  const [msgInput, setMsgInput] = useState('');
  const [callDuration, setCallDuration] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isCalling) {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [isCalling]);

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSend = () => {
    if (!msgInput.trim()) return;
    const newMsg = { id: Date.now(), text: msgInput, isMe: true, time: 'Vừa xong' };
    setMessagesRecord({
      ...messagesRecord,
      [activeDoc.id]: [...currentMessages, newMsg]
    });
    setMsgInput('');
    inputRef.current?.focus();
  };

  const handleSaveNote = () => {
    if (!noteText.trim()) return;
    setNotes([noteText, ...notes]);
    setNoteText('');
  };

  return (
    <div className="flex-1 flex h-[calc(100vh-80px)] overflow-hidden bg-white">
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slideUp 0.3s ease-out forwards;
        }
      `}</style>
      
      {/* Left Sidebar (Contacts) */}
      <div className="w-[300px] shrink-0 border-r border-slate-200 flex flex-col bg-white">
        <div className="p-6 pb-4">
          <h1 className="text-xl font-bold text-slate-900 mb-6">Nhắn tin</h1>
          <div className="relative">
            <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm bác sĩ..."
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>
          <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
            {doctorsList.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setActiveDoc(doc)}
                className={`flex items-center gap-3 p-4 cursor-pointer transition-colors border-l-4 ${activeDoc.id === doc.id ? 'border-blue-600 bg-slate-50' : 'border-transparent hover:bg-slate-50'}`}
              >
              <div className="relative">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${doc.bg} text-slate-600`}>
                  {/* Mock avatar */}
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </div>
                {doc.dot !== 'bg-transparent' && (
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${doc.dot}`} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className="font-bold text-slate-900 text-sm truncate">{doc.name}</h3>
                  <span className="text-[10px] text-slate-400 shrink-0 ml-2">{doc.time}</span>
                </div>
                <p className="text-xs text-slate-500 truncate">{doc.msg}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Middle Column (Chat) */}
      <div className="flex-1 flex flex-col bg-[#F9FBFC] relative">
        {/* Header */}
        <header className="h-[72px] shrink-0 border-b border-slate-200 bg-white px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activeDoc.bg} text-slate-600`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-[15px]">{activeDoc.name}</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                <span className="text-xs text-emerald-600 font-medium">Trực tuyến</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsCalling(true)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 hover:bg-slate-100 text-blue-600 transition-colors shadow-sm border border-slate-100"
          >
            <Phone size={20} weight="fill" />
          </button>
        </header>

        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          {currentMessages.map(msg => (
            <div key={msg.id} className={`flex flex-col max-w-[75%] ${Date.now() - msg.id < 1000 ? 'animate-slide-up' : ''} ${msg.isMe ? 'self-end' : 'self-start'}`}>
              <div className={`px-4 py-2.5 rounded-2xl text-[15px] ${msg.isMe ? 'bg-white border border-slate-200 text-slate-700 rounded-tr-sm shadow-sm' : 'bg-blue-600 text-white rounded-tl-sm shadow-sm'}`}>
                {msg.text}
              </div>
              <span className={`text-[11px] text-slate-400 mt-1.5 font-medium ${msg.isMe ? 'text-right' : 'text-left'}`}>
                {msg.time}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-200 shrink-0 flex items-center gap-3">
          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-full flex items-center px-4 h-12">
            <button className="text-slate-400 hover:text-slate-600 transition-colors shrink-0">
              <Paperclip size={20} />
            </button>
            <input
              ref={inputRef}
              type="text"
              placeholder="Nhập tin nhắn..."
              value={msgInput}
              onChange={e => setMsgInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-transparent border-none outline-none px-3 text-sm text-slate-700 placeholder-slate-400"
            />
          </div>
          <button onClick={handleSend} className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-200 transition-colors">
            <PaperPlaneRight size={20} weight="fill" />
          </button>
        </div>

        {/* Calling Overlay - Small Widget */}
        {isCalling && (
          <div className="absolute top-20 right-6 z-40 flex flex-col items-center p-5 bg-[#1A222C] rounded-2xl shadow-2xl border border-slate-700 w-64">
            {/* Avatar Area */}
            <div className="flex flex-col items-center mb-5">
              <div className="w-16 h-16 rounded-full border-[3px] border-emerald-900/30 flex items-center justify-center bg-emerald-500/10 text-emerald-500 mb-2 relative">
                <div className="absolute inset-0 rounded-full animate-ping border border-emerald-500/50" />
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
              <h2 className="text-sm font-bold text-white mb-1 truncate w-full text-center">{activeDoc.name}</h2>
              <div className="px-2 py-0.5 bg-slate-800 rounded-full text-emerald-400 font-mono tracking-widest text-[10px]">
                {formatDuration(callDuration)}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMicOn(!isMicOn)}
                className="w-10 h-10 rounded-full bg-slate-700/80 hover:bg-slate-600 text-white flex items-center justify-center transition-colors"
              >
                {isMicOn ? <Microphone size={18} /> : <MicrophoneSlash size={18} />}
              </button>
              <button
                onClick={() => setIsCamOn(!isCamOn)}
                className={`w-10 h-10 rounded-full ${isCamOn ? 'bg-slate-700/80 hover:bg-slate-600' : 'bg-white/10 hover:bg-white/20'} text-white flex items-center justify-center transition-colors`}
              >
                <VideoCamera size={18} />
              </button>
              <button
                onClick={() => setIsCalling(false)}
                className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors shadow-lg shadow-red-500/30 ml-1"
              >
                <PhoneDisconnect size={20} weight="fill" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Column (Notes) */}
      <div className="w-[320px] shrink-0 border-l border-slate-200 bg-white flex flex-col">
        <header className="h-[72px] shrink-0 border-b-2 border-blue-600 flex items-center justify-center text-blue-600 font-bold text-[15px] gap-2 px-6">
          <FileText size={20} weight="fill" /> Ghi chú
        </header>

        <div className="flex-1 p-5 flex flex-col gap-5 bg-slate-50/50">
          {/* Add Note Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col flex-1">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm mb-3">
              <FileText size={16} weight="bold" /> Thêm ghi chú mới
            </div>
            <textarea
              placeholder="Nhập ghi chú nhanh..."
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              className="w-full flex-1 p-3 rounded-lg border border-slate-200 outline-none focus:border-blue-400 text-sm resize-none bg-white"
            />
          </div>

          {/* Book Appointment Action */}
          <div className="shrink-0 bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            </div>
            <div className="text-center">
              <h4 className="font-bold text-slate-700 text-sm mb-1">Cần khám trực tiếp?</h4>
              <p className="text-xs text-slate-500">Đặt một lịch hẹn với bác sĩ này.</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full py-2.5 mt-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-sm text-sm"
            >
              Đặt lịch khám ngay
            </button>
          </div>
        </div>
      </div>

      <NewAppointmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialDoctor={{ name: activeDoc.name, spec: 'Tổng quát', bg: activeDoc.bg }} />
    </div>
  );
}
