const API_BASE = '/api';

const getAuthHeader = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export const teacherService = {
  // ── Classes ──────────────────────────────────────────────
  async getClasses() {
    const res = await fetch(`${API_BASE}/class`, { headers: getAuthHeader() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch classes');
    return data;
  },

  async createClass({ name, section }) {
    const res = await fetch(`${API_BASE}/class`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ name, section }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create class');
    return data;
  },

  async deleteClass(classId) {
    const res = await fetch(`${API_BASE}/class/${classId}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete class');
    return data;
  },

  // ── Subjects ─────────────────────────────────────────────
  async getSubjects(classId) {
    const res = await fetch(`${API_BASE}/subjects/class/${classId}`, { headers: getAuthHeader() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch subjects');
    return data;
  },

  // Bug 12 fix: createSubject was missing — TeacherPanel Save button now uses this
  async createSubject(classId, subjectData) {
    const res = await fetch(`${API_BASE}/subjects/class/${classId}`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(subjectData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create subject');
    return data;
  },

  async updateSubject(subjectId, updates) {
    const res = await fetch(`${API_BASE}/subjects/${subjectId}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update subject');
    return data;
  },

  async deleteSubject(subjectId) {
    const res = await fetch(`${API_BASE}/subjects/${subjectId}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete subject');
    return data;
  },

  // ── Tasks ─────────────────────────────────────────────────
  // Bug 1 fix: generate tasks for all enrolled students in class
  async generateTasks(classId) {
    const res = await fetch(`${API_BASE}/tasks/generate/${classId}`, {
      method: 'POST',
      headers: getAuthHeader(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to generate tasks');
    return data;
  },

  // ── Enrollment ────────────────────────────────────────────
  // Bug 15: enroll a student into a class
  async enrollStudent(classId) {
    const res = await fetch(`${API_BASE}/class/${classId}/enroll`, {
      method: 'POST',
      headers: getAuthHeader(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Enrollment failed');
    return data;
  },
};
