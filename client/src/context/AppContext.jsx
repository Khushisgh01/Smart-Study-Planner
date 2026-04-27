import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [userName, setUserName]           = useState(() => localStorage.getItem('user') || '');
  const [userRole, setUserRole]           = useState(() => localStorage.getItem('userRole') || '');
  const [tasks, setTasks]                 = useState([]);
  const [apiTasksLoaded, setApiTasksLoaded] = useState(false);

  // ✅ FIX: these three were never defined — Dashboard was getting undefined
  const [subjects, setSubjects]           = useState([]);
  const [tomorrowTasks, setTomorrowTasks] = useState([]);
  const [showConfetti, setShowConfetti]   = useState(false);

  // Sync userName to localStorage
  useEffect(() => {
    if (userName) localStorage.setItem('user', userName);
  }, [userName]);

  const setRole = (role) => {
    setUserRole(role);
    if (role) {
      localStorage.setItem('userRole', role);
    } else {
      localStorage.removeItem('userRole');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
    setUserName('');
    setUserRole('');
    setTasks([]);
    setSubjects([]);
    setTomorrowTasks([]);
    setShowConfetti(false);
    setApiTasksLoaded(false);
    window.location.href = '/';
  };

  // ✅ FIX: wrapped in useCallback so it's safe to use in useEffect deps
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

      // ✅ Trigger confetti if all tasks are done and there are tasks
      if (data.length > 0 && data.every(t => t.status === 'done')) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000);
      }
    } catch (err) {
      console.error('fetchTodayTasks error:', err);
      if (!apiTasksLoaded) setTasks([]);
    }
  }, [apiTasksLoaded]);

  // ✅ NEW: fetch subjects/progress for progress rings
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
      // Leave as [] — Dashboard handles empty gracefully
    }
  }, []);

  // ✅ NEW: fetch tomorrow's preview tasks
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
      // Leave as [] — Dashboard shows "No preview available yet"
    }
  }, []);

  return (
    <AppContext.Provider value={{
      userName,
      setUserName,
      userRole,
      setRole,
      logout,
      tasks,
      setTasks,
      apiTasksLoaded,
      fetchTodayTasks,
      // ✅ FIX: now actually provided to consumers
      subjects,
      setSubjects,
      fetchSubjects,
      tomorrowTasks,
      setTomorrowTasks,
      fetchTomorrowTasks,
      showConfetti,
      setShowConfetti,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
export default AppContext;