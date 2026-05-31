const API_BASE = '/api/auth';

const storeSession = (data) => {
  localStorage.setItem('token', data.token);
  localStorage.setItem('userRole', data.role || 'student');
  localStorage.setItem('user', JSON.stringify({
    _id: data._id,
    name: data.name,
    email: data.email,
    role: data.role,
  }));
};

const authService = {
  async loginStudent({ email, password }) {
    const res = await fetch(`${API_BASE}/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');

    storeSession({ ...data, role: data.role || 'student' });
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

    storeSession({ ...data, role: data.role || 'student' });
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

    storeSession({ ...data, role: data.role || 'teacher' });
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

    storeSession({ ...data, role: data.role || 'teacher' });
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
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      if (user?.name) return user;
    } catch {
      // legacy plain-string storage
    }
    const name = localStorage.getItem('user');
    const role = localStorage.getItem('userRole');
    return name ? { name, role } : null;
  },

  getToken() {
    return localStorage.getItem('token');
  },

  isLoggedIn() {
    return !!localStorage.getItem('token');
  },
};

export { authService };
