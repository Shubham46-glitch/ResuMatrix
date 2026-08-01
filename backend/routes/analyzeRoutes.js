const express = require('express');
const router = express.Router();
const multer = require('multer');
const { analyzeResume, getHistory, getReportById, deleteReport } = require('../controllers/analyzeController');
const { protect } = require('../middleware/authMiddleware');

// Setup multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Protect routes
router.post('/', protect, upload.single('resume'), analyzeResume);
router.get('/history', protect, getHistory);
router.get('/:id', protect, getReportById);
router.delete('/:id', protect, deleteReport);

module.exports = router;
