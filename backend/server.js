require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { sequelize } = require('./models');

const adminRoutes = require('./routes/admin');
const studentRoutes = require('./routes/students');
const submissionRoutes = require('./routes/submissions');

const app = express();
app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function seedDefaultAdmin() {
  const { Admin } = require('./models');
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const existing = await Admin.findOne({ where: { username } });
  if (!existing) {
    await Admin.create({ username, passwordHash: require('bcryptjs').hashSync(password, 10) });
    console.log(`Seeded default admin: ${username}/${password}`);
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
  const isDev = process.env.NODE_ENV !== 'production';
  if (isDev) {
    await sequelize.sync({ alter: true });
  } else {
    await sequelize.sync();
  }
  await seedDefaultAdmin();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

start().catch(err => {
  console.error('Failed to start server', err);
  process.exit(1);
});
