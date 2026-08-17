const express = require('express');
const router = express.Router();
const { Student, Quiz, Question, Submission, FileSubmission } = require('../models');
const upload = require('../middleware/upload');

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

router.get('/', async (req, res) => {
  try {
    const students = await Student.findAll({ order: [['id', 'DESC']] });
    res.json(students.map(normalizeStudent));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Public student registration/upsert
router.post('/', async (req, res) => {
  try {
    const { name, email, roll, rollNumber, password, assignedCourseIds = [] } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required' });
    const emailVal = email || `${(roll || rollNumber || name).toString().replace(/\s+/g, '_')}@local`;
    const rollVal = roll || rollNumber || 'STU-' + Date.now();
    let student = await Student.findOne({ where: { email: emailVal } });
    if (!student) {
      student = await Student.create({
        name,
        email: emailVal,
        roll: rollVal,
        rollNumber: rollVal,
        password: password || 'student123',
        assignedCourseIds,
      });
    }
    res.json(normalizeStudent(student));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { identifier, email, password } = req.body;
    const loginValue = identifier || email;
    if (!loginValue || !password) return res.status(400).json({ error: 'Missing credentials' });

    const student = await Student.findOne({
      where: { email: loginValue }
    }) || await Student.findOne({
      where: { rollNumber: loginValue }
    }) || await Student.findOne({
      where: { roll: loginValue }
    });

    if (!student) return res.status(401).json({ error: 'Invalid Student ID/Email or Password' });
    if (student.password !== password) return res.status(401).json({ error: 'Invalid Student ID/Email or Password' });

    res.json({ user: normalizeStudent(student) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/:id', async (req, res) => {
  const s = await Student.findByPk(req.params.id);
  if (!s) return res.status(404).json({ error: 'Not found' });
  res.json(normalizeStudent(s));
});

router.get('/:id/quizzes', async (req, res) => {
  const quizzes = await Quiz.findAll({ include: [Question] });
  res.json(quizzes);
});

// Student submits answers and optionally files (section B)
router.post('/:id/submissions', async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const contentType = req.headers['content-type'] || '';
    const isMultipart = contentType.includes('multipart/form-data');

    const handleSubmission = async () => {
      const { quizId } = req.body;
      let answers = req.body.answers;
      if (typeof answers === 'string') {
        try { answers = JSON.parse(answers); } catch (e) { /* keep as string */ }
      }

      const submission = await Submission.create({ StudentId: student.id, QuizId: quizId, answers: answers || null });

      if (req.files && req.files.length) {
        const fileRecords = req.files.map(f => ({
          filename: f.filename,
          originalName: f.originalname,
          mimeType: f.mimetype,
          size: f.size,
          url: `/uploads/${f.filename}`,
          SubmissionId: submission.id,
        }));
        await FileSubmission.bulkCreate(fileRecords);
      }

      res.json({ submissionId: submission.id });
    };

    if (isMultipart) {
      upload.array('files')(req, res, async function (err) {
        if (err) return res.status(500).json({ error: err.message });
        await handleSubmission();
      });
    } else {
      // JSON body
      await handleSubmission();
    }

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
