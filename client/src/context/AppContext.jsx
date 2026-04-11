import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

const mockTasks = [
  { _id:'1', subject:'Mathematics', chapter:'Differential Equations', taskType:'Learn', estimatedTime:60, status:'pending', priority:9 },
  { _id:'2', subject:'Physics', chapter:'Waves & Optics', taskType:'Revise1', estimatedTime:45, status:'pending', priority:7 },
  { _id:'3', subject:'Chemistry', chapter:'Organic Reactions', taskType:'PYQ', estimatedTime:30, status:'pending', priority:8 },
  { _id:'4', subject:'Mathematics', chapter:'Integration', taskType:'Revise2', estimatedTime:50, status:'pending', priority:6 },
];

const mockSubjects = [
  { _id:'s1', name:'Mathematics', progress:62, color:'#4f6ef7', examDate:'2025-06-15', badge:'High Weight', chapters:[{name:'Differential Equations',weightage:9},{name:'Integration',weightage:7}] },
  { _id:'s2', name:'Physics', progress:38, color:'#00c9b1', examDate:'2025-06-18', badge:'Urgent', chapters:[{name:'Waves & Optics',weightage:8},{name:'Mechanics',weightage:6}] },
  { _id:'s3', name:'Chemistry', progress:51, color:'#ff2d78', examDate:'2025-06-20', badge:'Weak', chapters:[{name:'Organic Reactions',weightage:8}] },
  { _id:'s4', name:'Biology', progress:74, color:'#ffb700', examDate:'2025-06-22', badge:'On Track', chapters:[{name:'Cell Division',weightage:5}] },
];

const mockTomorrowTasks = [
  { _id:'t1', subject:'Physics', chapter:'Thermodynamics', taskType:'Learn', estimatedTime:55 },
  { _id:'t2', subject:'Mathematics', chapter:'Vectors', taskType:'PYQ', estimatedTime:35 },
];

export function AppProvider({ children }) {
  const [tasks, setTasks] = useState(mockTasks);
  const [subjects] = useState(mockSubjects);
  const [tomorrowTasks] = useState(mockTomorrowTasks);
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [rescheduledAlert, setRescheduledAlert] = useState(null);

  const updateTask = (id, status) => {
    setTasks(prev => prev.map(t => t._id === id ? { ...t, status } : t));
    if (status === 'skipped' || status === 'partial') {
      setRescheduledAlert(id);
      setTimeout(() => setRescheduledAlert(null), 3000);
    }
    const updated = tasks.map(t => t._id === id ? { ...t, status } : t);
    const allDone = updated.every(t => t.status === 'done');
    if (allDone) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }
  };

  const examReadiness = Math.round(
    subjects.reduce((a, s) => a + s.progress, 0) / subjects.length
  );

  return (
    <AppContext.Provider value={{ tasks, subjects, tomorrowTasks, updateTask, examReadiness, showConfetti, activeView, setActiveView, rescheduledAlert }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);