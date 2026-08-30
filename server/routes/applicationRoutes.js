const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const Application = require('../models/Application');
const {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  getStats,
} = require('../controllers/applicationController');

// Validation for create — strict
const createValidation = [
  body('company').trim().notEmpty().withMessage('Company is required'),
  body('role').trim().notEmpty().withMessage('Role is required'),
  body('status')
    .optional()
    .isIn(Application.STATUS_VALUES)
    .withMessage('Invalid status'),
  body('jobType')
    .optional()
    .isIn(Application.JOB_TYPE_VALUES)
    .withMessage('Invalid job type'),
  body('dateApplied').optional().isISO8601().toDate(),
  body('nextStepDate').optional().isISO8601().toDate(),
  body('salaryMin').optional().isNumeric(),
  body('salaryMax').optional().isNumeric(),
  body('contactEmail').optional().isEmail().normalizeEmail(),
  body('jobLink').optional().isURL().withMessage('Invalid URL'),
];

// Validation for update — all optional (partial updates allowed)
const updateValidation = [
  body('company').optional().trim().notEmpty(),
  body('role').optional().trim().notEmpty(),
  body('status').optional().isIn(Application.STATUS_VALUES),
  body('jobType').optional().isIn(Application.JOB_TYPE_VALUES),
  body('dateApplied').optional().isISO8601().toDate(),
  body('nextStepDate').optional().isISO8601().toDate(),
  body('salaryMin').optional().isNumeric(),
  body('salaryMax').optional().isNumeric(),
  body('contactEmail').optional().isEmail().normalizeEmail(),
  body('jobLink').optional().isURL(),
];

// All routes require auth — apply once at the router level
router.use(protect);

// IMPORTANT: /stats must come BEFORE /:id
// Otherwise Express interprets "stats" as an ID and tries to look it up
router.get('/stats', getStats);

router.route('/')
  .get(getApplications)
  .post(createValidation, createApplication);

router.route('/:id')
  .get(getApplicationById)
  .put(updateValidation, updateApplication)
  .delete(deleteApplication);

module.exports = router;