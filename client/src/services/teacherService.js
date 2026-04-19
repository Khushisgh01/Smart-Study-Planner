import { apiClient } from './apiClient';

export const teacherService = {
  // Create a new class
  createClass: async (classData) => {
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

  // Delete a class
  deleteClass: async (classId) => {
    return apiClient(`/class/${classId}`, {
      method: 'DELETE',
    });
  },

  // Add a subject (with chapters) to a specific class
  createSubject: async (classId, subjectData) => {
    return apiClient(`/subjects/class/${classId}`, {
      method: 'POST',
      body: subjectData,
    });
  },

  // Get subjects of a class
  getSubjectsByClass: async (classId) => {
    return apiClient(`/subjects/class/${classId}`, {
      method: 'GET',
    });
  },

  // Update a subject
  updateSubject: async (subjectId, data) => {
    return apiClient(`/subjects/${subjectId}`, {
      method: 'PUT',
      body: data,
    });
  },

  // Delete a subject
  deleteSubject: async (subjectId) => {
    return apiClient(`/subjects/${subjectId}`, {
      method: 'DELETE',
    });
  },

  // Generate tasks for a class (triggers AI task planning for all students)
  generateTasks: async (classId) => {
    return apiClient(`/tasks/generate/${classId}`, {
      method: 'POST',
    });
  },
};