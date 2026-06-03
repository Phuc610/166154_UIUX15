import { useState } from 'react';

import { 
  FileText, Sparkle, Clock
} from '@phosphor-icons/react';

const MOCK_PATIENTS = [
  {
    id: 'p1',
    name: 'Phạm Văn Đức',
    status: 'Chờ khám',
    time: '10 phút trước',
    snippet: 'Đau tức ngực trái, khó thở nhẹ...',
    gender: 'Nam',
    age: 55,
    bloodType: 'AB+',
    avatarBg: 'bg-emerald-200'
  },
  {
    id: 'p2',
    name: 'Nguyễn Thị Hoa',
    status: 'Đang chat',
    time: 'Vừa xong',
    snippet: 'Dạ, em bị ho có đờm 3 ngày nay...',
    gender: 'Nữ',
    age: 34,
    bloodType: 'O+',
    avatarBg: 'bg-pink-200'
  },
  {
    id: 'p3',
    name: 'Trần Minh Tuấn',
    status: 'Đang chat',
    time: '5 phút trước',
    snippet: 'Tôi thấy chóng mặt và buồn nôn từ chiều...',
    gender: 'Nam',
    age: 42,
    bloodType: 'B+',
    avatarBg: 'bg-blue-200'
  },
  {
    id: 'p4',
    name: 'Lê Hoàng Yến',
    status: 'Chờ tái khám',
    time: '20 phút trước',
    snippet: 'Bác sĩ ơi, sau khi uống thuốc hôm qua em bị mẩn đỏ...',
    gender: 'Nữ',
    age: 28,
    bloodType: 'A+',
    avatarBg: 'bg-purple-200'
  },
  {
    id: 'p5',
    name: 'Vũ Thanh Bình',
    status: 'Mới đặt',
    time: '30 phút trước',
    snippet: 'Đau bụng âm ỉ vùng thượng vị...',
    gender: 'Nam',
    age: 61,
    bloodType: 'O-',
    avatarBg: 'bg-orange-200'
  }
];

const MOCK_CHATS: Record<string, {sender: string, text: string}[]> = {
  p1: [
    { sender: 'ai', text: 'Chào bác Phạm Văn Đức. Cháu là Trợ lý AI của phòng khám Preclinic. Bác có thể mô tả chi tiết triệu chứng khó chịu hiện tại được không ạ?' },
    { sender: 'user', text: 'Tôi bị đau tức ngực bên trái từ sáng hôm qua. Cảm giác đau lan ra sau lưng và có hơi khó thở khi đi lại nhiều.' },
    { sender: 'ai', text: 'Dạ cháu hiểu. Cơn đau của bác có kéo dài không? Bác có kèm theo buồn nôn, vã mồ hôi hay chóng mặt không ạ?' },
    { sender: 'user', text: 'Mỗi cơn đau khoảng 5-10 phút. Không buồn nôn nhưng có toát mồ hôi hột lúc đau thắt lại.' },
    { sender: 'ai', text: 'Cảm ơn bác. Cháu đã ghi nhận các triệu chứng này và gửi ngay cho bác sĩ phụ trách. Bác sĩ sẽ gọi bác vào khám trực tiếp ngay bây giờ. Bác vui lòng ngồi nghỉ ngơi tại chỗ nhé.' }
  ],
  p2: [
    { sender: 'ai', text: 'Chào chị Nguyễn Thị Hoa. Chị có thể cho biết tình trạng ho của mình cụ thể như thế nào không?' },
    { sender: 'user', text: 'Dạ, em bị ho có đờm 3 ngày nay, họng hơi rát.' },
    { sender: 'ai', text: 'Đờm của chị có màu gì? Chị có sốt hay kèm theo sổ mũi không?' }
  ],
  p3: [
    { sender: 'user', text: 'Tôi thấy chóng mặt và buồn nôn từ chiều...' },
    { sender: 'ai', text: 'Chào anh Trần Minh Tuấn. Anh vui lòng ngồi nghỉ và cho biết anh có đang uống loại thuốc nào không?' }
  ],
  p4: [
    { sender: 'user', text: 'Bác sĩ ơi, sau khi uống thuốc hôm qua em bị mẩn đỏ ở tay và ngứa.' },
    { sender: 'ai', text: 'Chào chị Yến. Chị chụp lại vùng mẩn đỏ và ngừng uống thuốc ngay nhé. Em đã báo cho bác sĩ điều trị.' }
  ],
  p5: [
    { sender: 'user', text: 'Đau bụng âm ỉ vùng thượng vị từ sáng sớm, có lúc buồn nôn.' },
    { sender: 'ai', text: 'Chào bác Bình. Bác có ăn uống gì lạ vào tối qua không? Bác có bị ợ hơi hay ợ chua không ạ?' }
  ]
};

type Note = {
  id: string;
  tag: string;
  tagClass: string;
  date: string;
  text: string;
};

const MOCK_NOTES_DB: Record<string, Note[]> = {
  p1: [
    { id: 'n1', tag: 'Lâm sàng', tagClass: 'bg-sky-100 text-sky-700', date: 'Vừa xong', text: 'Bệnh nhân có biểu hiện lo âu. Cần chú ý trấn an trước khi thực hiện các xét nghiệm chuyên sâu.' },
    { id: 'n2', tag: 'Cảnh báo', tagClass: 'bg-rose-100 text-rose-700', date: 'Hôm qua', text: 'Nhịp tim có lúc tăng cao bất thường (110 bpm) lúc nghỉ ngơi. Cần theo dõi sát chỉ số Holter 24h.' },
    { id: 'n3', tag: 'Dị ứng', tagClass: 'bg-emerald-100 text-emerald-700', date: '15/04/2026', text: 'Tiền sử phản vệ độ 1 với thuốc cản quang. Lưu ý chuyển phương pháp siêu âm nếu cần.' }
  ],
  p2: [
    { id: 'n4', tag: 'Lâm sàng', tagClass: 'bg-sky-100 text-sky-700', date: '12/05/2026', text: 'Ho kéo dài, chưa thấy dấu hiệu viêm phổi.' }
  ]
};

const TAG_STYLES: Record<string, string> = {
  'Lâm sàng': 'bg-sky-100 text-sky-700',
  'Dị ứng': 'bg-emerald-100 text-emerald-700',
  'Cảnh báo': 'bg-rose-100 text-rose-700'
};

const AIAssistant = () => {
  const [activePatient, setActivePatient] = useState(MOCK_PATIENTS[0]);
  
  const [notesMap, setNotesMap] = useState<Record<string, Note[]>>(MOCK_NOTES_DB);
  const [noteText, setNoteText] = useState('');
  const [noteTag, setNoteTag] = useState('Lâm sàng');

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    const newNote: Note = {
      id: Date.now().toString(),
      tag: noteTag,
      tagClass: TAG_STYLES[noteTag] || 'bg-slate-100 text-slate-700',
      date: 'Vừa xong',
      text: noteText.trim()
    };
    setNotesMap(prev => ({
      ...prev,
      [activePatient.id]: [newNote, ...(prev[activePatient.id] || [])]
    }));
    setNoteText('');
  };

  return (
    <div className="h-full flex bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      
      {/* ── Left Sidebar (Patient List) ────────────────────────────────────── */}
      <div className="w-[320px] border-r border-slate-200 flex flex-col shrink-0 bg-slate-50/50">
        <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
          <h2 className="font-bold text-slate-800">Phiên Trợ lý AI</h2>
          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">
            {MOCK_PATIENTS.length}
          </span>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {MOCK_PATIENTS.map(p => (
            <div 
              key={p.id}
              onClick={() => {
                setActivePatient(p);
              }}
              className={`p-4 border-b border-slate-100 cursor-pointer transition-all duration-300 relative
                ${activePatient.id === p.id 
                  ? 'bg-blue-50/80 backdrop-blur-sm border-l-4 border-l-blue-500 shadow-sm z-10' 
                  : 'hover:bg-white hover:shadow-md hover:-translate-y-0.5 hover:z-10 border-l-4 border-l-transparent'}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold text-slate-900 text-sm">{p.name}</span>
                <span className="text-[10px] text-slate-400">{p.time}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full 
                  ${p.status === 'Chờ khám' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {p.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate">{p.snippet}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Center Content ──────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 bg-white border-r border-slate-200">
        
        {/* Header & Tabs */}
        <div className="px-6 pt-5 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-4 mb-2">
            <div className={`w-12 h-12 rounded-full ${activePatient.avatarBg} flex items-center justify-center shrink-0`}>
              <span className="font-bold text-slate-700">{activePatient.name.split(' ').pop()}</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{activePatient.name}</h2>
              <div className="text-sm text-slate-500 mt-0.5">
                {activePatient.age} tuổi · {activePatient.gender} · Nhóm máu {activePatient.bloodType}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6">
          
          {/* TAB: CHAT HISTORY */}
          <div className="max-w-3xl mx-auto flex flex-col gap-4">
            <div className="text-center mb-4">
              <span className="bg-slate-200 text-slate-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Hôm nay
              </span>
            </div>
            {/* Chat content rendering... */}
            {(MOCK_CHATS[activePatient.id] || []).map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mr-3 mt-1">
                    <Sparkle size={16} className="text-blue-600" weight="fill" />
                  </div>
                )}
                <div className={`max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed
                  ${msg.sender === 'user' 
                    ? 'bg-slate-800 text-white rounded-tr-sm' 
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm'}`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Sidebar (Notes) ────────────────────────────────── */}
      <div className="w-[340px] flex flex-col shrink-0 bg-white">
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
          {(!notesMap[activePatient.id] || notesMap[activePatient.id].length === 0) ? (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center bg-white border border-slate-200 border-dashed rounded-2xl">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                <FileText size={24} className="text-slate-300" />
              </div>
              <h3 className="text-sm font-bold text-slate-700 mb-1">Chưa có ghi chú nào</h3>
              <p className="text-xs text-slate-500">Ghi chú của bạn về bệnh nhân này sẽ hiển thị ở đây.</p>
            </div>
          ) : (
            notesMap[activePatient.id].map(note => (
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

export default AIAssistant;
