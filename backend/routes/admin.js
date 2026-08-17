const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Admin, Trainer, Student, Course, Quiz, Question, Submission, FileSubmission } = require('../models');
require('dotenv').config();

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

function normalizeTrainer(trainer, passwordOverride) {
  if (!trainer) return null;
  return {
    id: trainer.id,
    name: trainer.name,
    email: trainer.email,
    password: passwordOverride || trainer.password || 'password123',
    assignedCourseIds: Array.isArray(trainer.assignedCourseIds) ? trainer.assignedCourseIds : [],
  };
}

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

router.post('/trainers/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const trainer = await Trainer.findOne({ where: { email } });
    if (!trainer) return res.status(401).json({ error: 'Invalid trainer credentials' });
    const ok = trainer.verifyPassword(password);
    if (!ok) return res.status(401).json({ error: 'Invalid trainer credentials' });
    res.json({ user: normalizeTrainer(trainer, password) });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.get('/trainers', async (req, res) => {
  try {
    const trainers = await Trainer.findAll({ order: [['id', 'DESC']] });
    res.json(trainers.map(t => normalizeTrainer(t)));
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.post('/trainers', async (req, res) => {
  try {
    const { name, email, password, assignedCourseIds = [] } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });
    const pass = password || 'password123';
    const passwordHash = bcrypt.hashSync(pass, 10);
    const trainer = await Trainer.create({ name, email, passwordHash, assignedCourseIds });
    res.json(normalizeTrainer(trainer, pass));
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.put('/trainers/:id', async (req, res) => {
  try {
    const trainer = await Trainer.findByPk(req.params.id);
    if (!trainer) return res.status(404).json({ error: 'Trainer not found' });
    const { name, email, password, assignedCourseIds } = req.body;
    if (name) trainer.name = name;
    if (email) trainer.email = email;
    if (password) trainer.passwordHash = bcrypt.hashSync(password, 10);
    if (assignedCourseIds) trainer.assignedCourseIds = assignedCourseIds;
    await trainer.save();
    res.json(normalizeTrainer(trainer, password));
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.delete('/trainers/:id', async (req, res) => {
  try {
    const trainer = await Trainer.findByPk(req.params.id);
    if (!trainer) return res.status(404).json({ error: 'Trainer not found' });
    await trainer.destroy();
    res.json({ success: true, id: req.params.id });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Protected & Public Student endpoints
router.post('/students', async (req, res) => {
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
    res.status(400).json({ error: e.message });
  }
});

router.get('/students', async (req, res) => {
  try {
    const students = await Student.findAll({ order: [['id', 'DESC']] });
    res.json(students.map(normalizeStudent));
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Courses Endpoints
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.findAll({ order: [['id', 'ASC']] });
    res.json(courses);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.post('/courses', async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.json(course);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.put('/courses/:id', async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    await course.update(req.body);
    res.json(course);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.delete('/courses/:id', async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    await course.destroy();
    res.json({ success: true, id: req.params.id });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Quizzes Endpoints
router.get('/quizzes', async (req, res) => {
  try {
    const quizzes = await Quiz.findAll({ order: [['id', 'ASC']] });
    res.json(quizzes);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.post('/quizzes', async (req, res) => {
  try {
    const q = await Quiz.create(req.body);
    res.json(q);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.put('/quizzes/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    await quiz.update(req.body);
    res.json(quiz);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.delete('/quizzes/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    await quiz.destroy();
    res.json({ success: true, id: req.params.id });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.post('/quizzes/:quizId/questions', async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.quizId);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    const question = await Question.create({ ...req.body, QuizId: quiz.id });
    res.json(question);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.get('/submissions', async (req, res) => {
  try {
    const subs = await Submission.findAll({ order: [['id', 'DESC']], include: [Student, Quiz, FileSubmission] });
    res.json(subs);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
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
    admin.passwordHash = bcrypt.hashSync(newPassword, 10);
    await admin.save();
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
