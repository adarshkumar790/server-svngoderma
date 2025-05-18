const File = require('../models/File');
const fs = require('fs');
const path = require('path');

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const newFile = new File({
      title: req.body.title,
      filePath: req.file.path,
      fileType: req.file.mimetype,
    });

    const saved = await newFile.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Upload failed' });
  }
};

exports.getFiles = async (req, res) => {
  const files = await File.find();
  res.json(files);
};

exports.deleteFile = async (req, res) => {
  const file = await File.findById(req.params.id);
  if (!file) return res.status(404).json({ error: 'File not found' });

  fs.unlink(file.filePath, err => {
    if (err) console.error('File delete failed:', err);
  });

  await File.deleteOne({ _id: req.params.id });
  res.json({ message: 'File deleted' });
};
