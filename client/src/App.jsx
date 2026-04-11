import { ThemeProvider } from './context/ThemeContext';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import TeacherPanel from './pages/TeacherPanel';
import LandingPage from './pages/LandingPage';

function AppShell() {
  const { activeView } = useApp();
  return (
    <div className="noise-bg" style={{ display:'flex', flexDirection:'column', height:'100vh', overflow:'hidden' }}>
      <Navbar />
      <div style={{ flex:1, display:'flex', minHeight:0, overflow:'hidden' }}>
        {activeView === 'landing'     && <LandingPage />}
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
        <AppShell />
      </AppProvider>
    </ThemeProvider>
  );
}