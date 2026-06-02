import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  CheckCircle, WarningCircle, Sparkle, User, Stethoscope, 
  FileText, ArrowRight, Pill, Drop, Heartbeat, CaretLeft
} from '@phosphor-icons/react';

const CLINICAL_TESTS = [
  'Đo điện tâm đồ (ECG)',
  'Siêu âm tim',
  'Xét nghiệm men tim (Troponin T/I)',
  'Xét nghiệm máu tổng quát',
  'Chụp X-quang phổi',
  'Siêu âm ổ bụng'
];

const MedicalExamination = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const aiData = location.state;
  
  const [showToast, setShowToast] = useState(false);
  const [reason, setReason] = useState('');
  const [selectedTests, setSelectedTests] = useState<string[]>([]);

  const patient = aiData?.patient || {
    name: 'Bệnh nhân chưa xác định',
    age: '--',
    gender: '--',
    bloodType: '--',
    avatarBg: 'bg-slate-200'
  };

  useEffect(() => {
    if (aiData?.autoFill) {
      setReason(aiData.reason || '');
      setSelectedTests(aiData.recommendations || []);
      setShowToast(true);
      
      const timer = setTimeout(() => setShowToast(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [aiData]);

  const toggleTest = (test: string) => {
    setSelectedTests(prev => 
      prev.includes(test) ? prev.filter(t => t !== test) : [...prev, test]
    );
  };

  return (
    <div className="h-full flex flex-col relative">
      
      {/* ── Toast Notification ─────────────────────────────────────────────── */}
      {showToast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="bg-emerald-500 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3">
            <CheckCircle size={20} weight="fill" />
            <span className="font-semibold text-sm">Đã điền tự động dữ liệu từ Trợ lý AI</span>
          </div>
        </div>
      )}

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all hover:shadow-md active:scale-90"
        >
          <CaretLeft size={16} weight="bold" />
        </button>
        <h1 className="text-xl font-bold text-slate-900">Phiếu khám bệnh</h1>
      </div>

      <div className="flex-1 flex gap-6 min-h-0 overflow-hidden">
        
        {/* ── Left: Main Form ──────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto pr-2 pb-6 flex flex-col gap-6">
          
          {/* Section: Reason & History */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <FileText size={20} className="text-blue-500" />
                Lý do khám & Tiền sử bệnh
              </h2>
              {aiData?.autoFill && (
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-100">
                  <Sparkle size={12} weight="fill" />
                  Dữ liệu từ Trợ lý AI
                </span>
              )}
            </div>
            <textarea 
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Nhập lý do khám và mô tả triệu chứng..."
              className={`w-full h-32 p-4 rounded-xl text-sm leading-relaxed border outline-none transition-colors resize-none
                ${aiData?.autoFill ? 'border-emerald-200 bg-emerald-50/30 focus:border-emerald-400' : 'border-slate-200 bg-slate-50 focus:border-blue-400'}`}
            />
          </div>

          {/* Section: Vital Signs */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2 mb-4">
              <Heartbeat size={20} className="text-rose-500" />
              Chỉ số sinh tồn
            </h2>
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500">Mạch (lần/phút)</label>
                <input type="text" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold outline-none focus:border-blue-500" defaultValue="85" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500">Nhiệt độ (°C)</label>
                <input type="text" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold outline-none focus:border-blue-500" defaultValue="37.2" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500">Huyết áp (mmHg)</label>
                <input type="text" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold outline-none focus:border-blue-500" defaultValue="140/90" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500">SpO2 (%)</label>
                <input type="text" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold outline-none focus:border-blue-500" defaultValue="98" />
              </div>
            </div>
          </div>

          {/* Section: Clinical Tests */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <Stethoscope size={20} className="text-indigo-500" />
                Chỉ định cận lâm sàng
              </h2>
              {aiData?.autoFill && (
                <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full border border-indigo-100">
                  <Sparkle size={12} weight="fill" />
                  Gợi ý từ Trợ lý AI
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {CLINICAL_TESTS.map(test => {
                const isSelected = selectedTests.includes(test);
                const isAIRecommended = aiData?.recommendations?.includes(test);
                
                return (
                  <label 
                    key={test}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all
                      ${isSelected 
                        ? (isAIRecommended ? 'border-indigo-500 bg-indigo-50' : 'border-blue-500 bg-blue-50') 
                        : 'border-slate-200 hover:border-slate-300'}`}
                  >
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 focus:ring-2"
                      checked={isSelected}
                      onChange={() => toggleTest(test)}
                    />
                    <span className={`text-sm font-semibold select-none ${isSelected ? 'text-slate-900' : 'text-slate-600'}`}>
                      {test}
                    </span>
                    {isAIRecommended && (
                      <Sparkle size={12} className="ml-auto text-indigo-500" weight="fill" />
                    )}
                  </label>
                );
              })}
            </div>
          </div>

        </div>

        {/* ── Right: Patient Profile & Actions ─────────────────────────────── */}
        <div className="w-[300px] shrink-0 flex flex-col gap-6">
          
          {/* Patient Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col items-center text-center">
            <div className={`w-20 h-20 rounded-full ${patient.avatarBg} flex items-center justify-center mb-4 shadow-sm`}>
              <span className="text-2xl font-bold text-slate-700">{patient.name.split(' ').pop()}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">{patient.name}</h3>
            <p className="text-sm text-slate-500 mt-1">{patient.age} tuổi · {patient.gender}</p>
            
            <div className="w-full grid grid-cols-2 gap-3 mt-6">
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <Drop size={16} className="text-red-500 mx-auto mb-1" weight="fill" />
                <div className="text-[10px] text-slate-400 uppercase font-bold mb-0.5">Nhóm máu</div>
                <div className="font-bold text-slate-800">{patient.bloodType}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <WarningCircle size={16} className="text-amber-500 mx-auto mb-1" weight="fill" />
                <div className="text-[10px] text-slate-400 uppercase font-bold mb-0.5">Dị ứng</div>
                <div className="font-bold text-amber-600">Không</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col gap-3">
            <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all duration-300 hover:shadow-sm active:scale-95">
              <FileText size={16} />
              Xem bệnh án cũ
            </button>
            <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all duration-300 hover:shadow-sm active:scale-95">
              <Pill size={16} />
              Kê đơn thuốc
            </button>
            <div className="my-2 border-t border-slate-100" />
            <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 active:scale-95 active:translate-y-0">
              <CheckCircle size={18} weight="fill" />
              Kết thúc khám
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default MedicalExamination;
