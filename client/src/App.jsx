import { ThemeProvider } from './context/ThemeContext';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import TeacherPanel from './pages/TeacherPanel';
import LandingPage from './pages/LandingPage';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import LoginStudent from './pages/LoginStudent';

function AppShell() {
  const { activeView } = useApp();
  return (
    <div className="noise-bg" style={{ display:'flex', flexDirection:'column', height:'100vh', overflow:'hidden' }}>
      <Navbar />
      <div style={{ flex:1, display:'flex', minHeight:0, overflow:'hidden' }}>
        {activeView === 'landing'     && <LandingPage />}
        {activeView === 'home'        && <HomePage />}
        {activeView === 'onboarding'  && <Onboarding />}
        {activeView === 'dashboard'   && <Dashboard />}
        {activeView === 'teacher'     && <TeacherPanel />}
      </div>
    </div>
  );
}

export default function App() {
  return (
   <ThemeProvider>
      <AppProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/teacher" element={<TeacherPanel />} />
            <Route path="/loginstudent" element={<LoginStudent />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  );
}