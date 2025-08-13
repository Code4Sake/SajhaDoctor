import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/globals.css'
import {RouterProvider, Route, createBrowserRouter, createRoutesFromElements} from "react-router"
import Layout from './Layout.jsx'
import TelehealthLandingPage from './components/HealthcareLandingPage.jsx'
import AuthPage from './pages/Auth/AuthPage.jsx'
import Login from './pages/Auth/Login.jsx'
import Register from './pages/Auth/Register.jsx'
import PatientRegister from './pages/Auth/PatientRegister.jsx'
import DoctorRegister from './pages/Auth/DoctorRegister.jsx'
import PatientDashboard from './pages/Patient/PatientDashboard.jsx'
import DoctorDashboard from './pages/Dashboard/MainDashboard.jsx'
import MainDashboard from './pages/Dashboard/MainDashboard.jsx'
import Consultations from './pages/Dashboard/Consultations.jsx'
import Patients from './pages/Doctor/Patients.jsx'
import Appointments from './pages/Dashboard/Appointments.jsx'
import Analytics from './pages/Dashboard/Analytics.jsx'
import Layouts from './pages/Patient/Layouts.jsx';
import Appointment from './pages/Patient/Appointment.jsx';
import FindDoctors from './pages/Patient/FindDoctors';
import AISymptomChecker from './pages/Patient/AISymptomChecker';
import Prescriptions from './pages/Patient/Prescriptions';
import Settings from './pages/Patient/Settings';

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={<Layout />}>
            <Route path='' element={<TelehealthLandingPage />} />
            <Route path='home' element={<App />} />
            <Route path='home/AuthPage' element={<AuthPage />} />
            <Route path='home/Login' element={<Login />} />
            <Route path='home/Register' element={<Register />} />
            <Route path='home/PatientRegister' element={<PatientRegister />} />
            <Route path='home/DoctorRegister' element={<DoctorRegister />} />
            <Route path='home/PatientDashboard' element={<PatientDashboard />} />
            <Route path='home/DoctorDashboard' element={<DoctorDashboard />} />
            <Route path='home/Dashboard' element={<MainDashboard />} />
            <Route path='home/Dashboard/Consultations' element={<Consultations />} />
            <Route path='home/Dashboard/Patients' element={<Patients />} />
            <Route path='home/Dashboard/Appointments' element={<Appointments />} />
            <Route path='home/Dashboard/Analytics' element={<Analytics />} />
            <Route path='home/PatientDashboard/FindDoctors' element={<FindDoctors />} />
            <Route path='home/PatientDashboard/AISymptomChecker' element={<AISymptomChecker />} />
            <Route path='home/PatientDashboard/Prescriptions' element={<Prescriptions />} />
            <Route path='home/PatientDashboard/Appointment' element={<Appointment />} />
            <Route path='home/PatientDashboard/Settings' element={<Settings />} />
            <Route path='home/Layouts' element={<Layouts />} />

        </Route>
    )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}>
    <App />
    </RouterProvider>

)
