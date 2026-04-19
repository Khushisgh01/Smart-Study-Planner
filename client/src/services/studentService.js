import { apiClient } from './apiClient';

export const studentService = {
  // Fetch today's tasks for logged-in student
  getTodayTasks: async () => {
    return apiClient('/tasks/today');
  },

  // Fetch tomorrow's tasks
  getTomorrowTasks: async () => {
    return apiClient('/tasks/tomorrow');
  },

  // Update a task's status
  updateTaskStatus: async (taskId, status) => {
    return apiClient(`/tasks/${taskId}/status`, {
      method: 'PATCH',
      body: { status },
    });
  },

  // Get subjects for a specific class
  getSubjectsByClass: async (classId) => {
    return apiClient(`/subjects/class/${classId}`);
  },
};