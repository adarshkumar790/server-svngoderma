const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ['a', 'b', 'c', 'd', 'e', 'f'],
      required: true,
    },
    filePath: { type: String, required: true },
    fileType: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('File', fileSchema);
