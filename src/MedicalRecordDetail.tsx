import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CaretLeft, User, Printer, Heartbeat, ShieldWarning, HandPointing, CalendarBlank,
  Stethoscope, EyedropperSample, Pill, CheckCircle
} from '@phosphor-icons/react';
import { useToast } from './contexts/ToastContext';

const PATIENT_INFO = {
  id: 'p1',
  code: 'BN001',
  name: 'Phạm Văn Đức',
  gender: 'Nam',
  age: 55,
  bloodType: 'AB+',
  allergies: ['Penicillin', 'Hải sản'],
  chronicDiseases: ['Bệnh mạch vành (2018)', 'Tăng huyết áp']
};

const TIMELINE = [
  { id: 't1', date: '02/06/2026', diagnosis: 'Đau thắt ngực ổn định', doctor: 'BS. Lê Minh', isCurrent: true },
  { id: 't2', date: '15/04/2026', diagnosis: 'Kiểm tra mạch vành định kỳ', doctor: 'BS. Lê Minh', isCurrent: false },
  { id: 't3', date: '10/01/2026', diagnosis: 'Cơn tăng huyết áp', doctor: 'BS. Trần Hà', isCurrent: false }
];

const MedicalRecordDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'clinical' | 'lab' | 'prescription'>('clinical');
  const [activeRecord, setActiveRecord] = useState(TIMELINE[0]);
  const { showToast } = useToast();

  const [patients, setPatients] = useState(() => {
    const saved = localStorage.getItem('preclinic_patients');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const saved = localStorage.getItem('preclinic_patients');
    if (saved) {
      setPatients(JSON.parse(saved));
    }
  }, []);
  
  const currentPatient = patients.find((p: any) => p.id === id);
  const isExamining = currentPatient?.status === 'Đang khám';

  const handleFinishExam = () => {
    const updated = patients.map((p: any) => p.id === id ? { ...p, status: 'Đã khám' } : p);
    setPatients(updated);
    localStorage.setItem('preclinic_patients', JSON.stringify(updated));
  };

  const handlePrint = (type: string) => {
    showToast(`Đã xuất lệnh in ${type} thành công!`);
  };

  return (
    <div className="h-full flex flex-col gap-4">
      
      {/* ── Breadcrumb & Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/doctor/records')}
            className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors shadow-sm"
          >
            <CaretLeft size={16} weight="bold" />
          </button>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="hover:text-blue-600 cursor-pointer" onClick={() => navigate('/doctor/records')}>Hồ sơ bệnh án</span>
            <span>/</span>
            <span className="font-semibold text-slate-800">{currentPatient?.code || PATIENT_INFO.code} - {currentPatient?.name || PATIENT_INFO.name}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isExamining ? (
            <>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-colors shadow-sm active:scale-95">
                <Pill size={18} /> Kê đơn thuốc
              </button>
              <button onClick={handleFinishExam} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm active:scale-95">
                <CheckCircle size={18} /> Kết thúc khám
              </button>
            </>
          ) : (
            <button onClick={() => handlePrint('hồ sơ')} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm active:scale-95">
              <Printer size={18} /> In hồ sơ tổng hợp
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 flex gap-5 overflow-hidden">
        
        {/* ── LEFT SIDEBAR: PROFILE & TIMELINE ── */}
        <div className="w-[340px] flex flex-col gap-5 shrink-0 overflow-y-auto pb-4">
          
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center gap-4 mb-5 pb-5 border-b border-slate-100">
              <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                <User size={24} className="text-slate-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">{currentPatient?.name || PATIENT_INFO.name}</h2>
                <div className="text-sm text-slate-500 mt-1">
                  {currentPatient?.gender || PATIENT_INFO.gender} · {currentPatient?.age || PATIENT_INFO.age} tuổi · Nhóm máu {PATIENT_INFO.bloodType}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-bold text-rose-500 uppercase tracking-wider mb-2">
                  <ShieldWarning size={14} /> Dị ứng
                </div>
                <div className="flex flex-wrap gap-2">
                  {PATIENT_INFO.allergies.map(a => (
                    <span key={a} className="bg-rose-50 text-rose-700 px-2.5 py-1 rounded-md text-xs font-semibold border border-rose-100">
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-[11px] font-bold text-indigo-500 uppercase tracking-wider mb-2">
                  <Heartbeat size={14} /> Bệnh nền
                </div>
                <ul className="flex flex-col gap-1.5">
                  {PATIENT_INFO.chronicDiseases.map(d => (
                    <li key={d} className="flex items-start gap-2 text-sm text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-300 mt-1.5 shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex-1">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <CalendarBlank size={18} className="text-blue-600"/> Lịch sử khám bệnh
            </h3>
            
            <div className="relative pl-3 border-l-2 border-slate-100 flex flex-col gap-4">
              {TIMELINE.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => setActiveRecord(item)}
                  className={`relative pl-4 p-3 rounded-xl cursor-pointer transition-all border
                    ${activeRecord.id === item.id 
                      ? 'bg-blue-50 border-blue-200 shadow-sm' 
                      : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'}`}
                >
                  {/* Timeline dot */}
                  <div className={`absolute -left-[23px] top-4 w-3.5 h-3.5 rounded-full border-2 border-white
                    ${activeRecord.id === item.id ? 'bg-blue-600 ring-4 ring-blue-100' : 'bg-slate-300'}`} 
                  />
                  
                  <div className="text-xs font-bold text-blue-600 mb-1">{item.date}</div>
                  <div className="font-bold text-slate-800 text-sm mb-1">{item.diagnosis}</div>
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <HandPointing size={12} /> {item.doctor}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT CONTENT: TABS ── */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-200 bg-slate-50/50 shrink-0">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Chi tiết bệnh án</h2>
            <p className="text-sm text-slate-600 flex items-center gap-2">
              <CalendarBlank size={16}/> Ngày khám: <strong className="text-slate-800">{activeRecord.date}</strong> 
              <span className="text-slate-300">|</span> 
              Bác sĩ: <strong className="text-slate-800">{activeRecord.doctor}</strong>
            </p>
          </div>

          {/* Tabs Navigation */}
          <div className="flex px-6 border-b border-slate-200 shrink-0">
            <button 
              onClick={() => setActiveTab('clinical')}
              className={`py-4 px-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2
                ${activeTab === 'clinical' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              <Stethoscope size={18} weight={activeTab === 'clinical' ? 'fill' : 'regular'} /> Lâm sàng
            </button>
            <button 
              onClick={() => setActiveTab('lab')}
              className={`py-4 px-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2
                ${activeTab === 'lab' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              <EyedropperSample size={18} weight={activeTab === 'lab' ? 'fill' : 'regular'} /> Cận lâm sàng
            </button>
            <button 
              onClick={() => setActiveTab('prescription')}
              className={`py-4 px-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2
                ${activeTab === 'prescription' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              <Pill size={18} weight={activeTab === 'prescription' ? 'fill' : 'regular'} /> Đơn thuốc
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6">
            
            {/* CLINICAL TAB */}
            {activeTab === 'clinical' && (
              <div className="flex flex-col gap-6 max-w-3xl">
                <section>
                  <h3 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wide text-slate-500">1. Lý do khám</h3>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-700 leading-relaxed">
                    Đau tức ngực trái, lan ra sau lưng, đau từng cơn (5-10p). Khó thở khi gắng sức. Tình trạng này xuất hiện từ 2 ngày trước.
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wide text-slate-500">2. Chỉ số sinh tồn</h3>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="p-3 border border-slate-200 rounded-xl bg-white">
                      <div className="text-[11px] font-semibold text-slate-500 uppercase mb-1">Huyết áp</div>
                      <div className="text-lg font-bold text-slate-800">145/90 <span className="text-xs font-normal text-slate-400">mmHg</span></div>
                    </div>
                    <div className="p-3 border border-slate-200 rounded-xl bg-white">
                      <div className="text-[11px] font-semibold text-slate-500 uppercase mb-1">Nhịp tim</div>
                      <div className="text-lg font-bold text-slate-800">88 <span className="text-xs font-normal text-slate-400">bpm</span></div>
                    </div>
                    <div className="p-3 border border-slate-200 rounded-xl bg-white">
                      <div className="text-[11px] font-semibold text-slate-500 uppercase mb-1">Nhiệt độ</div>
                      <div className="text-lg font-bold text-slate-800">36.8 <span className="text-xs font-normal text-slate-400">°C</span></div>
                    </div>
                    <div className="p-3 border border-slate-200 rounded-xl bg-white">
                      <div className="text-[11px] font-semibold text-slate-500 uppercase mb-1">SpO2</div>
                      <div className="text-lg font-bold text-slate-800">96 <span className="text-xs font-normal text-slate-400">%</span></div>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wide text-slate-500">3. Chẩn đoán</h3>
                  <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">I20</div>
                      <div>
                        <div className="font-bold text-blue-900 mb-1">{activeRecord.diagnosis}</div>
                        <p className="text-sm text-blue-800/80">Cơn đau thắt ngực ổn định trên nền bệnh nhân có bệnh mạch vành cũ.</p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* LAB TAB */}
            {activeTab === 'lab' && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-3">
                    <CheckCircle size={24} className="text-emerald-500" weight="fill" />
                    <div>
                      <div className="font-bold text-slate-800">Điện tâm đồ (ECG)</div>
                      <div className="text-xs text-slate-500">Thực hiện lúc 08:45, {activeRecord.date}</div>
                    </div>
                  </div>
                  <button className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">Xem phiếu kết quả</button>
                </div>
                
                <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-3">
                    <CheckCircle size={24} className="text-emerald-500" weight="fill" />
                    <div>
                      <div className="font-bold text-slate-800">Xét nghiệm men tim (Troponin)</div>
                      <div className="text-xs text-slate-500">Thực hiện lúc 09:00, {activeRecord.date}</div>
                    </div>
                  </div>
                  <button className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">Xem phiếu kết quả</button>
                </div>
              </div>
            )}

            {/* PRESCRIPTION TAB */}
            {activeTab === 'prescription' && (
              <div className="flex flex-col gap-5">
                <div className="flex justify-end mb-2">
                  <button onClick={() => handlePrint('đơn thuốc')} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 active:scale-95">
                    <Printer size={16} /> In đơn thuốc
                  </button>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase">Tên thuốc</th>
                        <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase">Số lượng</th>
                        <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase">Liều dùng (S-T-C-T)</th>
                        <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase">Lời dặn</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-800 text-sm">Aspirin</div>
                          <div className="text-xs text-slate-500">81mg, Viên nén</div>
                        </td>
                        <td className="py-3 px-4 text-sm font-medium text-slate-700">30 viên</td>
                        <td className="py-3 px-4 text-sm text-slate-700 font-mono bg-slate-50/50">1 - 0 - 0 - 0</td>
                        <td className="py-3 px-4 text-sm text-slate-600">Uống sau ăn sáng</td>
                      </tr>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-800 text-sm">Atorvastatin</div>
                          <div className="text-xs text-slate-500">20mg, Viên nén</div>
                        </td>
                        <td className="py-3 px-4 text-sm font-medium text-slate-700">30 viên</td>
                        <td className="py-3 px-4 text-sm text-slate-700 font-mono bg-slate-50/50">0 - 0 - 0 - 1</td>
                        <td className="py-3 px-4 text-sm text-slate-600">Uống buổi tối</td>
                      </tr>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-800 text-sm">Metoprolol</div>
                          <div className="text-xs text-slate-500">50mg, Viên nén</div>
                        </td>
                        <td className="py-3 px-4 text-sm font-medium text-slate-700">60 viên</td>
                        <td className="py-3 px-4 text-sm text-slate-700 font-mono bg-slate-50/50">1 - 0 - 1 - 0</td>
                        <td className="py-3 px-4 text-sm text-slate-600">Uống sau ăn</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

    </div>
  );
};

export default MedicalRecordDetail;
