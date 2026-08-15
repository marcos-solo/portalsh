const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Admin, Student, Quiz, Question, Submission, FileSubmission } = require('../models');
require('dotenv').config();

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Unauthorized' });
  const token = auth.replace('Bearer ', '');
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.admin = data;
    next();
  } catch (e) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hash = bcrypt.hashSync(password, 10);
    const admin = await Admin.create({ username, passwordHash: hash });
    res.json({ id: admin.id, username: admin.username });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ where: { username } });
  if (!admin) return res.status(401).json({ error: 'Invalid' });
  const ok = bcrypt.compareSync(password, admin.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid' });
  const token = jwt.sign({ id: admin.id, username: admin.username }, process.env.JWT_SECRET || 'secret');
  res.json({ token });
});

// Protected routes
router.post('/students', authMiddleware, async (req, res) => {
  try {
    const s = await Student.create(req.body);
    res.json(s);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.post('/quizzes', authMiddleware, async (req, res) => {
  try {
    const q = await Quiz.create(req.body);
    res.json(q);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.post('/quizzes/:quizId/questions', authMiddleware, async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.quizId);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    const question = await Question.create({ ...req.body, QuizId: quiz.id });
    res.json(question);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.get('/submissions', authMiddleware, async (req, res) => {
  const subs = await Submission.findAll({ include: [Student, Quiz, FileSubmission] });
  res.json(subs);
});

// Change password (admin must provide current password)
router.post('/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Missing fields' });
    const admin = await Admin.findByPk(req.admin.id);
    if (!admin) return res.status(404).json({ error: 'Admin not found' });
    const ok = admin.verifyPassword(currentPassword);
    if (!ok) return res.status(401).json({ error: 'Invalid current password' });
    const bcrypt = require('bcryptjs');
    admin.passwordHash = bcrypt.hashSync(newPassword, 10);
    await admin.save();
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
