const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { generateInterview, evaluateInterview, getInterviewHistory, getInterviewById, deleteInterview, deleteAllInterviews } = require('../controllers/interviewController');

router.post('/generate/:reportId', protect, generateInterview);
router.post('/evaluate/:interviewId', protect, evaluateInterview);
router.get('/history', protect, getInterviewHistory);
router.delete('/', protect, deleteAllInterviews);
router.get('/:id', protect, getInterviewById);
router.delete('/:id', protect, deleteInterview);

module.exports = router;
