import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import FormsPage from './pages/FormsPage'
import FormBuilderPage from './pages/FormBuilderPage'
import CandidatesPage from './pages/CandidatesPage'
import SchedulerPage from './pages/SchedulerPage'
import SettingsPage from './pages/SettingsPage'
import PublicFormPage from './pages/PublicFormPage'
import Layout from './components/Layout'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="loading-full">
      <div className="spinner" />
      <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Loading...</span>
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  return children
}

function AppRoutes() {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="loading-full">
      <div className="spinner" />
      <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Loading HireAdstore.ai...</span>
    </div>
  )
  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/apply/:formId" element={<PublicFormPage />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="forms" element={<FormsPage />} />
        <Route path="forms/new" element={<FormBuilderPage />} />
        <Route path="forms/:id/edit" element={<FormBuilderPage />} />
        <Route path="forms/:id/candidates" element={<CandidatesPage />} />
        <Route path="scheduler" element={<SchedulerPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-active)',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.875rem',
                boxShadow: 'var(--shadow)',
              },
              success: { iconTheme: { primary: 'var(--green)', secondary: 'var(--bg-card)' } },
              error:   { iconTheme: { primary: 'var(--red)',   secondary: 'var(--bg-card)' } },
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
