const express = require('express');
const router = express.Router();
const { Student, Quiz, Question, Submission, FileSubmission } = require('../models');
const upload = require('../middleware/upload');

// Public student registration/upsert
router.post('/', async (req, res) => {
  try {
    const { name, email, roll } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required' });
    const emailVal = email || `${(roll || name).toString().replace(/\s+/g, '_')}@local`;
    let student = await Student.findOne({ where: { email: emailVal } });
    if (!student) {
      student = await Student.create({ name, email: emailVal, roll });
    }
    res.json(student);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/:id', async (req, res) => {
  const s = await Student.findByPk(req.params.id);
  if (!s) return res.status(404).json({ error: 'Not found' });
  res.json(s);
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
