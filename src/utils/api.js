const API_BASE = import.meta.env.VITE_API_BASE !== undefined
  ? import.meta.env.VITE_API_BASE
  : (import.meta.env.DEV ? 'http://localhost:5000' : '');

function getToken() {
  return localStorage.getItem('ccna_admin_token');
}

async function request(path, opts = {}) {
  const headers = opts.headers || {};
  const token = getToken();
  if (token) headers['Authorization'] = 'Bearer ' + token;
  const res = await fetch(API_BASE + path, { ...opts, headers });
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch (e) {}
  if (!res.ok) throw { status: res.status, body: json || text };
  return json;
}

function normalizeStudent(student) {
  if (!student) return null;
  return {
    id: student.id,
    name: student.name,
    email: student.email,
    roll: student.roll,
    rollNumber: student.rollNumber || student.roll,
    password: student.password || 'student123',
    assignedCourseIds: Array.isArray(student.assignedCourseIds) ? student.assignedCourseIds : [],
  };
}

function normalizeTrainer(trainer) {
  if (!trainer) return null;
  return {
    id: trainer.id,
    name: trainer.name,
    email: trainer.email,
    password: trainer.password || 'password123',
    assignedCourseIds: Array.isArray(trainer.assignedCourseIds) ? trainer.assignedCourseIds : [],
  };
}

export async function loginAdmin(username, password) {
  return request('/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
}

export async function changeAdminPassword(currentPassword, newPassword) {
  return request('/admin/change-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ currentPassword, newPassword }) });
}

// Students API
export async function fetchStudents() {
  const data = await request('/students');
  return Array.isArray(data) ? data.map(normalizeStudent) : [];
}

export async function registerStudent({ name, email, roll, rollNumber, password, assignedCourseIds }) {
  const data = await request('/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, roll, rollNumber, password, assignedCourseIds }),
  });
  return normalizeStudent(data);
}

export async function loginStudent(identifier, password) {
  const data = await request('/students/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password }),
  });
  return { user: normalizeStudent(data.user) };
}

// Trainers API
export async function fetchTrainers() {
  const data = await request('/admin/trainers');
  return Array.isArray(data) ? data.map(normalizeTrainer) : [];
}

export async function createTrainer(payload) {
  const data = await request('/admin/trainers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return normalizeTrainer(data);
}

export async function updateTrainer(id, payload) {
  const data = await request(`/admin/trainers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return normalizeTrainer(data);
}

export async function deleteTrainer(id) {
  return request(`/admin/trainers/${id}`, { method: 'DELETE' });
}

export async function loginTrainer(email, password) {
  const data = await request('/admin/trainers/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return { user: normalizeTrainer(data.user) };
}

// Courses API
export async function fetchCourses() {
  const data = await request('/admin/courses');
  return Array.isArray(data) ? data : [];
}

export async function createCourse(payload) {
  return request('/admin/courses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function updateCourse(id, payload) {
  return request(`/admin/courses/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function deleteCourse(id) {
  return request(`/admin/courses/${id}`, { method: 'DELETE' });
}

// Quizzes API
export async function fetchQuizzes() {
  const data = await request('/admin/quizzes');
  return Array.isArray(data) ? data : [];
}

export async function createQuiz(payload) {
  return request('/admin/quizzes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function updateQuiz(id, payload) {
  return request(`/admin/quizzes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function deleteQuiz(id) {
  return request(`/admin/quizzes/${id}`, { method: 'DELETE' });
}

// Submissions API
export async function fetchSubmissions() {
  const data = await request('/submissions');
  return Array.isArray(data) ? data : [];
}

export async function submitStudentSubmission(payload) {
  const { studentId, quizId, answers, files } = payload;
  if (files && files.length) {
    const form = new FormData();
    form.append('quizId', quizId);
    form.append('answers', JSON.stringify(answers || {}));
    for (const f of files) form.append('files', f);
    const res = await fetch(`${API_BASE}/students/${studentId}/submissions`, { method: 'POST', body: form, headers: getToken() ? { 'Authorization': 'Bearer ' + getToken() } : undefined });
    if (!res.ok) throw new Error('Upload failed');
    return res.json();
  }

  return request(`/students/${studentId}/submissions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function uploadFilesToSubmission(submissionId, files) {
  const form = new FormData();
  for (const f of files) form.append('files', f);
  const res = await fetch(`${API_BASE}/submissions/${submissionId}/files`, { method: 'POST', body: form, headers: getToken() ? { 'Authorization': 'Bearer ' + getToken() } : undefined });
  if (!res.ok) throw new Error('Upload failed');
  return res.json();
}

export default {
  loginAdmin,
  changeAdminPassword,
  fetchStudents,
  registerStudent,
  loginStudent,
  fetchTrainers,
  createTrainer,
  updateTrainer,
  deleteTrainer,
  loginTrainer,
  fetchCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  fetchQuizzes,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  fetchSubmissions,
  submitStudentSubmission,
  uploadFilesToSubmission
};
