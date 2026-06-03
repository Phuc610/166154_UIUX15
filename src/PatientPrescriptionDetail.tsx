import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CaretLeft, Printer, FileArrowDown, Hexagon } from '@phosphor-icons/react';

const PRESCRIPTIONS_DETAIL: Record<string, {
  id: string; doc: string; spec: string; date: string; bg: string;
  patient: string; dob: string; gender: string; diagnosis: string; note: string;
  items: { name: string; dosage: string; usage: string; qty: string; duration: string }[];
}> = {
  '#PRE0015': {
    id: '#PRE0015', doc: 'BS. Mick Thompson', spec: 'Tim mạch', date: '30 Thg 4 2026', bg: 'bg-indigo-200',
    patient: 'Nguyễn Văn A', dob: '01/01/1990', gender: 'Nam', diagnosis: 'Tăng huyết áp giai đoạn 1',
    note: 'Bệnh nhân cần theo dõi huyết áp hàng ngày, tái khám sau 30 ngày. Hạn chế muối, mỡ và rượu bia.',
    items: [
      { name: 'Amlodipine 5mg', dosage: '5mg', usage: 'Uống 1 viên sau ăn sáng', qty: '30 viên', duration: '30 ngày' },
      { name: 'Losartan 50mg', dosage: '50mg', usage: 'Uống 1 viên sau ăn tối', qty: '30 viên', duration: '30 ngày' },
      { name: 'Aspirin 81mg', dosage: '81mg', usage: 'Uống 1 viên sau ăn sáng', qty: '30 viên', duration: '30 ngày' },
    ]
  },
  '#PRE0014': {
    id: '#PRE0014', doc: 'BS. Sarah Johnson', spec: 'Chỉnh hình', date: '15 Thg 4 2026', bg: 'bg-red-300',
    patient: 'Nguyễn Văn A', dob: '01/01/1990', gender: 'Nam', diagnosis: 'Viêm khớp gối phải',
    note: 'Kết hợp vật lý trị liệu 3 lần/tuần. Tránh leo cầu thang và mang vác nặng.',
    items: [
      { name: 'Celecoxib 200mg', dosage: '200mg', usage: 'Uống 1 viên sau ăn sáng', qty: '20 viên', duration: '20 ngày' },
      { name: 'Glucosamine 500mg', dosage: '500mg', usage: 'Uống 2 viên sau ăn tối', qty: '60 viên', duration: '30 ngày' },
    ]
  },
  '#PRE0013': {
    id: '#PRE0013', doc: 'BS. Emily Carter', spec: 'Nhi khoa', date: '02 Thg 4 2026', bg: 'bg-blue-300',
    patient: 'Nguyễn Văn A', dob: '01/01/1990', gender: 'Nam', diagnosis: 'Viêm họng cấp',
    note: 'Uống thuốc đủ liều, không tự ý ngừng. Uống nhiều nước, tránh đồ lạnh.',
    items: [
      { name: 'Amoxicillin 500mg', dosage: '500mg', usage: 'Uống 1 viên x 3 lần/ngày', qty: '21 viên', duration: '7 ngày' },
      { name: 'Paracetamol 500mg', dosage: '500mg', usage: 'Uống 1-2 viên khi sốt/đau', qty: '20 viên', duration: 'Khi cần' },
      { name: 'Strepsils', dosage: 'Ngậm', usage: 'Ngậm 1 viên x 4 lần/ngày', qty: '24 viên', duration: '7 ngày' },
    ]
  },
};

// Fallback detail for other prescription IDs
const DEFAULT_DETAIL = {
  patient: 'Nguyễn Văn A', dob: '01/01/1990', gender: 'Nam', diagnosis: 'Cần tham khảo bác sĩ',
  note: 'Vui lòng tái khám theo hẹn.',
  items: [{ name: 'Paracetamol 500mg', dosage: '500mg', usage: 'Uống khi đau', qty: '10 viên', duration: 'Khi cần' }]
};

const ALL_PRESCRIPTIONS: Record<string, { id: string; doc: string; spec: string; date: string; bg: string }> = {
  '#PRE0015': { id: '#PRE0015', doc: 'BS. Mick Thompson', spec: 'Tim mạch', date: '30 Thg 4 2026', bg: 'bg-indigo-200' },
  '#PRE0014': { id: '#PRE0014', doc: 'BS. Sarah Johnson', spec: 'Chỉnh hình', date: '15 Thg 4 2026', bg: 'bg-red-300' },
  '#PRE0013': { id: '#PRE0013', doc: 'BS. Emily Carter', spec: 'Nhi khoa', date: '02 Thg 4 2026', bg: 'bg-blue-300' },
  '#PRE0012': { id: '#PRE0012', doc: 'BS. David Lee', spec: 'Phụ khoa', date: '27 Thg 3 2026', bg: 'bg-yellow-400' },
  '#PRE0011': { id: '#PRE0011', doc: 'BS. Anna Kim', spec: 'Tâm thần học', date: '12 Thg 3 2026', bg: 'bg-emerald-300' },
  '#PRE0010': { id: '#PRE0010', doc: 'BS. John Smith', spec: 'Ngoại thần kinh', date: '05 Thg 3 2026', bg: 'bg-purple-300' },
};

const PatientPrescriptionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const prescId = id ? decodeURIComponent(id) : '';
  const base = ALL_PRESCRIPTIONS[prescId] || { id: prescId, doc: 'Bác sĩ', spec: '—', date: '—', bg: 'bg-slate-200' };
  const detail = PRESCRIPTIONS_DETAIL[prescId] || { ...base, ...DEFAULT_DETAIL };

  const initials = base.doc.replace('BS. ', '').split(' ').slice(-2).map((w: string) => w[0]).join('');

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50">
      {/* Header - same style as PatientDoctorDetails */}
      <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/patient/prescriptions')}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <CaretLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-slate-900">Chi tiết đơn thuốc</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
            <Printer size={16} weight="fill" /> In đơn
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm shadow-blue-200">
            <FileArrowDown size={16} /> Tải PDF
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
      <div className="px-8 py-6 pb-10 max-w-5xl mx-auto flex flex-col gap-5">

        {/* Top Info Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-start justify-between flex-wrap gap-6">
            {/* Clinic info */}
            <div className="flex items-start gap-3">
              <div className="flex items-center gap-2 text-blue-600">
                <Hexagon weight="fill" size={28} />
                <span className="text-lg font-bold text-slate-900">Preclinic</span>
              </div>
            </div>

            {/* Prescription ID + Date */}
            <div className="text-right">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Mã đơn thuốc</div>
              <div className="text-xl font-bold text-blue-600">{prescId}</div>
              <div className="text-sm text-slate-500 mt-1">Ngày kê: <span className="font-semibold text-slate-700">{base.date}</span></div>
            </div>
          </div>

          <div className="border-t border-slate-100 my-5" />

          {/* Patient & Doctor info side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Patient */}
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Thông tin bệnh nhân</div>
              <div className="flex flex-col gap-1.5">
                <div className="flex gap-2 text-sm"><span className="text-slate-400 w-28 shrink-0">Họ và tên:</span><span className="font-semibold text-slate-800">{detail.patient}</span></div>
                <div className="flex gap-2 text-sm"><span className="text-slate-400 w-28 shrink-0">Ngày sinh:</span><span className="font-semibold text-slate-800">{detail.dob}</span></div>
                <div className="flex gap-2 text-sm"><span className="text-slate-400 w-28 shrink-0">Giới tính:</span><span className="font-semibold text-slate-800">{detail.gender}</span></div>
                <div className="flex gap-2 text-sm"><span className="text-slate-400 w-28 shrink-0">Chẩn đoán:</span><span className="font-semibold text-slate-800">{detail.diagnosis}</span></div>
              </div>
            </div>

            {/* Doctor */}
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Bác sĩ kê đơn</div>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-full ${base.bg} flex items-center justify-center font-bold text-white text-sm shrink-0`}>
                  {initials}
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-sm">{base.doc}</div>
                  <div className="text-xs text-slate-500">{base.spec}</div>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex gap-2 text-sm"><span className="text-slate-400 w-28 shrink-0">Chuyên khoa:</span><span className="font-semibold text-slate-800">{base.spec}</span></div>
                <div className="flex gap-2 text-sm"><span className="text-slate-400 w-28 shrink-0">Phòng khám:</span><span className="font-semibold text-slate-800">Preclinic</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Medicines Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-800 text-[15px]">Danh sách thuốc</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="py-3 px-6 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-8">#</th>
                  <th className="py-3 px-6 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Tên thuốc</th>
                  <th className="py-3 px-6 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Liều dùng</th>
                  <th className="py-3 px-6 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Cách dùng</th>
                  <th className="py-3 px-6 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Số lượng</th>
                  <th className="py-3 px-6 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Thời gian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {detail.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 text-sm font-semibold text-slate-400">{idx + 1}</td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-bold text-slate-800">{item.name}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-slate-600 font-medium">{item.dosage}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-slate-600">{item.usage}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-semibold text-slate-700">{item.qty}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-slate-600">{item.duration}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="font-bold text-slate-800 text-[15px] mb-3">Lưu ý & Dặn dò</h2>
          <p className="text-sm text-slate-600 leading-relaxed">{detail.note}</p>
        </div>

        {/* Footer signature */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-end justify-between">
          <div>
            <div className="text-xs text-slate-400 mb-1">Đơn thuốc có giá trị trong <span className="font-bold text-slate-600">30 ngày</span> kể từ ngày kê đơn.</div>
            <div className="text-xs text-slate-400">Không tự ý tăng/giảm liều hoặc ngừng thuốc khi chưa có chỉ định của bác sĩ.</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400 mb-1">Bác sĩ kê đơn</div>
            <div className="font-bold text-slate-800 text-sm">{base.doc}</div>
            <div className="text-xs text-slate-500">{base.spec} — Preclinic</div>
          </div>
        </div>

      </div>
      </div>
    </div>
  );
};

export default PatientPrescriptionDetail;
