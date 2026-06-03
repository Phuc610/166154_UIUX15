export type Appointment = {
  date: string;
  doc: string;
  spec: string;
  mode: string;
  status: string;
  bg: string;
};

const INITIAL_APPOINTMENTS: Appointment[] = [
  { date: '30 Thg 6 2026 - 09:30 SA', doc: 'BS. Alberto Ripley',   spec: 'Tim mạch',       mode: 'Trực tiếp',  status: 'Đã hoàn tất', bg: 'bg-indigo-200' },
  { date: '30 Thg 6 2026 - 10:00 SA', doc: 'BS. Susan Babin',      spec: 'Chỉnh hình',     mode: 'Trực tuyến', status: 'Đã xếp lịch', bg: 'bg-red-300' },
  { date: '30 Thg 6 2026 - 11:00 SA', doc: 'BS. Carol Lam',        spec: 'Nhi khoa',       mode: 'Trực tiếp',  status: 'Đang chờ',    bg: 'bg-blue-300' },
  { date: '30 Thg 6 2026 - 01:30 CH', doc: 'BS. Marsha Noland',    spec: 'Phụ khoa',       mode: 'Trực tuyến', status: 'Đã xếp lịch', bg: 'bg-yellow-400' },
  { date: '30 Thg 6 2026 - 03:00 CH', doc: 'BS. Ezra Belcher',     spec: 'Ngoại thần kinh',mode: 'Trực tiếp',  status: 'Đã hoàn tất', bg: 'bg-pink-300' },
  { date: '30 Thg 6 2026 - 04:20 CH', doc: 'BS. Glen Lentz',       spec: 'Ung bướu',       mode: 'Trực tuyến', status: 'Đã xác nhận', bg: 'bg-teal-400' },
  { date: '30 Thg 6 2026 - 05:00 CH', doc: 'BS. Bernard Griffith', spec: 'Hô hấp',         mode: 'Trực tuyến', status: 'Đã xếp lịch', bg: 'bg-purple-300' },
  { date: '25 Thg 6 2026 - 11:20 SA', doc: 'BS. Susan Babin',      spec: 'Chỉnh hình',     mode: 'Trực tuyến', status: 'Đang chờ',    bg: 'bg-red-300' },
  { date: '20 Thg 6 2026 - 08:15 SA', doc: 'BS. Carol Lam',        spec: 'Nhi khoa',       mode: 'Trực tiếp',  status: 'Đã hủy',      bg: 'bg-blue-300' },
  { date: '15 Thg 6 2026 - 02:00 CH', doc: 'BS. Marsha Noland',    spec: 'Phụ khoa',       mode: 'Trực tuyến', status: 'Đã xếp lịch', bg: 'bg-yellow-400' },
  { date: '12 Thg 6 2026 - 05:40 CH', doc: 'BS. Irma Armstrong',   spec: 'Tâm thần học',   mode: 'Trực tuyến', status: 'Đã xác nhận', bg: 'bg-purple-300' },
  { date: '08 Thg 6 2026 - 09:20 SA', doc: 'BS. Ezra Belcher',     spec: 'Ngoại thần kinh',mode: 'Trực tiếp',  status: 'Đã hủy',      bg: 'bg-red-300' },
  { date: '05 Thg 6 2026 - 11:40 SA', doc: 'BS. Glen Lentz',       spec: 'Ung bướu',       mode: 'Trực tuyến', status: 'Đã xác nhận', bg: 'bg-teal-400' },
  { date: '04 Thg 6 2026 - 04:00 CH', doc: 'BS. Bernard Griffith', spec: 'Hô hấp',         mode: 'Trực tuyến', status: 'Đã hoàn tất', bg: 'bg-indigo-200' },
  { date: '03 Thg 6 2026 - 03:10 CH', doc: 'BS. John Elsass',      spec: 'Tiết niệu',      mode: 'Trực tuyến', status: 'Đã xếp lịch', bg: 'bg-yellow-400' },
  { date: '02 Thg 6 2026 - 03:10 CH', doc: 'BS. John Albert',      spec: 'Tim mạch',       mode: 'Trực tiếp',  status: 'Đã hủy',      bg: 'bg-blue-200' },
];

export const getAppointments = (): Appointment[] => {
  const stored = localStorage.getItem('preclinic_appointments_v3');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse stored appointments', e);
    }
  }
  return INITIAL_APPOINTMENTS;
};

export const saveAppointment = (appointment: Appointment) => {
  const current = getAppointments();
  const updated = [appointment, ...current];
  localStorage.setItem('preclinic_appointments_v3', JSON.stringify(updated));
};
