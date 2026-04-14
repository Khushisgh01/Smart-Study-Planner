import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import TeacherPanel from './pages/TeacherPanel';
import PYQPage from './pages/PYQPage';

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <BrowserRouter>
          <div className="noise-bg" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
            <Navbar />
            <div style={{ flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden' }}>
              <Routes>
                <Route path="/"            element={<LandingPage />} />
                <Route path="/login"       element={<LoginPage />} />
                <Route path="/onboarding"  element={<Onboarding />} />
                <Route path="/dashboard"   element={<Dashboard />} />
                <Route path="/teacher"     element={<TeacherPanel />} />
                <Route path="/pyqs"        element={<PYQPage />} />
                <Route path="*"            element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  );
}