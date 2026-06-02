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
