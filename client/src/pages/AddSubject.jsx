import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { teacherService } from '../services/teacherService';

const AddSubject = () => {
  const { classId } = useParams(); // Gets classId from URL: /teacher/class/:classId/add-subject
  const navigate = useNavigate();
  
  const [subjectData, setSubjectData] = useState({
    name: '',
    examDate: '',
    color: '#1a3fa3'
  });

  // State to manage multiple chapters
  const [chapters, setChapters] = useState([
    { name: '', weightage: 0, difficulty: 'medium', pyqFrequency: 'medium', estimatedTime: 0 }
  ]);

  const handleSubjectChange = (e) => {
    setSubjectData({ ...subjectData, [e.target.name]: e.target.value });
  };

  const handleChapterChange = (index, field, value) => {
    const newChapters = [...chapters];
    // Convert to number if it's weightage or estimatedTime mapping (noted in backend docs)
    newChapters[index][field] = (field === 'weightage' || field === 'estimatedTime') ? Number(value) : value;
    setChapters(newChapters);
  };

  const addChapterField = () => {
    setChapters([...chapters, { name: '', weightage: 0, difficulty: 'medium', pyqFrequency: 'medium', estimatedTime: 0 }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...subjectData,
        chapters: chapters
      };
      await teacherService.createSubject(classId, payload);
      alert('Subject added successfully!');
      navigate('/teacher/dashboard');
    } catch (err) {
      alert(err.message || 'Failed to add subject');
    }
  };

  return (
    <div className="add-subject-container">
      <h2>Add New Subject</h2>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Subject Details</legend>
          <input name="name" placeholder="Subject Name (e.g. Mathematics)" onChange={handleSubjectChange} required />
          <input name="examDate" type="date" onChange={handleSubjectChange} required />
          <input name="color" type="color" value={subjectData.color} onChange={handleSubjectChange} />
        </fieldset>

        <fieldset>
          <legend>Chapters</legend>
          {chapters.map((chap, index) => (
            <div key={index} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px' }}>
              <input 
                placeholder="Chapter Name" 
                value={chap.name} 
                onChange={(e) => handleChapterChange(index, 'name', e.target.value)} 
                required 
              />
              <input 
                type="number" 
                placeholder="Weightage" 
                value={chap.weightage} 
                onChange={(e) => handleChapterChange(index, 'weightage', e.target.value)} 
                required 
              />
              <select value={chap.difficulty} onChange={(e) => handleChapterChange(index, 'difficulty', e.target.value)}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <select value={chap.pyqFrequency} onChange={(e) => handleChapterChange(index, 'pyqFrequency', e.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <input 
                type="number" 
                placeholder="Est. Time (mins)" 
                value={chap.estimatedTime} 
                onChange={(e) => handleChapterChange(index, 'estimatedTime', e.target.value)} 
                required 
              />
            </div>
          ))}
          <button type="button" onClick={addChapterField}>+ Add Another Chapter</button>
        </fieldset>

        <button type="submit" style={{ marginTop: '20px' }}>Save Subject</button>
      </form>
    </div>
  );
};

export default AddSubject;