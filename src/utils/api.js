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

export async function loginAdmin(username, password) {
  return request('/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
}

export async function changeAdminPassword(currentPassword, newPassword) {
  return request('/admin/change-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ currentPassword, newPassword }) });
}

export async function registerStudent({ name, email, roll }) {
  return request('/students', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, roll }) });
}

export async function submitStudentSubmission({ studentId, quizId, answers, files }) {
  // If files provided, use FormData
  if (files && files.length) {
    const form = new FormData();
    form.append('quizId', quizId);
    form.append('answers', JSON.stringify(answers || {}));
    for (const f of files) form.append('files', f);
    const res = await fetch(`${API_BASE}/students/${studentId}/submissions`, { method: 'POST', body: form, headers: getToken() ? { 'Authorization': 'Bearer ' + getToken() } : undefined });
    if (!res.ok) throw new Error('Upload failed');
    return res.json();
  }

  return request(`/students/${studentId}/submissions`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ quizId, answers }) });
}

export async function uploadFilesToSubmission(submissionId, files) {
  const form = new FormData();
  for (const f of files) form.append('files', f);
  const res = await fetch(`${API_BASE}/submissions/${submissionId}/files`, { method: 'POST', body: form, headers: getToken() ? { 'Authorization': 'Bearer ' + getToken() } : undefined });
  if (!res.ok) throw new Error('Upload failed');
  return res.json();
}

export default { loginAdmin, changeAdminPassword, registerStudent, submitStudentSubmission, uploadFilesToSubmission };
