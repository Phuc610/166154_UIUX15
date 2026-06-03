import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './LandingPage';
import DashboardOverview from './DashboardOverview';
import ExportReport from './ExportReport';
import Patients from './Patients';
import Doctors from './Doctors';
import Appointments from './Appointments';
import Staff from './Staff';
import Schedule from './Schedule';
import Invoices from './Invoices';
import Expenses from './Expenses';
import DoctorDashboard from './DoctorDashboard';
import DoctorSchedule from './DoctorSchedule';
import DoctorLayout from './components/DoctorLayout';
import AIAssistant from './AIAssistant';
import MedicalExamination from './MedicalExamination';
import MedicalRecords from './MedicalRecords';
import MedicalRecordDetail from './MedicalRecordDetail';
import Messages from './Messages';
import PatientLayout from './components/PatientLayout';
import PatientDashboard from './PatientDashboard';
import PatientSchedule from './PatientSchedule';
import PatientDoctors from './PatientDoctors';
import PatientDoctorDetails from './PatientDoctorDetails';
import PatientConsultDoctor from './PatientConsultDoctor';
import PatientChatbot from './PatientChatbot';
import PatientPrescriptions from './PatientPrescriptions';
import PatientPrescriptionDetail from './PatientPrescriptionDetail';
import PatientInvoices from './PatientInvoices';
import PatientProfileSettings from './PatientProfileSettings';
import PatientChangePassword from './PatientChangePassword';
import PatientNotificationsSettings from './PatientNotificationsSettings';
import DoctorProfileSettings from './DoctorProfileSettings';
import DoctorChangePassword from './DoctorChangePassword';
import DoctorNotificationsSettings from './DoctorNotificationsSettings';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ─── Landing / Home Page ─── */}
        <Route path="/" element={<LandingPage />} />

        {/* ─── Doctor Portal (own layout) ─── */}
        <Route path="/doctor" element={<DoctorLayout />}>
          <Route path="dashboard" element={<DoctorDashboard />} />
          <Route path="schedule"  element={<DoctorSchedule />} />
          <Route path="ai-assistant" element={<AIAssistant />} />
          <Route path="examination" element={<MedicalExamination />} />
          <Route path="records" element={<MedicalRecords />} />
          <Route path="records/:id" element={<MedicalRecordDetail />} />
          <Route path="messages" element={<Messages />} />
          <Route path="patients" element={<Patients />} />
          <Route path="settings/profile" element={<DoctorProfileSettings />} />
          <Route path="settings/password" element={<DoctorChangePassword />} />
          <Route path="settings/notifications" element={<DoctorNotificationsSettings />} />
        </Route>

        {/* ─── Patient Portal ─── */}
        <Route path="/patient" element={<PatientLayout />}>
          <Route path="dashboard" element={<PatientDashboard />} />
          <Route path="schedule"  element={<PatientSchedule />} />
          <Route path="doctors"   element={<PatientDoctors />} />
          <Route path="doctors/:name" element={<PatientDoctorDetails />} />
          <Route path="prescriptions" element={<PatientPrescriptions />} />
          <Route path="prescriptions/:id" element={<PatientPrescriptionDetail />} />
          <Route path="invoices"  element={<PatientInvoices />} />
          <Route path="consult-doctor" element={<PatientConsultDoctor />} />
          <Route path="consult-bot" element={<PatientChatbot />} />
          <Route path="settings/profile" element={<PatientProfileSettings />} />
          <Route path="settings/password" element={<PatientChangePassword />} />
          <Route path="settings/notifications" element={<PatientNotificationsSettings />} />
        </Route>

        {/* ─── Admin Portal (shared Layout sidebar) ─── */}
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="export"       element={<ExportReport />} />
          <Route path="patients"     element={<Patients />} />
          <Route path="doctors"      element={<Doctors />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="staff"        element={<Staff />} />
          <Route path="schedule"     element={<Schedule />} />
          <Route path="invoices"     element={<Invoices />} />
          <Route path="expenses"     element={<Expenses />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
