import React, { useState, useEffect, useRef } from 'react';
import { Paperclip, PaperPlaneRight, Robot, Sparkle, FileText } from '@phosphor-icons/react';
import NewAppointmentModal from './NewAppointmentModal';

export default function PatientChatbot() {
  const [messages, setMessages] = useState<any[]>([
    { id: 1, text: 'Xin chào! Tôi là Trợ lý Y tế AI. Tôi có thể giúp gì cho sức khỏe của bạn hôm nay?', isMe: false, time: 'Vừa xong' }
  ]);
  const [msgInput, setMsgInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const severityRef = useRef({ level: 'Chưa xác định (Cần thêm thông tin)', color: 'bg-slate-100 text-slate-700 border-slate-300' });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const getBotResponse = (text: string) => {
    const lower = text.toLowerCase();
    
    // Hàm hỗ trợ nhận diện chính xác từ khóa (không bị dính chữ liền nhau, VD: "hi" trong "xuất hiện")
    const hasWord = (words: string[]) => {
      return words.some(w => new RegExp(`(^|\\s|[.,!?])${w}([.,!?]|\\s|$)`, 'i').test(lower));
    };

    // Đánh giá mức độ khẩn cấp ngầm
    if (hasWord(['cấp cứu', 'tự tử', 'chết', 'đột quỵ', 'nguy kịch'])) {
      severityRef.current = { level: 'Khẩn cấp (Cần gọi 115 ngay)', color: 'bg-red-100 text-red-700 border-red-300' };
    } else if (hasWord(['có', 'rất', 'nhiều', 'khó chịu', 'mệt', 'đau dữ dội'])) {
      severityRef.current = { level: 'Nặng (Cần đặt khám bác sĩ)', color: 'bg-orange-100 text-orange-700 border-orange-300' };
    } else if (hasWord(['đau đầu', 'chóng mặt', 'sốt', 'đau bụng', 'nôn', 'đi ngoài'])) {
      if (severityRef.current.level.includes('Chưa xác định') || severityRef.current.level.includes('Nhẹ')) {
        severityRef.current = { level: 'Trung bình (Cần theo dõi thêm)', color: 'bg-amber-100 text-amber-700 border-amber-300' };
      }
    } else if (hasWord(['không', 'bình thường', 'ổn', 'ít', 'chưa'])) {
      if (!severityRef.current.level.includes('Khẩn cấp')) {
        severityRef.current = { level: 'Nhẹ (Có thể tự theo dõi ở nhà)', color: 'bg-green-100 text-green-700 border-green-300' };
      }
    }

    // Nhận diện từ khóa nguy hiểm
    if (hasWord(['cấp cứu', 'tự tử', 'chết', 'đột quỵ', 'nguy kịch'])) {
      return {
        text: '⚠️ CẢNH BÁO: Từ khóa khẩn cấp được nhận diện! Vui lòng gọi ngay cho số Cấp cứu 115 hoặc nhờ người nhà đưa đến Cơ sở Y tế gần nhất ngay lập tức.',
        suggestions: ['Tôi hiểu, cảm ơn', 'Hướng dẫn sơ cứu']
      };
    }

    // Xử lý các câu trả lời ngắn theo ngữ cảnh thời gian, mức độ (ƯU TIÊN CAO)
    if (hasWord(['sáng', 'chiều', 'tối', 'qua', 'nay', 'mới', 'vừa', 'ngày', 'tuần', 'tháng'])) {
      return {
        text: 'Cảm ơn bạn đã cung cấp thời gian. Tình trạng này có làm ảnh hưởng nhiều đến giấc ngủ hay sinh hoạt của bạn không?',
        suggestions: ['Rất nhiều', 'Chỉ một chút', 'Không ảnh hưởng']
      };
    }
    if (hasWord(['có', 'rất', 'nhiều', 'khó chịu', 'mệt', 'đau'])) {
      return {
        text: 'Tôi hiểu sự bất tiện này. Dựa trên mô tả, tình trạng của bạn cần được bác sĩ đánh giá trực tiếp. Bạn có muốn xem danh sách bác sĩ để đặt khám không?',
        suggestions: ['Có, gợi ý bác sĩ cho tôi', 'Để tôi theo dõi thêm']
      };
    }
    if (hasWord(['không', 'bình thường', 'ổn', 'ít', 'chưa'])) {
      return {
        text: 'Vậy thì tạm thời bạn đừng quá lo lắng. Hãy nghỉ ngơi, uống đủ nước và tiếp tục theo dõi thêm. Nếu triệu chứng trở nặng, hãy quay lại đây nhé.',
        suggestions: ['Cảm ơn trợ lý AI', 'Cho tôi gợi ý bác sĩ']
      };
    }

    if (hasWord(['đặt lịch', 'khám', 'bác sĩ'])) {
      return {
        text: 'Dựa trên nhu cầu của bạn, tôi đề xuất một số bác sĩ chuyên khoa phù hợp dưới đây. Bạn có thể đặt lịch hẹn trực tiếp:',
        type: 'doctors',
        doctors: [
          { name: 'BS. Phạm Văn Đức', spec: 'Nội tổng hợp', bg: 'bg-green-100' },
          { name: 'BS. Trần Minh Tuấn', spec: 'Ngoại tiêu hóa', bg: 'bg-slate-100' }
        ],
        suggestions: ['Tôi muốn hỏi thêm triệu chứng', 'Cảm ơn AI']
      };
    }

    if (hasWord(['đau đầu', 'chóng mặt', 'nhức đầu'])) {
      return {
        text: 'Bạn bị triệu chứng này lâu chưa? Có kèm theo buồn nôn hay nhạy cảm với ánh sáng không? Nếu đau dữ dội, bạn nên đặt lịch khám chuyên khoa Thần kinh nhé.',
        suggestions: ['Mới bị sáng nay', 'Đau dữ dội', 'Chỉ hơi nhức']
      };
    }
    if (hasWord(['sốt', 'nóng', 'ớn lạnh'])) {
      return {
        text: 'Nhiệt độ hiện tại của bạn là bao nhiêu? Bạn nên uống nhiều nước, mặc đồ thoáng mát và có thể dùng Paracetamol nếu sốt trên 38.5°C.',
        suggestions: ['Tôi không có nhiệt kế', 'Trên 39 độ', 'Chỉ hơi ấm ấm']
      };
    }
    if (hasWord(['đau bụng', 'tiêu hóa', 'đi ngoài', 'nôn mửa', 'buồn nôn'])) {
      return {
        text: 'Đau ở vùng nào của bụng vậy bạn (trên rốn, dưới rốn, hay bên phải)? Có kèm theo tiêu chảy hay nôn mửa không?',
        suggestions: ['Đau quanh rốn', 'Đau bên phải', 'Không nôn mửa']
      };
    }
    if (hasWord(['chào', 'xin chào', 'hi', 'hello'])) {
      return {
        text: 'Chào bạn! Hãy mô tả chi tiết triệu chứng bạn đang gặp phải để tôi tư vấn nhé.',
        suggestions: ['Tôi bị đau đầu', 'Tôi muốn đặt lịch khám']
      };
    }
    if (hasWord(['cảm ơn', 'thanks', 'cám ơn', 'tuyệt vời', 'dạ'])) {
      return {
        text: 'Không có chi! Chúc bạn thật nhiều sức khỏe. Dựa trên các thông tin bạn cung cấp, hệ thống AI đã đánh giá sơ bộ mức độ triệu chứng của bạn:',
        severity: severityRef.current,
        suggestions: ['Kết thúc tư vấn', 'Đặt lịch khám ngay']
      };
    }

    // Các câu phản hồi ngẫu nhiên nếu không khớp từ khóa để tránh lặp lại spam
    const fallbacks = [
      'Dạ, tôi đã ghi nhận thông tin. Để tư vấn chính xác hơn, bạn có thể nói chi tiết hơn về mức độ khó chịu được không?',
      'Bạn có đang sử dụng loại thuốc nào để điều trị triệu chứng này không?',
      'Ngoài ra bạn còn cảm thấy đau hay khó chịu ở bộ phận nào khác không?',
      'Triệu chứng này thường xuất hiện vào thời điểm nào trong ngày vậy bạn?'
    ];
    
    return {
      text: fallbacks[Math.floor(Math.random() * fallbacks.length)],
      suggestions: ['Hướng dẫn tôi đặt lịch khám', 'Triệu chứng của tôi bình thường']
    };
  };

  const handleSend = (overrideText?: string) => {
    const textToSend = overrideText || msgInput;
    if (!textToSend.trim()) return;
    
    const userMsg = { id: Date.now(), text: textToSend, isMe: true, time: 'Vừa xong' };
    setMessages(prev => [...prev, userMsg]);
    setMsgInput('');
    setIsTyping(true);
    inputRef.current?.focus();

    // Simulate AI thinking and replying
    setTimeout(() => {
      const response = getBotResponse(userMsg.text);
      const botReply = {
        id: Date.now() + 1,
        text: response.text,
        suggestions: response.suggestions,
        type: response.type,
        doctors: response.doctors,
        severity: (response as any).severity,
        isMe: false,
        time: 'Vừa xong'
      };
      setMessages(prev => [...prev, botReply]);
      setIsTyping(false);
    }, 1500);
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
        
        .typing-dot {
          animation: typing 1.4s infinite ease-in-out both;
        }
        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }
        @keyframes typing {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>
      
      {/* Main Chat Column */}
      <div className="flex-1 flex flex-col bg-[#F9FBFC] relative">
        {/* Header */}
        <header className="h-[72px] shrink-0 border-b border-slate-200 bg-white px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100 text-blue-600 shadow-inner">
              <Robot size={22} weight="fill" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-[15px] flex items-center gap-1.5">
                Trợ lý Y tế AI <Sparkle size={16} className="text-yellow-500" weight="fill" />
              </h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-xs text-blue-600 font-medium">Sẵn sàng tư vấn 24/7</span>
              </div>
            </div>
          </div>
        </header>

        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex flex-col max-w-[75%] ${Date.now() - msg.id < 1000 ? 'animate-slide-up' : ''} ${msg.isMe ? 'self-end' : 'self-start'}`}>
              <div className={`px-4 py-2.5 rounded-2xl text-[15px] ${msg.isMe ? 'bg-white border border-slate-200 text-slate-700 rounded-tr-sm shadow-sm' : 'bg-blue-600 text-white rounded-tl-sm shadow-sm leading-relaxed'}`}>
                {msg.text}
              </div>
              
              {msg.type === 'doctors' && msg.doctors && (
                <div className="mt-2 flex flex-col gap-2 w-full">
                  {msg.doctors.map((doc: any, idx: number) => (
                    <div key={idx} className="bg-white border border-slate-200 rounded-lg p-3 flex items-center gap-3 shadow-sm hover:border-blue-300 transition-colors">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${doc.bg} text-slate-700 font-bold`}>
                        {doc.name.charAt(4)}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-slate-800">{doc.name}</div>
                        <div className="text-[11px] text-slate-500">{doc.spec}</div>
                      </div>
                      <button 
                        onClick={() => setIsModalOpen(true)} 
                        className="text-[11px] bg-blue-50 text-blue-600 font-bold px-3 py-1.5 rounded-md hover:bg-blue-100 border border-blue-100"
                      >
                        Đặt hẹn
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {msg.severity && (
                <div className="mt-2 w-full animate-slide-up">
                  <div className={`px-4 py-3 rounded-lg border text-[13px] shadow-sm ${msg.severity.color}`}>
                    <div className="flex items-center gap-1.5 mb-1.5 font-bold uppercase tracking-wide opacity-90">
                      <Sparkle size={16} weight="fill" /> KẾT LUẬN TỪ TRỢ LÝ AI:
                    </div>
                    <div className="font-semibold text-sm">{msg.severity.level}</div>
                  </div>
                </div>
              )}

              {msg.suggestions && msg.suggestions.length > 0 && !isTyping && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {msg.suggestions.map((sug: string, idx: number) => (
                    <button 
                      key={idx} 
                      onClick={() => handleSend(sug)}
                      className="px-3 py-1.5 bg-white border border-blue-200 text-blue-600 text-[12px] font-medium rounded-full hover:bg-blue-50 hover:border-blue-300 transition-colors shadow-sm text-left"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              )}

              <span className={`text-[11px] text-slate-400 mt-1.5 font-medium ${msg.isMe ? 'text-right' : 'text-left'}`}>
                {msg.time}
              </span>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex flex-col max-w-[75%] self-start animate-slide-up">
              <div className="px-5 py-4 rounded-2xl bg-slate-100 text-slate-500 rounded-tl-sm flex gap-1 items-center">
                <div className="w-2 h-2 rounded-full bg-slate-400 typing-dot"></div>
                <div className="w-2 h-2 rounded-full bg-slate-400 typing-dot"></div>
                <div className="w-2 h-2 rounded-full bg-slate-400 typing-dot"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-200 shrink-0 flex items-center gap-3">
          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-full flex items-center px-4 h-14">
            <button className="text-slate-400 hover:text-slate-600 transition-colors shrink-0">
              <Paperclip size={20} />
            </button>
            <input 
              ref={inputRef}
              type="text" 
              placeholder="Nhập triệu chứng của bạn để AI tư vấn..." 
              value={msgInput}
              onChange={e => setMsgInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-transparent border-none outline-none px-3 text-[15px] text-slate-700 placeholder-slate-400"
            />
          </div>
          <button 
            onClick={() => handleSend()} 
            disabled={!msgInput.trim()}
            className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-200 transition-colors"
          >
            <PaperPlaneRight size={22} weight="fill" />
          </button>
        </div>
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
              <p className="text-xs text-slate-500">Đặt một lịch hẹn với bác sĩ thật.</p>
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

      <NewAppointmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialDoctor={{ name: 'Tư vấn viên', spec: 'Đa khoa', bg: 'bg-blue-100' }} />
    </div>
  );
}
