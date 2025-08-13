import React  from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import FindDoctors from './pages/FindDoctors/FindDoctors';
import Appointments from './pages/Appointments/Appointments';
import Consultations from './pages/Consultations/Consultations';
import AISymptomChecker from './pages/AISymptomChecker/AISymptomChecker';
import Prescriptions from './pages/Prescriptions/Prescriptions';
import HealthRecords from './pages/HealthRecords/HealthRecords';
import Settings from './pages/Settings/Settings';
import './App.css';

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/doctors" element={<FindDoctors />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/consultations" element={<Consultations />} />
          <Route path="/symptoms" element={<AISymptomChecker />} />
          <Route path="/prescriptions" element={<Prescriptions />} />
          <Route path="/records" element={<HealthRecords />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;