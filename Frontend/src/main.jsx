import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/globals.css'
import { RouterProvider, Route, createBrowserRouter, createRoutesFromElements } from "react-router"
import { AuthProvider } from './pages/Auth/AuthContext.jsx'
import { LanguageProvider } from './i18n/LanguageContext.jsx'
import Layout from './Layout.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

// Landing & Auth
import LandingPage from './components/Landing/LandingPage.jsx'
import Login from './pages/Auth/Login.jsx'
import Register from './pages/Auth/Register.jsx'
import PatientRegister from './pages/Auth/PatientRegister.jsx'
import DoctorRegister from './pages/Auth/DoctorRegister.jsx'
import NotFound from './pages/NotFound.jsx'

// Dashboard Shell
import DashboardShell from './pages/DashboardShell.jsx'

// Patient Pages
import PatientHome from './pages/Patient/PatientHome.jsx'
import PatientAppointments from './pages/Patient/PatientAppointments.jsx'
import FindDoctors from './pages/Patient/FindDoctors.jsx'
import Prescriptions from './pages/Patient/Prescriptions.jsx'
import HealthRecords from './pages/Patient/Healthrecords.jsx'
import PatientSettings from './pages/Patient/PatientSettings.jsx'

// Doctor Pages
import DoctorHome from './pages/Doctor/DoctorHome.jsx'
import DoctorAppointments from './pages/Doctor/DoctorAppointments.jsx'
import DoctorPatients from './pages/Doctor/DoctorPatients.jsx'
import DoctorPrescriptions from './pages/Doctor/DoctorPrescriptions.jsx'
import Analytics from './pages/Doctor/Analytics.jsx'
import DoctorSettings from './pages/Doctor/DoctorSettings.jsx'

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={<Layout />}>
            {/* ═══ Public Routes ═══ */}
            <Route path='' element={<LandingPage />} />
            <Route path='home/Login' element={<Login />} />
            <Route path='home/Register' element={<Register />} />
            <Route path='home/PatientRegister' element={<PatientRegister />} />
            <Route path='home/DoctorRegister' element={<DoctorRegister />} />

            {/* ═══ Patient Dashboard (Protected) ═══ */}
            <Route path='dashboard' element={
                <ProtectedRoute requiredRole="patient">
                    <DashboardShell />
                </ProtectedRoute>
            }>
                <Route index element={<PatientHome />} />
                <Route path='appointments' element={<PatientAppointments />} />
                <Route path='find-doctors' element={<FindDoctors />} />
                <Route path='prescriptions' element={<Prescriptions />} />
                <Route path='health' element={<HealthRecords />} />
                <Route path='settings' element={<PatientSettings />} />
            </Route>

            {/* ═══ Doctor Dashboard (Protected) ═══ */}
            <Route path='doctor' element={
                <ProtectedRoute requiredRole="doctor">
                    <DashboardShell />
                </ProtectedRoute>
            }>
                <Route index element={<DoctorHome />} />
                <Route path='appointments' element={<DoctorAppointments />} />
                <Route path='patients' element={<DoctorPatients />} />
                <Route path='prescriptions' element={<DoctorPrescriptions />} />
                <Route path='analytics' element={<Analytics />} />
                <Route path='settings' element={<DoctorSettings />} />
            </Route>

            {/* ═══ 404 Catch-all ═══ */}
            <Route path='*' element={<NotFound />} />
        </Route>
    )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <LanguageProvider>
    <AuthProvider>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </AuthProvider>
  </LanguageProvider>
)
