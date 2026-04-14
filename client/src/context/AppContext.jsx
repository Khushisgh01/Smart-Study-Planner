import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

const mockTasks = [
  { _id:'1', subject:'Mathematics', chapter:'Differential Equations', taskType:'Learn', estimatedTime:60, status:'pending', priority:9 },
  { _id:'2', subject:'Physics', chapter:'Waves & Optics', taskType:'Revise1', estimatedTime:45, status:'pending', priority:7 },
  { _id:'3', subject:'Chemistry', chapter:'Organic Reactions', taskType:'PYQ', estimatedTime:30, status:'pending', priority:8 },
  { _id:'4', subject:'Mathematics', chapter:'Integration', taskType:'Revise2', estimatedTime:50, status:'pending', priority:6 },
  { _id:'5', subject:'Biology', chapter:'Cell Division', taskType:'Learn', estimatedTime:40, status:'done', priority:5 },
];

const mockSubjects = [
  { _id:'s1', name:'Mathematics', progress:62, color:'#1a3fa3', examDate:'2025-06-15', badge:'High Weight',
    chapters:[{name:'Differential Equations',weightage:9},{name:'Integration',weightage:7},{name:'Vectors',weightage:6}],
    pyqs:[ { _id:'p1', year:'2024', title:'CRPS Class 12 Maths Board PYQ', fileUrl:'#', uploadedAt:'2024-01-10' },
           { _id:'p2', year:'2023', title:'CRPS Class 12 Maths PYQ 2023', fileUrl:'#', uploadedAt:'2023-12-15' } ]
  },
  { _id:'s2', name:'Physics', progress:38, color:'#00c9b1', examDate:'2025-06-18', badge:'Urgent',
    chapters:[{name:'Waves & Optics',weightage:8},{name:'Mechanics',weightage:6},{name:'Thermodynamics',weightage:7}],
    pyqs:[ { _id:'p3', year:'2024', title:'CRPS Physics Board PYQ 2024', fileUrl:'#', uploadedAt:'2024-01-10' } ]
  },
  { _id:'s3', name:'Chemistry', progress:51, color:'#ff2d78', examDate:'2025-06-20', badge:'Weak',
    chapters:[{name:'Organic Reactions',weightage:8},{name:'Electrochemistry',weightage:7}],
    pyqs:[]
  },
  { _id:'s4', name:'Biology', progress:74, color:'#e8a020', examDate:'2025-06-22', badge:'On Track',
    chapters:[{name:'Cell Division',weightage:5},{name:'Genetics',weightage:8}],
    pyqs:[ { _id:'p4', year:'2024', title:'CRPS Biology PYQ 2024', fileUrl:'#', uploadedAt:'2024-01-12' } ]
  },
];

const mockTomorrowTasks = [
  { _id:'t1', subject:'Physics', chapter:'Thermodynamics', taskType:'Learn', estimatedTime:55 },
  { _id:'t2', subject:'Mathematics', chapter:'Vectors', taskType:'PYQ', estimatedTime:35 },
  { _id:'t3', subject:'Chemistry', chapter:'Electrochemistry', taskType:'Revise1', estimatedTime:40 },
];

export function AppProvider({ children }) {
  const [tasks, setTasks] = useState(mockTasks);
  const [subjects, setSubjects] = useState(mockSubjects);
  const [tomorrowTasks] = useState(mockTomorrowTasks);
  const [showConfetti, setShowConfetti] = useState(false);
  const [rescheduledAlert, setRescheduledAlert] = useState(null);
  const [role, setRole] = useState(null); // 'student' | 'teacher'
  const [userName, setUserName] = useState('Arjun');
  const [activePYQSubject, setActivePYQSubject] = useState(null);

  const updateTask = (id, status) => {
    setTasks(prev => {
      const updated = prev.map(t => t._id === id ? { ...t, status } : t);
      const allDone = updated.every(t => t.status !== 'pending');
      if (allDone) { setShowConfetti(true); setTimeout(() => setShowConfetti(false), 5000); }
      return updated;
    });
    if (status === 'skipped' || status === 'partial') {
      setRescheduledAlert(id);
      setTimeout(() => setRescheduledAlert(null), 3000);
    }
  };

  const addPYQ = (subjectId, pyq) => {
    setSubjects(prev => prev.map(s =>
      s._id === subjectId ? { ...s, pyqs: [...s.pyqs, { _id: Date.now().toString(), ...pyq, uploadedAt: new Date().toISOString().split('T')[0] }] } : s
    ));
  };

  const deletePYQ = (subjectId, pyqId) => {
    setSubjects(prev => prev.map(s =>
      s._id === subjectId ? { ...s, pyqs: s.pyqs.filter(p => p._id !== pyqId) } : s
    ));
  };

  const examReadiness = Math.round(subjects.reduce((a, s) => a + s.progress, 0) / subjects.length);

  return (
    <AppContext.Provider value={{
      tasks, subjects, setSubjects, tomorrowTasks,
      updateTask, examReadiness, showConfetti,
      rescheduledAlert, role, setRole,
      userName, setUserName,
      activePYQSubject, setActivePYQSubject,
      addPYQ, deletePYQ,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);