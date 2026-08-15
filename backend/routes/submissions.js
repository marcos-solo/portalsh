const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { Submission, FileSubmission, Student, Quiz } = require('../models');

router.get('/:id', async (req, res) => {
  const sub = await Submission.findByPk(req.params.id, { include: [Student, Quiz, FileSubmission] });
  if (!sub) return res.status(404).json({ error: 'Not found' });
  res.json(sub);
});

// Upload files for an existing submission (admin or student)
router.post('/:id/files', upload.array('files'), async (req, res) => {
  try {
    const submission = await Submission.findByPk(req.params.id);
    if (!submission) return res.status(404).json({ error: 'Submission not found' });

    if (!req.files || req.files.length === 0) return res.status(400).json({ error: 'No files uploaded' });

    const fileRecords = req.files.map(f => ({
      filename: f.filename,
      originalName: f.originalname,
      mimeType: f.mimetype,
      size: f.size,
      url: `/uploads/${f.filename}`,
      SubmissionId: submission.id,
    }));

    const created = await FileSubmission.bulkCreate(fileRecords);
    const updated = await Submission.findByPk(submission.id, { include: [FileSubmission] });
    res.json({ files: created, submission: updated });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
