const API_BASE = '/api/auth';

const authService = {
  async loginStudent({ email, password }) {
    const res = await fetch(`${API_BASE}/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', data.name);
    localStorage.setItem('userRole', data.role || 'student'); // Bug 4/5: store role from API
    return data;
  },

  async registerStudent(payload) {
    const res = await fetch(`${API_BASE}/user/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', data.name);
    localStorage.setItem('userRole', data.role || 'student');
    return data;
  },

  async loginTeacher({ email, password }) {
    const res = await fetch(`${API_BASE}/teacher/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', data.name);
    localStorage.setItem('userRole', data.role || 'teacher'); // Bug 4/5: store role
    return data;
  },

  async registerTeacher(payload) {
    const res = await fetch(`${API_BASE}/teacher/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', data.name);
    localStorage.setItem('userRole', data.role || 'teacher');
    return data;
  },

  // Bug 5 fix: clear ALL auth keys, not just 'token'
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('activeClassId');
    window.location.href = '/';
  },

  getCurrentUser() {
    const name = localStorage.getItem('user');
    const role = localStorage.getItem('userRole');
    const token = localStorage.getItem('token');
    if (!token) return null;
    return { name, role };
  },

  getToken() {
    return localStorage.getItem('token');
  },

  isLoggedIn() {
    return !!localStorage.getItem('token');
  },
};

export { authService };
