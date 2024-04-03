// backend/routes/upload.js

const express = require('express');
const router = express.Router();
const multer = require('multer');

// Configure multer to specify the destination directory for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// POST endpoint for handling file uploads
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  // Construct the image path (assuming 'uploads' is the directory where files are stored)
  const imagePath = `uploads/${req.file.filename}`;
  
  // Return the image path in the response
  res.json({ imagePath: imagePath });
});

module.exports = router;
