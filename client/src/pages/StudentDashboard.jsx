// import React, { useEffect } from 'react';
// import { useApp } from '../context/AppContext';

// const StudentDashboard = () => {
//   const { userName, logout, tasks, fetchTodayTasks, apiTasksLoaded } = useApp();

//   // Bug 8: fetch real tasks on mount
//   useEffect(() => {
//     fetchTodayTasks();
//   }, []);

//   return (
//     <div style={{ padding: '28px 32px' }}>
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
//         <div>
//           <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 26, marginBottom: 4 }}>
//             Welcome, {userName || 'Student'}! 👋
//           </h2>
//           <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
//             {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
//           </p>
//         </div>
//         {/* Bug 5/6: uses AppContext logout which clears all localStorage */}
//         <button
//           onClick={logout}
//           style={{ padding: '9px 20px', borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}
//         >
//           Logout
//         </button>
//       </div>

//       <div>
//         <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 18, marginBottom: 16 }}>
//           Today's Tasks {apiTasksLoaded && <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' }}>({tasks.length})</span>}
//         </h3>

//         {!apiTasksLoaded ? (
//           <p style={{ color: 'var(--text-muted)' }}>Loading tasks…</p>
//         ) : tasks.length === 0 ? (
//           // Bug 8: show empty state instead of fake mock data
//           <div style={{
//             padding: '40px', textAlign: 'center', borderRadius: 16,
//             border: '2px dashed var(--border)', color: 'var(--text-muted)',
//           }}>
//             <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>No tasks for today</p>
//             <p style={{ fontSize: 13 }}>Your teacher hasn't generated tasks yet, or you're not enrolled in a class.</p>
//           </div>
//         ) : (
//           <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
//             {tasks.map(task => (
//               <div key={task._id} style={{
//                 padding: '14px 18px', borderRadius: 12,
//                 background: 'var(--bg-card)', border: '1px solid var(--border)',
//                 display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//               }}>
//                 <div>
//                   <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{task.chapter}</p>
//                   <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>{task.subject} · {task.taskType}</p>
//                 </div>
//                 <span style={{
//                   padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700,
//                   background: task.status === 'done' ? 'rgba(0,201,177,0.12)' : 'rgba(232,160,32,0.12)',
//                   color: task.status === 'done' ? '#00c9b1' : '#c9820a',
//                 }}>
//                   {task.status}
//                 </span>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default StudentDashboard;
import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';

const StudentDashboard = () => {
  const { userName, logout, tasks, fetchTodayTasks, apiTasksLoaded } = useApp();

  // Safe array — guards against undefined if AppContext isn't initialized yet
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  useEffect(() => {
    fetchTodayTasks();
  }, []);

  return (
    <div style={{ padding: '28px 32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 26, marginBottom: 4 }}>
            Welcome, {userName || 'Student'}! 👋
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button
          onClick={logout}
          style={{ padding: '9px 20px', borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}
        >
          Logout
        </button>
      </div>

      <div>
        <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 18, marginBottom: 16 }}>
          Today's Tasks {apiTasksLoaded && <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' }}>({safeTasks.length})</span>}
        </h3>

        {!apiTasksLoaded ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading tasks…</p>
        ) : safeTasks.length === 0 ? (
          <div style={{
            padding: '40px', textAlign: 'center', borderRadius: 16,
            border: '2px dashed var(--border)', color: 'var(--text-muted)',
          }}>
            <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>No tasks for today</p>
            <p style={{ fontSize: 13 }}>Your teacher hasn't generated tasks yet, or you're not enrolled in a class.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {safeTasks.map(task => (
              <div key={task._id} style={{
                padding: '14px 18px', borderRadius: 12,
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{task.chapter}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>{task.subject} · {task.taskType}</p>
                </div>
                <span style={{
                  padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                  background: task.status === 'done' ? 'rgba(0,201,177,0.12)' : 'rgba(232,160,32,0.12)',
                  color: task.status === 'done' ? '#00c9b1' : '#c9820a',
                }}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;