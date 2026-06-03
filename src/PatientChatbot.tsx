import { useState, useEffect, useRef } from 'react';
import { Plus, Robot, Sparkle, CalendarBlank, CaretRight, CheckCircle, Funnel, PaperPlaneRight, FileText } from '@phosphor-icons/react';
import NewAppointmentModal from './NewAppointmentModal';

const INITIAL_SESSIONS = [
  {
    id: 1, title: 'Đau đầu', level: 'Nhẹ', levelColor: 'bg-green-100 text-green-700', lastMsg: 'Hiện bạn có đang dùng thuốc...', time: '20:49', status: 'active',
    messages: [
      { id: 1, text: 'Chào bạn, tôi là Trợ lý AI. Bạn đang gặp triệu chứng gì?', isMe: false, time: '20:45', suggestions: ['Tôi hay bị đau nhức đầu', 'Tôi thấy khó thở quá', 'Tôi đang bị sốt', 'Tôi bị đau họng'] },
      { id: 2, text: 'Tôi hay bị đau nhức đầu', isMe: true, time: '20:46' },
      { id: 3, text: 'Bạn bị đau đầu vùng nào?', isMe: false, time: '20:46', suggestions: ['Nửa đầu', 'Cả đầu', 'Sau gáy'] },
      { id: 4, text: 'Đau nửa đầu bên phải', isMe: true, time: '20:48' },
      { id: 5, text: 'Hiện bạn có đang dùng thuốc gì không?', isMe: false, time: '20:49', suggestions: ['Không', 'Có dùng thuốc OTC', 'Có đơn thuốc bác sĩ'] }
    ]
  },
  {
    id: 2, title: 'Khó thở', level: 'Khẩn cấp', levelColor: 'bg-red-100 text-red-700', lastMsg: 'Bạn có cảm thấy tức ngực...', time: '20:49', status: 'active',
    messages: [
      { id: 1, text: 'Chào bạn, tôi là Trợ lý AI. Bạn đang gặp triệu chứng gì?', isMe: false, time: '20:45', suggestions: ['Tôi hay bị đau nhức đầu', 'Tôi thấy khó thở quá', 'Tôi đang bị sốt', 'Tôi bị đau họng'] },
      { id: 2, text: 'Tôi thấy khó thở quá', isMe: true, time: '20:46' },
      { id: 3, text: 'Bạn có cảm thấy tức ngực hay nhói ở tim không?', isMe: false, time: '20:46', suggestions: ['Có đau tức ngực', 'Chỉ khó thở'] }
    ]
  },
  {
    id: 3, title: 'Sốt', level: 'Theo dõi', levelColor: 'bg-amber-100 text-amber-700', lastMsg: 'Nhiệt độ hiện tại...', time: '20:49', status: 'active',
    messages: [
      { id: 1, text: 'Chào bạn, tôi là Trợ lý AI. Bạn đang gặp triệu chứng gì?', isMe: false, time: '20:45', suggestions: ['Tôi hay bị đau nhức đầu', 'Tôi thấy khó thở quá', 'Tôi đang bị sốt', 'Tôi bị đau họng'] },
      { id: 2, text: 'Tôi đang bị sốt', isMe: true, time: '20:46' },
      { id: 3, text: 'Nhiệt độ hiện tại của bạn là bao nhiêu?', isMe: false, time: '20:46', suggestions: ['37.5 - 38.5 độ', 'Trên 38.5 độ'] }
    ]
  },
  {
    id: 4, title: 'Ho, đau họng', level: 'Nhẹ', levelColor: 'bg-green-100 text-green-700', lastMsg: 'Phiên tư vấn đã kết thúc', time: '20/05/2026', status: 'ended',
    messages: [
      { id: 1, text: 'Chào bạn, tôi là Trợ lý AI. Bạn đang gặp triệu chứng gì?', isMe: false, time: '10:00', suggestions: ['Tôi hay bị đau nhức đầu', 'Tôi thấy khó thở quá', 'Tôi đang bị sốt', 'Tôi bị đau họng'] },
      { id: 2, text: 'Tôi bị đau họng', isMe: true, time: '10:05' },
      { id: 3, text: 'Đánh giá AI', isMe: false, time: '10:05', result: { level: 'BÌNH THƯỜNG', color: 'bg-green-100 text-green-700', desc: 'Các triệu chứng của bạn phù hợp với viêm họng thông thường.', spec: 'Tai Mũi Họng' } }
    ]
  }
];

export default function PatientChatbot() {
  const [sessions, setSessions] = useState<any[]>(INITIAL_SESSIONS);
  const [activeSessionId, setActiveSessionId] = useState(1);
  const [msgInput, setMsgInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctorForModal, setSelectedDoctorForModal] = useState<{name: string, spec: string, bg: string} | undefined>(undefined);
  const [noteText, setNoteText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilter, setShowFilter] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const severityRef = useRef({ level: 'Chưa xác định (Cần thêm thông tin)', color: 'bg-slate-100 text-slate-700 border-slate-300' });

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];
  const messages = activeSession.messages;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, activeSessionId]);

  const getBotResponse = (text: string, msgCount: number = 0) => {
    const lower = text.toLowerCase();
    
    // Custom handling for sưng/đau buốt ở bộ phận nhạy cảm (based on user test)
    if (lower.includes('sưng') || lower.includes('đau buốt') || lower.includes('mẩn đỏ') || lower.includes('buồi') || lower.includes('cu') || lower.includes('dương vật') || lower.includes('bộ phận sinh dục')) {
      return {
        text: 'Tình trạng sưng tấy hoặc đau buốt ở bộ phận nhạy cảm có thể do viêm nhiễm hoặc kích ứng. Bạn có thấy đau rát khi đi tiểu hay có dịch lạ không?',
        suggestions: ['Có đau buốt khi đi tiểu', 'Chỉ sưng tấy, không đau rát', 'Tôi muốn đặt lịch khám Nam khoa']
      };
    }
    if (lower.includes('tiểu') || lower.includes('đi tiểu') || lower.includes('dịch lạ')) {
      return {
        text: 'Triệu chứng này cần được bác sĩ chuyên khoa Nam học / Tiết niệu thăm khám để chẩn đoán chính xác. Bạn có muốn đặt lịch hẹn khám trực tiếp không?',
        suggestions: ['Tôi muốn đặt lịch khám', 'Bác sĩ Nam khoa nào tốt?']
      };
    }
    if (lower.includes('nam khoa')) {
      return {
        text: 'Dưới đây là bác sĩ chuyên khoa phù hợp để tư vấn cho bạn:',
        type: 'doctors',
        doctors: [
          { name: 'BS. Phạm Văn Đức', spec: 'Nội tổng hợp / Nam khoa', bg: 'bg-green-100' }
        ],
        suggestions: ['Ok, đặt lịch khám ngay', 'Cảm ơn AI']
      };
    }

    // KỊCH BẢN 1
    if (lower.includes('xin chào trợ lý')) return { text: 'Chào bạn! Hãy mô tả chi tiết triệu chứng bạn đang gặp phải để tôi tư vấn nhé.', suggestions: ['Hôm qua tôi đi ăn buffet hải sản xong thì bị đau bụng'] };
    if (lower.includes('buffet') || lower.includes('hải sản') || lower.includes('đau bụng')) {
      return { text: 'Đau ở vùng nào của bụng vậy bạn (trên rốn, dưới rốn, hay bên phải)? Có kèm theo tiêu chảy hay nôn mửa không?', suggestions: ['Tôi đau râm ran quanh rốn'] };
    }
    if (lower.includes('quanh rốn') || lower.includes('râm ran')) {
      return { text: 'Tôi hiểu sự bất tiện này. Dựa trên mô tả, tình trạng của bạn cần được bác sĩ đánh giá trực tiếp. Bạn có muốn xem danh sách bác sĩ để đặt khám không?', suggestions: ['Vậy tôi có cần uống thuốc gì không?'] };
    }
    if (lower.includes('uống thuốc gì không')) {
      return { text: 'Dạ, tôi đã ghi nhận thông tin. Để tư vấn chính xác hơn, bạn có thể nói chi tiết hơn về mức độ khó chịu được không?', suggestions: ['Tôi đi ngoài vẫn bình thường, không nôn mửa'] };
    }
    if (lower.includes('đi ngoài vẫn bình thường') || lower.includes('không nôn mửa')) {
      return { text: 'Vậy thì tạm thời bạn đừng quá lo lắng. Hãy nghỉ ngơi, uống đủ nước và tiếp tục theo dõi thêm. Nếu triệu chứng trở nặng, hãy quay lại đây nhé.', suggestions: ['Ok, tình trạng này cũng mới xuất hiện sáng nay thôi'] };
    }
    if (lower.includes('sáng nay thôi')) {
      return { text: 'Cảm ơn bạn đã cung cấp thời gian. Tình trạng này có làm ảnh hưởng nhiều đến giấc ngủ hay sinh hoạt của bạn không?', suggestions: ['Chỉ hơi khó chịu một xíu, chưa mệt lắm'] };
    }
    if (lower.includes('chưa mệt lắm') || lower.includes('hơi khó chịu')) {
      return { text: 'Vậy thì tạm thời bạn đừng quá lo lắng. Hãy nghỉ ngơi, uống đủ nước và tiếp tục theo dõi thêm.', suggestions: ['Cho tôi hỏi khám tiêu hóa thì gặp ai?'] };
    }
    if (lower.includes('khám tiêu hóa')) {
      return {
        text: 'Dựa trên nhu cầu của bạn, tôi đề xuất một số bác sĩ chuyên khoa phù hợp dưới đây. Bạn có thể đặt lịch hẹn trực tiếp:',
        type: 'doctors',
        doctors: [
          { name: 'BS. Phạm Văn Đức', spec: 'Nội tổng hợp', bg: 'bg-green-100' },
          { name: 'BS. Trần Minh Tuấn', spec: 'Ngoại tiêu hóa', bg: 'bg-slate-100' }
        ],
        suggestions: ['Ok, cảm ơn AI nhiều nhé']
      };
    }
    if (lower.includes('cảm ơn ai nhiều nhé')) return { text: 'Không có chi! Chúc bạn thật nhiều sức khỏe. Dựa trên các thông tin bạn cung cấp, hệ thống AI đã đánh giá sơ bộ mức độ triệu chứng của bạn:', suggestions: ['Tư vấn triệu chứng khác', 'Đặt lịch hẹn'], severity: { level: 'Nhẹ (Có thể tự theo dõi ở nhà)', color: 'bg-green-100 text-green-700 border-green-300' } };
    
    // KỊCH BẢN 2
    if (lower.includes('hello ai')) return { text: 'Chào bạn! Hãy mô tả chi tiết triệu chứng bạn đang gặp phải để tôi tư vấn nhé.', suggestions: ['Tôi bị chóng mặt xây xẩm', 'Tôi bị sốt', 'Tôi bị ho, đau họng'] };
    if (lower.includes('chóng mặt xây xẩm')) return { text: 'Bạn bị triệu chứng này lâu chưa? Có kèm theo buồn nôn hay nhạy cảm với ánh sáng không? Nếu đau dữ dội, bạn nên đặt lịch khám chuyên khoa Thần kinh nhé.', suggestions: ['Từ chiều hôm qua', 'Mới xuất hiện sáng nay', 'Bị vài ngày rồi'] };
    if (lower.includes('chiều hôm qua')) return { text: 'Cảm ơn bạn đã cung cấp thời gian. Tình trạng này có làm ảnh hưởng nhiều đến giấc ngủ hay sinh hoạt của bạn không?', suggestions: ['Rất mệt mỏi không làm được gì', 'Chỉ hơi khó chịu', 'Bình thường'] };
    if (lower.includes('rất mệt mỏi không làm được gì')) return { text: 'Tôi hiểu sự bất tiện này. Dựa trên mô tả, tình trạng của bạn cần được bác sĩ đánh giá trực tiếp. Bạn có muốn xem danh sách bác sĩ để đặt khám không?', suggestions: ['Tôi muốn đặt lịch khám', 'Bác sĩ thần kinh không?'] };
    if (lower.includes('hơi ớn lạnh')) return { text: 'Nhiệt độ hiện tại của bạn là bao nhiêu? Bạn nên uống nhiều nước, mặc đồ thoáng mát và có thể dùng Paracetamol nếu sốt trên 38.5°C.', suggestions: ['Chưa dùng loại thuốc nào', 'Đã uống Paracetamol'] };
    if (lower.includes('điều hòa nhiều')) return { text: 'Bạn có đang sử dụng loại thuốc nào để điều trị triệu chứng này không?', suggestions: ['Chưa dùng loại thuốc nào', 'Đang uống thuốc'] };
    if (lower.includes('chưa dùng loại thuốc nào')) return { text: 'Vậy thì tạm thời bạn đừng quá lo lắng. Hãy nghỉ ngơi, uống đủ nước và tiếp tục theo dõi thêm. Nếu triệu chứng trở nặng, hãy quay lại đây nhé.', suggestions: ['Cám ơn bạn đã gợi ý', 'Tôi muốn khám trực tiếp'] };
    if (lower.includes('bác sĩ thần kinh không')) return { 
      text: 'Dựa trên nhu cầu của bạn, tôi đề xuất một số bác sĩ chuyên khoa phù hợp dưới đây. Bạn có thể đặt lịch hẹn trực tiếp:', 
      type: 'doctors', doctors: [ { name: 'BS. Ezra Belcher', spec: 'Ngoại thần kinh', bg: 'bg-red-300' } ],
      suggestions: ['Cám ơn bạn đã gợi ý']
    };
    if (lower.includes('cám ơn bạn đã gợi ý')) return { text: 'Không có chi! Chúc bạn thật nhiều sức khỏe. Dựa trên các thông tin bạn cung cấp, hệ thống AI đã đánh giá sơ bộ mức độ triệu chứng của bạn:', suggestions: ['Tư vấn triệu chứng khác', 'Đặt lịch hẹn'], severity: { level: 'Trung bình (Cần theo dõi thêm)', color: 'bg-amber-100 text-amber-700 border-amber-300' } };

    // KỊCH BẢN 3
    if (lower === 'hi') return { text: 'Chào bạn! Hãy mô tả chi tiết triệu chứng bạn đang gặp phải để tôi tư vấn nhé.', suggestions: ['Tôi có một vấn đề về sức khỏe', 'Tôi muốn đặt lịch hẹn'] };
    if (lower.includes('có một vấn đề về sức khỏe')) return { text: 'Bạn có thể mô tả chi tiết hơn về vấn đề sức khỏe mà bạn đang gặp phải không?', suggestions: ['Tôi bị nhức đầu kinh khủng', 'Tôi bị đau bụng dữ dội'] };
    if (lower.includes('nhức đầu kinh khủng')) return { text: 'Bạn bị triệu chứng này lâu chưa? Có kèm theo buồn nôn hay nhạy cảm với ánh sáng không? Nếu đau dữ dội, bạn nên đặt lịch khám chuyên khoa Thần kinh nhé.', suggestions: ['Nó đau lắm', 'Hơi đau thôi'] };
    if (lower.includes('nó đau lắm')) return { text: 'Tôi hiểu sự bất tiện này. Dựa trên mô tả, tình trạng của bạn cần được bác sĩ đánh giá trực tiếp. Bạn có muốn xem danh sách bác sĩ để đặt khám không?', suggestions: ['Mắt tôi mờ đi', 'Tôi muốn đặt lịch khám'] };
    if (lower.includes('mắt tôi mờ đi')) return { text: 'Ngoài ra bạn còn cảm thấy đau hay khó chịu ở bộ phận nào khác không?', suggestions: ['Muốn đặt lịch khám', 'Tôi sợ bị đột quỵ'] };
    if (lower.includes('muốn đặt lịch khám')) return { 
      text: 'Dựa trên nhu cầu của bạn, tôi đề xuất một số bác sĩ chuyên khoa phù hợp dưới đây. Bạn có thể đặt lịch hẹn trực tiếp:', 
      type: 'doctors', doctors: [ { name: 'BS. Ezra Belcher', spec: 'Ngoại thần kinh', bg: 'bg-red-300' } ],
      suggestions: ['Đặt hẹn BS. Ezra Belcher']
    };
    if (lower.includes('bị đột quỵ')) return { text: '⚠️ CẢNH BÁO: Từ khóa khẩn cấp được nhận diện! Vui lòng gọi ngay cho số Cấp cứu 115 hoặc nhờ người nhà đưa đến Cơ sở Y tế gần nhất ngay lập tức.', suggestions: ['Tôi sẽ gọi cấp cứu', 'Đã đỡ hơn rồi'], severity: { level: 'Khẩn cấp (Cần gọi 115 ngay)', color: 'bg-red-100 text-red-700 border-red-300' } };
    if (lower.includes('tôi sẽ gọi cấp cứu')) return { text: '⚠️ CẢNH BÁO: Đội cấp cứu 115 đã được thông báo. Vui lòng giữ máy hoặc chờ liên hệ.', suggestions: ['Dạ cảm ơn'], severity: { level: 'Khẩn cấp (Cần gọi 115 ngay)', color: 'bg-red-100 text-red-700 border-red-300' } };
    if (lower.includes('dạ cảm ơn')) return { text: 'Không có chi! Chúc bạn thật nhiều sức khỏe. Dựa trên các thông tin bạn cung cấp, hệ thống AI đã đánh giá sơ bộ mức độ triệu chứng của bạn:', suggestions: ['Tư vấn triệu chứng khác'], severity: { level: 'Khẩn cấp (Cần gọi 115 ngay)', color: 'bg-red-100 text-red-700 border-red-300' } };
    if (lower.includes('chưa chết')) return { text: '⚠️ CẢNH BÁO: Từ khóa khẩn cấp được nhận diện! Vui lòng gọi ngay cho số Cấp cứu 115 hoặc nhờ người nhà đưa đến Cơ sở Y tế gần nhất ngay lập tức.', suggestions: ['Tôi sẽ gọi cấp cứu'], severity: { level: 'Khẩn cấp (Cần gọi 115 ngay)', color: 'bg-red-100 text-red-700 border-red-300' } };

    const FALLBACK_RESPONSES = [
      "Dạ, tôi đã ghi nhận thông tin. Để tư vấn chính xác hơn, bạn có thể nói chi tiết hơn về mức độ khó chịu được không?",
      "Tôi hiểu rồi. Bạn có cảm giác đau buốt, sưng tấy hay có triệu chứng nào khác kèm theo không?",
      "Thông tin này rất hữu ích. Bạn bị tình trạng này lâu chưa, và có tự dùng thuốc gì ở nhà chưa ạ?",
      "Để hỗ trợ tốt nhất, bạn có muốn tôi kết nối với Bác sĩ chuyên khoa tại phòng khám để tư vấn trực tiếp không?"
    ];
    const fallbackIndex = msgCount % FALLBACK_RESPONSES.length;

    return {
      text: FALLBACK_RESPONSES[fallbackIndex],
      suggestions: [
        ['Tôi bị đau đầu', 'Tôi bị sốt', 'Tôi bị khó thở'],
        ['Tôi muốn xem bác sĩ', 'Tôi cần tư vấn thêm', 'Cảm ơn AI'],
        ['Có đau nhức', 'Không đau nhức', 'Tư vấn triệu chứng khác'],
        ['Đặt lịch khám ngay', 'Tôi tự theo dõi thêm']
      ][fallbackIndex % 4]
    };
  };

  const handleSend = (overrideText?: string) => {
    if (isTyping) return;
    const textToSend = overrideText || msgInput;
    if (!textToSend.trim()) return;

    if (activeSession.status === 'ended') return;

    const userMsg = { id: Date.now(), text: textToSend, isMe: true, time: 'Vừa xong' };

    const updatedSessions = [...sessions];
    const sessionIdx = updatedSessions.findIndex(s => s.id === activeSessionId);
    if (sessionIdx === -1) return;
    
    const updatedSession = { ...updatedSessions[sessionIdx] };
    updatedSession.messages = [...updatedSession.messages, userMsg];
    updatedSession.lastMsg = textToSend;

    // Auto-detect title if it's a new session
    if (updatedSession.title === 'Tư vấn mới' && textToSend.split(' ').length <= 5) {
      updatedSession.title = textToSend;
    }

    const currentMsgCount = updatedSession.messages.length;
    updatedSessions[sessionIdx] = updatedSession;

    setSessions(updatedSessions);
    setMsgInput('');
    setIsTyping(true);
    inputRef.current?.focus();

    setTimeout(() => {
      const response = getBotResponse(textToSend, currentMsgCount);
      setSessions(prevSessions => {
        return prevSessions.map(s => {
          if (s.id === activeSessionId) {
            const botMsg = {
              id: Date.now() + 1,
              text: response.text,
              suggestions: response.suggestions,
              type: response.type,
              doctors: response.doctors,
              severity: (response as any).severity,
              isMe: false,
              time: 'Vừa xong'
            };
            
            const updatedMessages = [...s.messages, botMsg];
            
            let updatedLevel = s.level;
            let updatedLevelColor = s.levelColor;
            let updatedStatus = s.status;
            
            if ((response as any).severity) {
              const sev = (response as any).severity;
              updatedLevel = sev.level.split(' (')[0];
              updatedLevelColor = sev.color.split(' ').filter((c: string) => !c.includes('border')).join(' ');
            }
            
            if (textToSend.toLowerCase().includes('kết thúc tư vấn')) {
              updatedStatus = 'ended';
            }
            
            return {
              ...s,
              messages: updatedMessages,
              lastMsg: botMsg.text,
              level: updatedLevel,
              levelColor: updatedLevelColor,
              status: updatedStatus
            };
          }
          return s;
        });
      });
      setIsTyping(false);
    }, 1200);
  };

  const createNewSession = () => {
    const newId = Date.now();
    severityRef.current = { level: 'Chưa xác định (Cần thêm thông tin)', color: 'bg-slate-100 text-slate-700 border-slate-300' };
    const newSession = {
      id: newId,
      title: 'Tư vấn mới',
      level: 'Đang xử lý',
      levelColor: 'bg-blue-100 text-blue-700',
      lastMsg: 'Xin chào bạn, tôi là...',
      time: 'Vừa xong',
      status: 'active',
      messages: [
        { id: 1, text: 'Xin chào! Tôi là Trợ lý Y tế AI. Bạn đang gặp vấn đề gì về sức khỏe?', isMe: false, time: 'Vừa xong', suggestions: ['Xin chào trợ lý', 'Hello AI', 'Hi'] }
      ]
    };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newId);
  };

  return (
    <div className="flex-1 flex h-[calc(100vh-80px)] overflow-hidden bg-slate-50">
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

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Left Sidebar (Sessions) */}
      <div className="w-[340px] shrink-0 border-r border-slate-200 bg-white flex flex-col z-10 shadow-[2px_0_10px_rgba(0,0,0,0.02)]">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-800 text-[16px]">Phiên tư vấn</h2>
            <div className="relative">
              <button 
                onClick={() => setShowFilter(!showFilter)}
                className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors shadow-sm ${
                  filterStatus !== 'all' 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-600'
                }`}
              >
                <Funnel size={16} weight="bold" />
              </button>
              {showFilter && (
                <div className="absolute right-0 top-10 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1.5 w-44">
                  {[
                    { label: 'Tất cả', value: 'all' },
                    { label: 'Khẩn cấp', value: 'khẩn cấp' },
                    { label: 'Nặng', value: 'nặng' },
                    { label: 'Theo dõi', value: 'theo dõi' },
                    { label: 'Nhẹ', value: 'nhẹ' },
                    { label: 'Đang xử lý', value: 'đang xử lý' },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => { setFilterStatus(opt.value); setShowFilter(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 transition-colors ${
                        filterStatus === opt.value ? 'text-blue-700 font-bold bg-blue-50' : 'text-slate-700'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <button onClick={createNewSession} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-colors shadow-sm shadow-blue-200">
            <Plus size={18} weight="bold" /> Tư vấn mới
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide py-2">
          {sessions
            .filter(s => filterStatus === 'all' || s.level.toLowerCase().includes(filterStatus))
            .map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSessionId(s.id)}
              className={`w-full px-4 py-3.5 flex flex-col text-left transition-all relative ${activeSessionId === s.id
                  ? 'bg-blue-50/80 border-l-4 border-blue-600'
                  : 'border-l-4 border-transparent hover:bg-slate-50'
                }`}
            >
              <div className="flex justify-between items-center mb-1.5 w-full">
                <span className={`font-bold text-[14px] truncate flex-1 pr-2 ${activeSessionId === s.id ? 'text-blue-800' : 'text-slate-700'}`}>{s.title}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold shrink-0 ${s.levelColor}`}>{s.level}</span>
              </div>
              <div className="flex justify-between w-full items-center">
                <p className={`text-[13px] truncate flex-1 pr-3 ${activeSessionId === s.id ? 'text-blue-600/80 font-medium' : 'text-slate-500'}`}>{s.lastMsg}</p>
                <span className={`text-[11px] shrink-0 font-medium ${activeSessionId === s.id ? 'text-blue-600/60' : 'text-slate-400'}`}>{s.time}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Column */}
      <div className="flex-1 flex flex-col bg-[#F9FBFC] relative">
        {/* Header */}
        <header className="h-[76px] shrink-0 border-b border-slate-200 bg-white px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-50 text-blue-600 shadow-inner border border-blue-100">
              <Robot size={24} weight="fill" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-[16px] flex items-center gap-1.5">
                Trợ lý AI <Sparkle size={16} className="text-blue-500" weight="fill" />
              </h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[13px] text-slate-500 font-medium">Đang hoạt động</span>
              </div>
            </div>
          </div>
        </header>

        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
          {messages.map((msg: any) => (
            <div key={msg.id} className={`flex flex-col max-w-[75%] ${Date.now() - msg.id < 1000 ? 'animate-slide-up' : ''} ${msg.isMe ? 'self-end' : 'self-start'}`}>

              {!msg.result && (
                <div className={`px-5 py-3 rounded-2xl text-[15px] ${msg.isMe ? 'bg-blue-600 text-white rounded-tr-sm shadow-sm' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm leading-relaxed'}`}>
                  {msg.text}
                </div>
              )}

              {msg.type === 'doctors' && msg.doctors && (
                <div className="mt-2 flex flex-col gap-2 w-full animate-slide-up">
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
                        onClick={() => {
                          setSelectedDoctorForModal(doc);
                          setIsModalOpen(true);
                        }} 
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

              {msg.result && (
                <div className="mt-1 bg-white border border-slate-200 rounded-xl p-5 w-full shadow-sm animate-slide-up">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle size={20} className={msg.result.color.includes('red') ? 'text-red-500' : msg.result.color.includes('amber') ? 'text-amber-500' : 'text-emerald-500'} weight="fill" />
                    <span className="font-bold text-slate-800 text-[15px]">Kết quả sàng lọc AI</span>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded font-bold uppercase tracking-wider ${msg.result.color}`}>Mức độ: {msg.result.level}</span>
                  </div>
                  <p className="text-[14px] text-slate-600 mb-4 leading-relaxed">{msg.result.desc}</p>
                  <div className="text-slate-500 flex items-center gap-1 mb-5 text-[13px] border-t border-slate-100 pt-3">
                    Chuyên khoa đề xuất: <span className="font-bold text-slate-700 cursor-pointer hover:text-blue-600 transition-colors flex items-center">{msg.result.spec} <CaretRight size={12} weight="bold" className="ml-0.5" /></span>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => {
                      setSelectedDoctorForModal(undefined);
                      setIsModalOpen(true);
                    }} className="flex-1 flex justify-center items-center gap-1.5 px-4 py-2 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 font-bold text-slate-700 transition-colors text-[14px] shadow-sm">
                      <CalendarBlank size={18} weight="bold" /> Đặt lịch hẹn
                    </button>
                    <button className="flex-1 flex justify-center items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors text-[14px] shadow-sm shadow-blue-200">
                      Kết nối Bác sĩ
                    </button>
                  </div>
                </div>
              )}

              {msg.suggestions && msg.suggestions.length > 0 && !isTyping && msg.id === messages[messages.length - 1].id && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {msg.suggestions.map((sug: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(sug)}
                      className="px-4 py-2 bg-blue-50/50 border border-blue-100 text-blue-700 text-[13px] font-semibold rounded-full hover:bg-blue-100 hover:border-blue-200 transition-colors shadow-sm"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              )}

              <span className={`text-[11px] text-slate-400 mt-1.5 font-medium ${msg.isMe ? 'text-right pr-1' : 'text-left pl-1'}`}>
                {msg.time}
              </span>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex flex-col max-w-[75%] self-start animate-slide-up">
              <div className="px-5 py-4 rounded-2xl bg-white border border-slate-200 text-slate-500 rounded-tl-sm flex gap-1 items-center shadow-sm">
                <div className="w-2 h-2 rounded-full bg-slate-300 typing-dot"></div>
                <div className="w-2 h-2 rounded-full bg-slate-300 typing-dot"></div>
                <div className="w-2 h-2 rounded-full bg-slate-300 typing-dot"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-200 shrink-0 relative z-10">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <div className="flex-1 flex items-center bg-slate-100 rounded-full px-2 py-1.5 border border-slate-200 focus-within:border-blue-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <input
                ref={inputRef}
                type="text"
                value={msgInput}
                disabled={activeSession.status === 'ended' || isTyping}
                placeholder={activeSession.status === 'ended' ? "Phiên tư vấn này đã kết thúc..." : "Nhập triệu chứng của bạn để AI tư vấn..."}
                onChange={e => setMsgInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                className="flex-1 bg-transparent border-none outline-none px-3 text-[15px] text-slate-700 placeholder-slate-400 disabled:opacity-60"
              />
            </div>
            <button
              onClick={() => handleSend()}
              disabled={!msgInput.trim() || activeSession.status === 'ended' || isTyping}
              className="w-[44px] h-[44px] rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white flex items-center justify-center shrink-0 shadow-sm transition-colors"
            >
              <PaperPlaneRight size={20} weight="fill" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Column (Notes & Booking Exact UI) */}
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
              <p className="text-xs text-slate-500">Đặt một lịch hẹn với bác sĩ.</p>
            </div>
            <button
              onClick={() => {
                setSelectedDoctorForModal(undefined);
                setIsModalOpen(true);
              }}
              className="w-full py-2.5 mt-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-sm text-sm"
            >
              Đặt lịch khám ngay
            </button>
          </div>
        </div>
      </div>

      <NewAppointmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialDoctor={selectedDoctorForModal} />
    </div>
  );
}
