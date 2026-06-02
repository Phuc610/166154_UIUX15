import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardOverview from './DashboardOverview';
import ExportReport from './ExportReport';
import Patients from './Patients';
import Doctors from './Doctors';
import Appointments from './Appointments';
import Staff from './Staff';
import Schedule from './Schedule';
import Invoices from './Invoices';
import Expenses from './Expenses';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="export" element={<ExportReport />} />
          <Route path="patients" element={<Patients />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="staff" element={<Staff />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="expenses" element={<Expenses />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
