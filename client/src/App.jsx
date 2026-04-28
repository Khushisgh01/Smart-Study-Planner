// import React from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { ThemeProvider } from './context/ThemeContext';
// import { AppProvider } from './context/AppContext';
// import Navbar from './components/Navbar';

// // Existing Pages
// import LandingPage from './pages/LandingPage';
// import LoginPage from './pages/LoginPage';
// import Onboarding from './pages/Onboarding';
// import Dashboard from './pages/Dashboard';
// import TeacherPanel from './pages/TeacherPanel';
// import PYQPage from './pages/PYQPage';

// // New Pages
// import TeacherLogin from './pages/TeacherLogin';
// import StudentRegister from './pages/StudentRegister';
// import TeacherDashboard from './pages/TeacherDashboard';
// import AddSubject from './pages/AddSubject';

// // -------------------------
// // ROUTE GUARDS
// // -------------------------

// // 1. ProtectedRoute: Only allows access if the user IS logged in (has a token)
// const ProtectedRoute = ({ children }) => {
//   const token = localStorage.getItem('token');
//   if (!token) {
//     // Force to login if no token is found
//     return <Navigate to="/login" replace />;
//   }
//   return children;
// };

// // 2. PublicRoute: Only allows access if the user IS NOT logged in
// const PublicRoute = ({ children }) => {
//   const token = localStorage.getItem('token');
//   const userString = localStorage.getItem('user');

//   if (token && userString) {
//     try {
//       const user = JSON.parse(userString);
//       // Redirect logged-in users to their respective dashboards
//       if (user.role === 'teacher') {
//         return <Navigate to="/teacher/dashboard" replace />;
//       }
//       return <Navigate to="/dashboard" replace />; // Student dashboard
//     } catch (e) {
//       localStorage.clear(); // Clear broken data
//     }
//   }
//   return children;
// };

// // -------------------------
// // MAIN APP COMPONENT
// // -------------------------
// export default function App() {
//   return (
//     <ThemeProvider>
//       <AppProvider>
//         <BrowserRouter>
//           {/* Removed fixed height and hidden overflow to allow page scrolling anywhere it's needed */}
//           <div className="noise-bg" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', overflowX: 'hidden' }}>
            
//             {/* Navbar is rendered on all pages */}
//             <Navbar />
            
//             <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
//               <Routes>
                
//                 {/* 🌍 UNPROTECTED ROUTE (Everyone can see Landing Page) */}
//                 <Route path="/" element={<LandingPage />} />

//                 {/* 🔓 PUBLIC ROUTES (Only for logged-out users) */}
//                 <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
//                 {/* Notice: Changed TeacherLogin to /teacher-login to prevent duplicate /login conflict */}
//                 <Route path="/teacher-login" element={<PublicRoute><TeacherLogin /></PublicRoute>} />
//                 <Route path="/register" element={<PublicRoute><StudentRegister /></PublicRoute>} />

//                 {/* 🔐 PROTECTED ROUTES (Only for logged-in users) */}
//                 <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
//                 <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
//                 <Route path="/teacher" element={<ProtectedRoute><TeacherPanel /></ProtectedRoute>} />
//                 <Route path="/pyqs" element={<ProtectedRoute><PYQPage /></ProtectedRoute>} />
//                 <Route path="/teacher/dashboard" element={<ProtectedRoute><TeacherDashboard /></ProtectedRoute>} />
//                 <Route path="/teacher/class/:classId/add-subject" element={<ProtectedRoute><AddSubject /></ProtectedRoute>} />

//                 {/* ❌ CATCH-ALL ROUTE (Redirect unknown URLs to home) */}
//                 <Route path="*" element={<Navigate to="/" replace />} />
                
//               </Routes>
//             </div>
//           </div>
//         </BrowserRouter>
//       </AppProvider>
//     </ThemeProvider>
//   );
// }
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';

import LandingPage      from './pages/LandingPage';
import LoginPage        from './pages/LoginPage';
import Onboarding       from './pages/Onboarding';
import Dashboard        from './pages/Dashboard';
import TeacherPanel     from './pages/TeacherPanel';
import PYQPage          from './pages/PYQPage';
import TeacherLogin     from './pages/TeacherLogin';
import StudentRegister  from './pages/StudentRegister';
// ✅ FIX Bug 25: TeacherRegister imported and given a route
import TeacherRegister  from './pages/TeacherRegister';
import TeacherDashboard from './pages/TeacherDashboard';
import AddSubject       from './pages/AddSubject';
// ✅ FIX Bug 24: StudentDashboard removed — Dashboard.jsx is the correct student view

// ── Route guards ──────────────────────────────────────────────────────────

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const token      = localStorage.getItem('token');
  const userString = localStorage.getItem('user');
  if (token && userString) {
    try {
      const user = JSON.parse(userString);
      if (user.role === 'teacher') return <Navigate to="/teacher/dashboard" replace />;
      return <Navigate to="/dashboard" replace />;
    } catch {
      localStorage.clear();
    }
  }
  return children;
};

// ── App ───────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <BrowserRouter>
          <div className="noise-bg" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', overflowX: 'hidden' }}>
            <Navbar />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Routes>
                {/* Public */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login"          element={<PublicRoute><LoginPage /></PublicRoute>} />
                {/* ✅ FIX Bug 26: /teacher-login points to our unified TeacherLogin page */}
                <Route path="/teacher-login"  element={<PublicRoute><TeacherLogin /></PublicRoute>} />
                <Route path="/register"       element={<PublicRoute><StudentRegister /></PublicRoute>} />
                {/* ✅ FIX Bug 25: /teacher-register now has a real route */}
                <Route path="/teacher-register" element={<PublicRoute><TeacherRegister /></PublicRoute>} />

                {/* Protected */}
                <Route path="/onboarding"     element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
                <Route path="/dashboard"      element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/teacher"        element={<ProtectedRoute><TeacherPanel /></ProtectedRoute>} />
                <Route path="/pyqs"           element={<ProtectedRoute><PYQPage /></ProtectedRoute>} />
                <Route path="/teacher/dashboard" element={<ProtectedRoute><TeacherDashboard /></ProtectedRoute>} />
                <Route path="/teacher/class/:classId/add-subject" element={<ProtectedRoute><AddSubject /></ProtectedRoute>} />

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  );
}