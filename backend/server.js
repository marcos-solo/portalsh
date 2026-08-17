require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { sequelize, Admin, Course, Trainer, Quiz } = require('./models');

const adminRoutes = require('./routes/admin');
const studentRoutes = require('./routes/students');
const submissionRoutes = require('./routes/submissions');

const app = express();
app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function seedDefaultData() {
  const bcrypt = require('bcryptjs');

  // 1. Seed Admin
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const existingAdmin = await Admin.findOne({ where: { username } });
  if (!existingAdmin) {
    await Admin.create({ username, passwordHash: bcrypt.hashSync(password, 10) });
    console.log(`Seeded default admin: ${username}/${password}`);
  }

  // 2. Seed Default Courses
  const courseCount = await Course.count();
  if (courseCount === 0) {
    await Course.bulkCreate([
      {
        code: 'CCNA-200-301',
        title: 'CCNA Cisco Certified Network Associate',
        description: 'Network Fundamentals, IP Connectivity, Security & Automation.',
      },
      {
        code: 'CYBER-101',
        title: 'Cybersecurity & Network Defense',
        description: 'Ethical Hacking, Network Defense & Security Operations.',
      },
      {
        code: 'IT-ESS-102',
        title: 'IT Essentials & Hardware Systems',
        description: 'Computer Hardware, Operating Systems & Troubleshooting.',
      }
    ]);
    console.log('Seeded default courses');
  }

  // 3. Seed Default Trainers
  const trainerCount = await Trainer.count();
  if (trainerCount === 0) {
    await Trainer.bulkCreate([
      {
        name: 'John Doe (Trainer)',
        email: 'trainer@iat.ac.ke',
        passwordHash: bcrypt.hashSync('password123', 10),
        assignedCourseIds: ['course_1', 'course_2'],
      },
      {
        name: 'Jane Smith (Trainer)',
        email: 'jane@iat.ac.ke',
        passwordHash: bcrypt.hashSync('password123', 10),
        assignedCourseIds: ['course_3'],
      }
    ]);
    console.log('Seeded default trainers');
  }

  // 4. Seed Default Quizzes
  const quizCount = await Quiz.count();
  if (quizCount === 0) {
    await Quiz.create({
      code: 'ccna-200-301-fundamental',
      courseId: 'course_1',
      title: 'CCNA 200-301 Network Fundamentals & Routing',
      description: 'Assess student core understanding of IP addressing, OSI layers, VLANs, subnetting, and Cisco router commands.',
      timeLimitMinutes: 15,
      passPercentage: 70,
      shuffleQuestions: true,
      shuffleOptions: true,
      allowReview: true,
      questions: [
        {
          id: "q1",
          question: "Which OSI model layer is responsible for translating data into a format that the application layer can accept, including encryption and compression?",
          codeSnippet: "",
          options: [
            "Layer 4 - Transport Layer",
            "Layer 5 - Session Layer",
            "Layer 6 - Presentation Layer",
            "Layer 7 - Application Layer"
          ],
          correctIndex: 2,
          explanation: "Layer 6 (Presentation Layer) handles data formatting, data conversion, encryption/decryption, and data compression.",
          category: "Network Fundamentals"
        },
        {
          id: "q2",
          question: "What is the usable host IP range for a subnet with network address 192.168.10.64/27?",
          codeSnippet: "Subnet: 192.168.10.64/27\nMask: 255.255.255.224",
          options: [
            "192.168.10.65 to 192.168.10.94",
            "192.168.10.64 to 192.168.10.95",
            "192.168.10.65 to 192.168.10.95",
            "192.168.10.66 to 192.168.10.96"
          ],
          correctIndex: 0,
          explanation: "A /27 subnet mask has a block size of 32 (256-224=32). Network is 192.168.10.64, Broadcast is 192.168.10.95. The usable host range is 192.168.10.65 - 192.168.10.94.",
          category: "Subnetting"
        },
        {
          id: "q3",
          question: "Which Cisco IOS command is used to configure a default static route pointing to next-hop IP 10.0.0.1?",
          codeSnippet: "",
          options: [
            "ip route 0.0.0.0 0.0.0.0 10.0.0.1",
            "ip static-route default 10.0.0.1",
            "router static default 10.0.0.1 0.0.0.0",
            "ip default-gateway 10.0.0.1"
          ],
          correctIndex: 0,
          explanation: "The syntax for a default static route is 'ip route 0.0.0.0 0.0.0.0 <next-hop-ip>'.",
          category: "IP Routing"
        }
      ]
    });
    console.log('Seeded default quiz');
  }
}

// Basic rate limiting
const limiter = rateLimit({ windowMs: 60 * 1000, max: 120 });
app.use(limiter);

app.use('/uploads', express.static(process.env.UPLOAD_DIR || path.join(__dirname, 'uploads')));

// API routes
app.use('/admin', adminRoutes);
app.use('/students', studentRoutes);
app.use('/submissions', submissionRoutes);

// Additional top-level alias endpoints for public frontend access
app.get('/courses', (req, res, next) => app._router.handle({ ...req, url: '/admin/courses' }, res, next));
app.get('/trainers', (req, res, next) => app._router.handle({ ...req, url: '/admin/trainers' }, res, next));
app.get('/quizzes', (req, res, next) => app._router.handle({ ...req, url: '/admin/quizzes' }, res, next));

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    env: process.env.NODE_ENV || 'development',
  });
});

// Serve React production build static files
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Fallback to React index.html for SPA client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await sequelize.sync();
  } catch (err) {
    console.warn('Sequelize sync warning (proceeding to start server):', err.message);
  }

  try {
    await seedDefaultData();
  } catch (err) {
    console.warn('Seeding notice (proceeding to start server):', err.message);
  }

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

start().catch(err => {
  console.error('Failed to start server', err);
  process.exit(1);
});
