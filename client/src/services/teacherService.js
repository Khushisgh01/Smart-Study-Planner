import { apiClient } from './apiClient';

export const teacherService = {
  // Create a new class
  createClass: async (classData) => {
    // classData expects: name, section
    return apiClient('/class', {
      method: 'POST',
      body: classData,
    });
  },

  // Get all classes for the logged-in teacher
  getClasses: async () => {
    return apiClient('/class', {
      method: 'GET',
    });
  },

  // Add a subject (with chapters) to a specific class
  createSubject: async (classId, subjectData) => {
    // subjectData expects: name, examDate, color, chapters[]
    return apiClient(`/subjects/class/${classId}`, {
      method: 'POST',
      body: subjectData,
    });
  }
};