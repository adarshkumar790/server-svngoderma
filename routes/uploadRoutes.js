const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const File = require('../models/File');

const router = express.Router();

// Create uploads folder if it doesn't exist
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

// Upload file
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { title, category } = req.body;

    const newFile = new File({
      title,
      category,
      filePath: req.file.filename, // ✅ Save only the filename
      fileType: req.file.mimetype,
    });

    const saved = await newFile.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Upload failed', message: err.message });
  }
});

// Get files (optionally by category)
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const query = category ? { category } : {};
    const files = await File.find(query).sort({ createdAt: -1 });

    // Filter files that actually exist
    const filtered = files.filter((file) =>
      fs.existsSync(path.join(__dirname, '..', 'uploads', file.filePath))
    );

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: 'Fetch failed', message: err.message });
  }
});

// DELETE file by ID
router.delete('/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ error: 'File not found' });

    // Delete file from disk
    const filePath = path.join(__dirname, '..', 'uploads', file.filePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from database
    await file.deleteOne();
    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Deletion failed', message: err.message });
  }
});


module.exports = router;
