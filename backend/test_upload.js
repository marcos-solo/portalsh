const fs = require('fs');
const path = require('path');

const UPLOAD_URL = 'http://localhost:5000';

async function run() {
  // create a small dummy file
  const tmp = path.join(__dirname, 'uploads');
  if (!fs.existsSync(tmp)) fs.mkdirSync(tmp, { recursive: true });
  const filePath = path.join(tmp, 'smoke_upload.txt');
  fs.writeFileSync(filePath, 'smoke test ' + Date.now());

  // First create a student and submit (multipart) to /students/:id/submissions
  const form = new FormData();
  form.append('quizId', '1');
  form.append('answers', JSON.stringify({ '1': '2' }));
  form.append('files', fs.createReadStream(filePath));

  // Node has fetch in modern versions
  const res = await fetch(`${UPLOAD_URL}/students/1/submissions`, { method: 'POST', body: form });
  console.log('status:', res.status);
  const json = await res.json().catch(() => null);
  console.log('body:', json);
}

run().catch(e => { console.error(e); process.exit(1); });
