import React, { useEffect, useState } from 'react';
import { teacherService } from '../services/teacherService';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const TeacherDashboard = () => {
  const [classes, setClasses] = useState([]);
  const [newClassName, setNewClassName] = useState('9'); // Default to Class 9
  const [newSection, setNewSection] = useState('');
  const navigate = useNavigate();

  const fetchClasses = async () => {
    try {
      const data = await teacherService.getClasses();
      setClasses(data);
    } catch (err) {
      console.error('Failed to fetch classes:', err);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      await teacherService.createClass({ name: newClassName, section: newSection });
      setNewClassName('9'); // Reset to default
      setNewSection('');
      fetchClasses(); // Refresh the list
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    authService.logout();
  };

  return (
    <div className="dashboard-container">
      <header>
        <h2>Teacher Dashboard</h2>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <section className="create-class-section">
        <h3>Create New Class</h3>
        <form onSubmit={handleCreateClass}>
          
          {/* CHANGED: Dropdown for Class 9, 10, 11, 12 */}
          <select 
            value={newClassName} 
            onChange={(e) => setNewClassName(e.target.value)} 
            required
          >
            <option value="9">Class 9</option>
            <option value="10">Class 10</option>
            <option value="11">Class 11</option>
            <option value="12">Class 12</option>
          </select>

          <input 
            placeholder="Section (e.g., A)" 
            value={newSection} 
            onChange={(e) => setNewSection(e.target.value)} 
            required 
          />
          <button type="submit">Create Class</button>
        </form>
      </section>

      <section className="classes-list">
        <h3>My Classes</h3>
        {classes.length === 0 ? <p>No classes found.</p> : (
          <ul>
            {classes.map((cls) => (
              <li key={cls._id}>
                <h4>Class {cls.name} - Section {cls.section}</h4>
                <p>Subjects: {cls.subjects?.map(sub => sub.name).join(', ') || 'None'}</p>
                <button onClick={() => navigate(`/teacher/class/${cls._id}/add-subject`)}>
                  Add Subject
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default TeacherDashboard;