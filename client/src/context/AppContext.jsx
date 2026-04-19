import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();
const API_URL = 'http://localhost:5000/api';

// ── MOCK DATA (fallback when API is unavailable) ──────────────────────────
const mockTasks = [
  { _id:'1', subject:'Mathematics', chapter:'Differential Equations', taskType:'Learn', estimatedTime:60, status:'pending', priority:9 },
  { _id:'2', subject:'Physics', chapter:'Waves & Optics', taskType:'Revise1', estimatedTime:45, status:'pending', priority:7 },
  { _id:'3', subject:'Chemistry', chapter:'Organic Reactions', taskType:'PYQ', estimatedTime:30, status:'pending', priority:8 },
  { _id:'4', subject:'Mathematics', chapter:'Integration', taskType:'Revise2', estimatedTime:50, status:'pending', priority:6 },
  { _id:'5', subject:'Biology', chapter:'Cell Division', taskType:'Learn', estimatedTime:40, status:'done', priority:5 },
];

const mockSubjects = [
  { _id:'s1', name:'Mathematics', progress:62, color:'#1a3fa3', examDate:'2026-06-15', badge:'High Weight',
    chapters:[{name:'Differential Equations',weightage:9},{name:'Integration',weightage:7},{name:'Vectors',weightage:6}],
    pyqs:[ { _id:'p1', year:'2024', title:'CRPS Class 12 Maths Board PYQ', fileUrl:'#', uploadedAt:'2024-01-10' },
           { _id:'p2', year:'2023', title:'CRPS Class 12 Maths PYQ 2023', fileUrl:'#', uploadedAt:'2023-12-15' } ],
  },
  { _id:'s2', name:'Physics', progress:38, color:'#00c9b1', examDate:'2026-06-18', badge:'Urgent',
    chapters:[{name:'Waves & Optics',weightage:8},{name:'Mechanics',weightage:6},{name:'Thermodynamics',weightage:7}],
    pyqs:[ { _id:'p3', year:'2024', title:'CRPS Physics Board PYQ 2024', fileUrl:'#', uploadedAt:'2024-01-10' } ],
  },
  { _id:'s3', name:'Chemistry', progress:51, color:'#ff2d78', examDate:'2026-06-20', badge:'Weak',
    chapters:[{name:'Organic Reactions',weightage:8},{name:'Electrochemistry',weightage:7}],
    pyqs:[],
  },
  { _id:'s4', name:'Biology', progress:74, color:'#e8a020', examDate:'2026-06-22', badge:'On Track',
    chapters:[{name:'Cell Division',weightage:5},{name:'Genetics',weightage:8}],
    pyqs:[ { _id:'p4', year:'2024', title:'CRPS Biology PYQ 2024', fileUrl:'#', uploadedAt:'2024-01-12' } ],
  },
];

const mockTomorrowTasks = [
  { _id:'t1', subject:'Physics', chapter:'Thermodynamics', taskType:'Learn', estimatedTime:55 },
  { _id:'t2', subject:'Mathematics', chapter:'Vectors', taskType:'PYQ', estimatedTime:35 },
  { _id:'t3', subject:'Chemistry', chapter:'Electrochemistry', taskType:'Revise1', estimatedTime:40 },
];

// ── PROVIDER ──────────────────────────────────────────────────────────────
export function AppProvider({ children }) {
  const [tasks, setTasks] = useState(mockTasks);
  const [subjects, setSubjects] = useState(mockSubjects);
  const [tomorrowTasks, setTomorrowTasks] = useState(mockTomorrowTasks);
  const [showConfetti, setShowConfetti] = useState(false);
  const [rescheduledAlert, setRescheduledAlert] = useState(null);
  const [activePYQSubject, setActivePYQSubject] = useState(null);
  const [apiTasksLoaded, setApiTasksLoaded] = useState(false);

  // ── Persist role & userName across page refreshes ──
  const [role, setRoleInternal] = useState(() => {
    return localStorage.getItem('userRole') || null;
  });

  const [userName, setUserNameInternal] = useState(() => {
    try {
      const user = localStorage.getItem('user');
      return user ? (JSON.parse(user).name || 'Student') : 'Student';
    } catch { return 'Student'; }
  });

  // Wrap setRole so it also updates localStorage
  const setRole = (newRole) => {
    setRoleInternal(newRole);
    if (newRole) {
      localStorage.setItem('userRole', newRole);
    } else {
      localStorage.removeItem('userRole');
    }
  };

  const setUserName = (name) => {
    setUserNameInternal(name);
  };

  // ── Fetch today's tasks from API (student only) ──
  const fetchTodayTasks = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/tasks/today`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setTasks(data);
          setApiTasksLoaded(true);
        }
      }
    } catch (err) {
      console.log('Using mock tasks — API unavailable');
    }
  };

  // ── Fetch tomorrow's tasks from API ──
  const fetchTomorrowTasks = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/tasks/tomorrow`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) setTomorrowTasks(data);
      }
    } catch (err) {
      console.log('Tomorrow tasks: using mock data');
    }
  };

  // Auto-load tasks when student role is detected
  useEffect(() => {
    const currentRole = localStorage.getItem('userRole');
    if (currentRole === 'student') {
      fetchTodayTasks();
      fetchTomorrowTasks();
    }
  }, [role]);

  // ── Update task status (optimistic + API sync) ──
  const updateTask = async (id, status) => {
    // Optimistic UI update first
    setTasks(prev => {
      const updated = prev.map(t => t._id === id ? { ...t, status } : t);
      const allDone = updated.every(t => t.status !== 'pending');
      if (allDone) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
      return updated;
    });

    if (status === 'skipped' || status === 'partial') {
      setRescheduledAlert(id);
      setTimeout(() => setRescheduledAlert(null), 3000);
    }

    // Sync to API in background
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await fetch(`${API_URL}/tasks/${id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ status }),
        });
      } catch (err) {
        console.log('Task status sync failed — kept local state');
      }
    }
  };

  // ── PYQ helpers ──
  const addPYQ = (subjectId, pyq) => {
    setSubjects(prev => prev.map(s =>
      s._id === subjectId
        ? { ...s, pyqs: [...s.pyqs, { _id: Date.now().toString(), ...pyq, uploadedAt: new Date().toISOString().split('T')[0] }] }
        : s
    ));
  };

  const deletePYQ = (subjectId, pyqId) => {
    setSubjects(prev => prev.map(s =>
      s._id === subjectId ? { ...s, pyqs: s.pyqs.filter(p => p._id !== pyqId) } : s
    ));
  };

  const examReadiness = Math.round(
    subjects.reduce((a, s) => a + s.progress, 0) / subjects.length
  );

  return (
    <AppContext.Provider value={{
      tasks, setTasks,
      subjects, setSubjects,
      tomorrowTasks,
      updateTask,
      examReadiness,
      showConfetti,
      rescheduledAlert,
      role, setRole,
      userName, setUserName,
      activePYQSubject, setActivePYQSubject,
      addPYQ, deletePYQ,
      fetchTodayTasks,
      apiTasksLoaded,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);