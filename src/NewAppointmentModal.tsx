import React, { useState } from 'react';
import { X, CaretDown } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { saveAppointment } from './data/appointments';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialDoctor?: { name: string, spec: string, bg: string };
}

const DOCTORS = [
  { id: '1', name: 'BS. Alberto Ripley', spec: 'Tim mạch', bg: 'bg-indigo-200' },
  { id: '2', name: 'BS. Susan Babin', spec: 'Chỉnh hình', bg: 'bg-red-300' },
  { id: '3', name: 'BS. Carol Lam', spec: 'Nhi khoa', bg: 'bg-blue-300' },
  { id: '4', name: 'BS. Marsha Noland', spec: 'Phụ khoa', bg: 'bg-yellow-400' },
  { id: '5', name: 'BS. Ezra Belcher', spec: 'Ngoại thần kinh', bg: 'bg-red-300' },
  { id: '6', name: 'BS. Glen Lentz', spec: 'Ung bướu', bg: 'bg-teal-400' },
  { id: '7', name: 'BS. Bernard Griffith', spec: 'Hô hấp', bg: 'bg-indigo-200' },
  { id: '8', name: 'BS. John Elsass', spec: 'Tiết niệu', bg: 'bg-yellow-400' },
  { id: '9', name: 'BS. John Albert', spec: 'Tim mạch', bg: 'bg-blue-200' },
  { id: '10', name: 'BS. Robert Fox', spec: 'Nội tiết', bg: 'bg-pink-300' },
  { id: '11', name: 'BS. Kristin Watson', spec: 'Tai mũi họng', bg: 'bg-purple-300' },
  { id: '12', name: 'BS. Ralph Edwards', spec: 'Da liễu', bg: 'bg-orange-300' },
  { id: '13', name: 'BS. Courtney Henry', spec: 'Nhãn khoa', bg: 'bg-green-300' },
  { id: '14', name: 'BS. Annette Black', spec: 'Nhi khoa', bg: 'bg-teal-300' },
  { id: '15', name: 'BS. Theresa Webb', spec: 'Tiêu hóa', bg: 'bg-cyan-300' },
  { id: '16', name: 'BS. Kathryn Murphy', spec: 'Thần kinh', bg: 'bg-rose-300' },
  { id: '17', name: 'BS. Darlene Robertson', spec: 'Tâm thần', bg: 'bg-fuchsia-300' },
  { id: '18', name: 'BS. Arlene McCoy', spec: 'Xương khớp', bg: 'bg-lime-300' },
  { id: '19', name: 'BS. Eleanor Pena', spec: 'Tim mạch', bg: 'bg-indigo-300' },
  { id: '20', name: 'BS. Cody Fisher', spec: 'Nha khoa', bg: 'bg-emerald-300' },
];

export default function NewAppointmentModal({ isOpen, onClose, initialDoctor }: Props) {
  const navigate = useNavigate();
  
  const [docId, setDocId] = useState('');
  const [docSearch, setDocSearch] = useState('');
  const [isDocOpen, setIsDocOpen] = useState(false);
  const [type, setType] = useState('Trực tiếp');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  
  const [customDoc, setCustomDoc] = React.useState<{id: string, name: string, spec: string, bg: string} | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      if (initialDoctor) {
        const found = DOCTORS.find(d => d.name === initialDoctor.name);
        if (found) {
          setDocId(found.id);
        } else {
          setCustomDoc({ id: 'custom', name: initialDoctor.name, spec: initialDoctor.spec, bg: initialDoctor.bg });
          setDocId('custom');
        }
      } else {
        setDocId('');
      }
      setDate('');
      setTime('');
      setType('Trực tiếp');
      setDocSearch('');
    }
  }, [isOpen, initialDoctor]);

  const allDocs = customDoc ? [customDoc, ...DOCTORS.filter(d => d.name !== customDoc.name)] : DOCTORS;


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Find doc
    const doc = DOCTORS.find(d => d.id === docId);
    if (!doc || !date || !time) return; // Simple validation
    
    // Convert date format (e.g., 2025-06-03 to 03 Thg 6 2025)
    // For simplicity, just format it manually or keep it simple.
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = d.getMonth() + 1; // 1-12
    const year = d.getFullYear();
    // Convert time to SA/CH
    const [hStr, mStr] = time.split(':');
    const hour = parseInt(hStr, 10);
    const suffix = hour >= 12 ? 'CH' : 'SA';
    const hour12 = hour % 12 || 12;
    const formattedTime = `${String(hour12).padStart(2, '0')}:${mStr} ${suffix}`;

    const formattedDate = `${day} Thg ${month} ${year} - ${formattedTime}`;

    saveAppointment({
      date: formattedDate,
      doc: doc.name,
      spec: doc.spec,
      mode: type,
      status: 'Đang chờ',
      bg: doc.bg
    });

    onClose();
    navigate('/patient/schedule', { state: { newAppointmentSuccess: true } });
  };

  return (
    <div className={`fixed inset-0 z-[100] ${isOpen ? 'pointer-events-auto' : 'pointer-events-none delay-300'}`}>
      {/* Backdrop */}
      <div className={`fixed inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
      
      {/* Slide-over panel */}
      <div className={`fixed inset-y-0 right-0 w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">Đặt lịch khám mới</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} weight="bold" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
          {/* Appointment ID */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mã lịch khám <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              readOnly 
              value="AP234354" 
              className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg outline-none bg-slate-50 text-slate-500 cursor-not-allowed" 
            />
          </div>

          {/* Doctor */}
          <div className="relative">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Bác sĩ <span className="text-red-500">*</span></label>
            <div 
              onClick={() => setIsDocOpen(!isDocOpen)}
              className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-white flex items-center justify-between cursor-pointer hover:border-blue-500 transition-colors"
            >
              <div className="flex items-center gap-3">
                {docId ? (
                  <>
                    <div className={`w-6 h-6 rounded-full shrink-0 ${allDocs.find(d => d.id === docId)?.bg}`}></div>
                    <span className="text-slate-900 font-medium">{allDocs.find(d => d.id === docId)?.name}</span>
                  </>
                ) : (
                  <span className="text-slate-400">Chọn bác sĩ</span>
                )}
              </div>
              <CaretDown size={16} className="text-slate-400" />
            </div>

            {isDocOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsDocOpen(false)} />
                <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden flex flex-col">
                  <div className="p-2 border-b border-slate-100 bg-slate-50">
                    <input 
                      type="text" 
                      placeholder="Tìm kiếm bác sĩ..." 
                      value={docSearch}
                      onChange={(e) => setDocSearch(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md outline-none focus:border-blue-500 bg-white"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-[200px] overflow-y-auto">
                    {allDocs.filter(d => d.name.toLowerCase().includes(docSearch.toLowerCase())).map(d => (
                      <div 
                        key={d.id}
                        onClick={() => { setDocId(d.id); setIsDocOpen(false); }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-b-0 transition-colors"
                      >
                        <div className={`w-8 h-8 rounded-full shrink-0 ${d.bg}`}></div>
                        <div>
                          <div className="text-sm font-bold text-slate-900 leading-tight">{d.name}</div>
                          <div className="text-[11px] text-slate-500 font-medium">{d.spec}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Appointment Type */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Hình thức khám <span className="text-red-500">*</span></label>
            <select 
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 bg-white appearance-none"
            >
              <option value="Trực tiếp">Trực tiếp</option>
              <option value="Trực tuyến">Trực tuyến</option>
            </select>
          </div>

          {/* Date & Time */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Ngày khám <span className="text-red-500">*</span></label>
              <div className="relative">
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  onClick={(e) => {
                    const target = e.target as HTMLInputElement;
                    if (target.showPicker) target.showPicker();
                  }}
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 bg-white cursor-pointer" 
                  required
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Giờ khám <span className="text-red-500">*</span></label>
              <div className="relative">
                <input 
                  type="time" 
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  onClick={(e) => {
                    const target = e.target as HTMLInputElement;
                    if (target.showPicker) target.showPicker();
                  }}
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 bg-white cursor-pointer" 
                  required
                />
              </div>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Lý do khám</label>
            <textarea 
              rows={4}
              className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 bg-white resize-none" 
            />
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors bg-slate-100">
            Hủy bỏ
          </button>
          <button type="submit" onClick={handleSubmit} className="px-5 py-2.5 text-sm font-semibold text-white bg-[#2e37a4] hover:bg-[#252c85] rounded-lg transition-colors shadow-sm">
            Tạo lịch hẹn
          </button>
        </div>

      </div>
    </div>
  );
}
