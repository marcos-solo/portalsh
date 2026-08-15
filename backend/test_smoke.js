// Smoke test script: registers admin, logs in, creates student, quiz, question, and submits answers.
const base = 'http://localhost:5000';

const wait = ms => new Promise(r => setTimeout(r, ms));

async function req(path, opts) {
  const res = await fetch(base + path, opts);
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch (e) { }
  return { status: res.status, bodyText: text, json };
}

async function main() {
  // wait for server
  let ok = false;
  for (let i=0;i<15;i++) {
    try {
      const r = await fetch(base + '/');
      ok = true; break;
    } catch (e) {
      process.stdout.write('.');
      await wait(1000);
    }
  }
  if (!ok) { console.error('Server not reachable'); process.exit(1); }

  console.log('\nRegistering admin...');
  await req('/admin/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: 'admin', password: 'password123' }) }).catch(()=>{});

  const login = await req('/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: 'admin', password: 'password123' }) });
  if (login.status !== 200 || !login.json || !login.json.token) {
    console.error('Login failed', login.status, login.bodyText); process.exit(1);
  }
  const token = login.json.token;
  console.log('Logged in, token length', token.length);

  console.log('Creating student...');
  const studentRes = await req('/admin/students', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }, body: JSON.stringify({ name: 'Test Student', email: 'teststudent@example.com' }) });
  console.log('Student create:', studentRes.status, studentRes.json && studentRes.json.id);
  const studentId = (studentRes.json && studentRes.json.id) || 1;

  console.log('Creating quiz...');
  const quizRes = await req('/admin/quizzes', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }, body: JSON.stringify({ title: 'Sample Quiz', description: 'Smoke test quiz' }) });
  console.log('Quiz create:', quizRes.status, quizRes.json && quizRes.json.id);
  const quizId = (quizRes.json && quizRes.json.id) || 1;

  console.log('Adding question...');
  const qRes = await req(`/admin/quizzes/${quizId}/questions`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }, body: JSON.stringify({ text: 'What is 1+1?', choices: ['1','2','3'], answer: '2' }) });
  console.log('Question create:', qRes.status, qRes.json && qRes.json.id);

  console.log('Submitting answers as student...');
  const subRes = await req(`/students/${studentId}/submissions`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ quizId, answers: { '1': '2' } }) });
  console.log('Submission result:', subRes.status, subRes.json || subRes.bodyText);

  console.log('Fetching submissions (admin)...');
  const allSub = await req('/admin/submissions', { method: 'GET', headers: { 'Authorization': 'Bearer ' + token } });
  console.log('Admin submissions:', allSub.status, allSub.json && allSub.json.length);
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
