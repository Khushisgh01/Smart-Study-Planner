// import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// const AppContext = createContext();

// export const AppProvider = ({ children }) => {
//   const [userName, setUserName]           = useState(() => localStorage.getItem('user') || '');
//   const [userRole, setUserRole]           = useState(() => localStorage.getItem('userRole') || '');
//   const [tasks, setTasks]                 = useState([]);
//   const [apiTasksLoaded, setApiTasksLoaded] = useState(false);

//   // ✅ FIX: these three were never defined — Dashboard was getting undefined
//   const [subjects, setSubjects]           = useState([]);
//   const [tomorrowTasks, setTomorrowTasks] = useState([]);
//   const [showConfetti, setShowConfetti]   = useState(false);

//   // Sync userName to localStorage
//   useEffect(() => {
//     if (userName) localStorage.setItem('user', userName);
//   }, [userName]);

//   const setRole = (role) => {
//     setUserRole(role);
//     if (role) {
//       localStorage.setItem('userRole', role);
//     } else {
//       localStorage.removeItem('userRole');
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('userRole');
//     localStorage.removeItem('user');
//     setUserName('');
//     setUserRole('');
//     setTasks([]);
//     setSubjects([]);
//     setTomorrowTasks([]);
//     setShowConfetti(false);
//     setApiTasksLoaded(false);
//     window.location.href = '/';
//   };

//   // ✅ FIX: wrapped in useCallback so it's safe to use in useEffect deps
//   const fetchTodayTasks = useCallback(async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) return;

//       const res = await fetch('/api/tasks/today', {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!res.ok) throw new Error('Failed to fetch tasks');

//       const data = await res.json();
//       setTasks(data);
//       setApiTasksLoaded(true);

//       // ✅ Trigger confetti if all tasks are done and there are tasks
//       if (data.length > 0 && data.every(t => t.status === 'done')) {
//         setShowConfetti(true);
//         setTimeout(() => setShowConfetti(false), 4000);
//       }
//     } catch (err) {
//       console.error('fetchTodayTasks error:', err);
//       if (!apiTasksLoaded) setTasks([]);
//     }
//   }, [apiTasksLoaded]);

//   // ✅ NEW: fetch subjects/progress for progress rings
//   const fetchSubjects = useCallback(async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) return;

//       const res = await fetch('/api/subjects', {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!res.ok) throw new Error('Failed to fetch subjects');

//       const data = await res.json();
//       setSubjects(data);
//     } catch (err) {
//       console.error('fetchSubjects error:', err);
//       // Leave as [] — Dashboard handles empty gracefully
//     }
//   }, []);

//   // ✅ NEW: fetch tomorrow's preview tasks
//   const fetchTomorrowTasks = useCallback(async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) return;

//       const res = await fetch('/api/tasks/tomorrow', {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!res.ok) throw new Error('Failed to fetch tomorrow tasks');

//       const data = await res.json();
//       setTomorrowTasks(data);
//     } catch (err) {
//       console.error('fetchTomorrowTasks error:', err);
//       // Leave as [] — Dashboard shows "No preview available yet"
//     }
//   }, []);

//   return (
//     <AppContext.Provider value={{
//       userName,
//       setUserName,
//       userRole,
//       setRole,
//       logout,
//       tasks,
//       setTasks,
//       apiTasksLoaded,
//       fetchTodayTasks,
//       // ✅ FIX: now actually provided to consumers
//       subjects,
//       setSubjects,
//       fetchSubjects,
//       tomorrowTasks,
//       setTomorrowTasks,
//       fetchTomorrowTasks,
//       showConfetti,
//       setShowConfetti,
//     }}>
//       {children}
//     </AppContext.Provider>
//   );
// };

// export const useApp = () => useContext(AppContext);
// export default AppContext;
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [userName, setUserName] = useState(() => {
    try {
      const raw = localStorage.getItem('user');
      const parsed = JSON.parse(raw);
      return parsed?.name || parsed || '';
    } catch {
      return localStorage.getItem('user') || '';
    }
  });
  const [userRole, setUserRole]             = useState(() => localStorage.getItem('userRole') || '');
  const [tasks, setTasks]                   = useState([]);
  const [apiTasksLoaded, setApiTasksLoaded] = useState(false);
  const [subjects, setSubjects]             = useState([]);
  const [tomorrowTasks, setTomorrowTasks]   = useState([]);
  const [showConfetti, setShowConfetti]     = useState(false);
  // ✅ FIX Bug 30: rescheduledAlert drives the TaskCard animation
  const [rescheduledAlert, setRescheduledAlert] = useState(null);

  // ✅ FIX Bug 28: examReadiness computed from REAL subjects, never mock
  const examReadiness = subjects.length > 0
    ? Math.round(subjects.reduce((a, s) => a + (s.progress ?? 0), 0) / subjects.length)
    : 0;

  const setRole = (role) => {
    setUserRole(role);
    if (role) localStorage.setItem('userRole', role);
    else localStorage.removeItem('userRole');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
    localStorage.removeItem('activeClassId');
    setUserName('');
    setUserRole('');
    setTasks([]);
    setSubjects([]);
    setTomorrowTasks([]);
    setShowConfetti(false);
    setApiTasksLoaded(false);
    window.location.href = '/';
  };

  const fetchTodayTasks = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch('/api/tasks/today', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      setTasks(data);
      setApiTasksLoaded(true);
      if (data.length > 0 && data.every(t => t.status === 'done')) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000);
      }
    } catch (err) {
      console.error('fetchTodayTasks error:', err);
      setApiTasksLoaded(true);
      setTasks([]);
    }
  }, []);

  // ✅ FIX Bug 27: fetchSubjects now called automatically on mount
  const fetchSubjects = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch('/api/subjects', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch subjects');
      const data = await res.json();
      setSubjects(data);
    } catch (err) {
      console.error('fetchSubjects error:', err);
      // leaves as [] — Dashboard handles empty gracefully
    }
  }, []);

  const fetchTomorrowTasks = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch('/api/tasks/tomorrow', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch tomorrow tasks');
      const data = await res.json();
      setTomorrowTasks(data);
    } catch (err) {
      console.error('fetchTomorrowTasks error:', err);
    }
  }, []);

  // ✅ FIX Bug 27: auto-fetch for students on mount — no more mock data
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role  = localStorage.getItem('userRole');
    if (token && role === 'student') {
      fetchSubjects();
      fetchTodayTasks();
      fetchTomorrowTasks();
    }
  }, []);

  // ✅ FIX Bug 30: updateTask calls real API + triggers rescheduled animation
  const updateTask = useCallback(async (taskId, status) => {
    if (status === 'skipped') {
      setRescheduledAlert(taskId);
      setTimeout(() => setRescheduledAlert(null), 3500);
    }
    // Optimistic update
    setTasks(prev => {
      const updated = prev.map(t => t._id === taskId ? { ...t, status } : t);
      if (updated.length > 0 && updated.every(t => t.status === 'done')) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000);
      }
      return updated;
    });
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch (err) {
      console.error('updateTask error:', err);
      // Revert on failure
      fetchTodayTasks();
    }
  }, [fetchTodayTasks]);

  return (
    <AppContext.Provider value={{
      userName, setUserName,
      userRole, setRole,
      logout,
      tasks, setTasks,
      apiTasksLoaded,
      fetchTodayTasks,
      subjects, setSubjects, fetchSubjects,
      tomorrowTasks, setTomorrowTasks, fetchTomorrowTasks,
      showConfetti, setShowConfetti,
      // ✅ FIX Bug 28: real computed value from API subjects
      examReadiness,
      // ✅ FIX Bug 30: live task updates + reschedule animation
      updateTask,
      rescheduledAlert,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
export default AppContext;