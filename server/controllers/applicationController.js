const { Op } = require('sequelize');
const Application = require('../models/Application');
const { validationResult } = require('express-validator');

// Statuses that count as "the company responded" for the response-rate stat
const RESPONSE_STATUSES = ['OA', 'Phone Screen', 'Technical', 'Onsite', 'Offer', 'Rejected'];

// @route   POST /api/applications
// @access  Private
const createApplication = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Force user field to the logged-in user — never trust req.body for this
    const application = await Application.create({
      ...req.body,
      userId: req.user.id,
    });

    res.status(201).json({ success: true, application });
  } catch (error) {
    console.error('Create application error:', error);
    res.status(500).json({ message: 'Server error creating application' });
  }
};

// @route   GET /api/applications
// @access  Private
// Supports: ?status=Applied&search=Google&sortBy=dateApplied&order=desc&page=1&limit=20
const getApplications = async (req, res) => {
  try {
    const {
      status,
      search,
      sortBy = 'dateApplied',
      order = 'desc',
      page = 1,
      limit = 50,
    } = req.query;

    // Build query — always scoped to logged-in user
    const where = { userId: req.user.id };

    if (status) {
      where.status = status;
    }

    if (search) {
      // Case-insensitive search across company and role
      where[Op.or] = [
        { company: { [Op.iLike]: `%${search}%` } },
        { role: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    const sortOrder = order === 'asc' ? 'ASC' : 'DESC';

    // Run query + total count in parallel
    const [{ count: total, rows: applications }] = await Promise.all([
      Application.findAndCountAll({
        where,
        order: [[sortBy, sortOrder]],
        offset,
        limit: limitNum,
      }),
    ]);

    res.json({
      success: true,
      count: applications.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      applications,
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Server error fetching applications' });
  }
};

// Mimics MongoDB's $week operator: Sunday-based, 0-indexed, week 0 = Jan 1
// through the following Saturday. Kept so the dashboard chart's date-labeling
// logic on the client (which assumes this exact definition) doesn't need to change.
const mongoStyleWeek = (date) => {
  const d = new Date(date);
  const year = d.getUTCFullYear();
  const jan1 = new Date(Date.UTC(year, 0, 1));
  const jan1Day = jan1.getUTCDay(); // 0 (Sun) - 6 (Sat)
  const dayOfYear = Math.floor((Date.UTC(year, d.getUTCMonth(), d.getUTCDate()) - jan1) / 86400000);
  return { year, week: Math.floor((dayOfYear + jan1Day) / 7) };
};

// @route   GET /api/applications/stats
// @access  Private
const getStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const [statusRows, totalCount, dateRows] = await Promise.all([
      // Count by status
      Application.findAll({
        where: { userId },
        attributes: [
          'status',
          [Application.sequelize.fn('COUNT', Application.sequelize.col('status')), 'count'],
        ],
        group: ['status'],
        raw: true,
      }),

      // Total applications
      Application.count({ where: { userId } }),

      // Just the dates — weekly bucketing happens in JS below to match Mongo's $week semantics exactly
      Application.findAll({
        where: { userId },
        attributes: ['dateApplied'],
        raw: true,
      }),
    ]);

    // --- Status breakdown, shaped like Mongo's $group output: [{ _id: status, count }] ---
    const statusBreakdown = statusRows.map((row) => ({
      _id: row.status,
      count: parseInt(row.count, 10),
    }));

    // --- Response rate / offers, derived from the same per-status counts ---
    let responses = 0;
    let offers = 0;
    for (const row of statusBreakdown) {
      if (RESPONSE_STATUSES.includes(row._id)) responses += row.count;
      if (row._id === 'Offer') offers = row.count;
    }
    const responseRate = totalCount > 0 ? ((responses / totalCount) * 100).toFixed(1) : 0;

    // --- Weekly data: applications per week, last 12 weeks, shaped like Mongo's output ---
    const weekCounts = new Map(); // key: "year-week" -> { year, week, count }
    for (const row of dateRows) {
      const { year, week } = mongoStyleWeek(row.dateApplied);
      const key = `${year}-${week}`;
      if (!weekCounts.has(key)) weekCounts.set(key, { year, week, count: 0 });
      weekCounts.get(key).count += 1;
    }
    const weeklyData = [...weekCounts.values()]
      .sort((a, b) => b.year - a.year || b.week - a.week)
      .slice(0, 12)
      .map((w) => ({ _id: { year: w.year, week: w.week }, count: w.count }));

    res.json({
      success: true,
      stats: {
        totalApplications: totalCount,
        statusBreakdown,
        weeklyData,
        responseRate: parseFloat(responseRate),
        offers,
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error fetching stats' });
  }
};

// @route   GET /api/applications/:id
// @access  Private
const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findByPk(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Authorization: user can only access their own applications
    if (application.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to access this application' });
    }

    res.json({ success: true, application });
  } catch (error) {
    if (error.name === 'SequelizeDatabaseError') {
      return res.status(400).json({ message: 'Invalid application ID' });
    }
    console.error('Get application error:', error);
    res.status(500).json({ message: 'Server error fetching application' });
  }
};

// @route   PUT /api/applications/:id
// @access  Private
const updateApplication = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let application = await Application.findByPk(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    // Strip user fields if present — prevent reassignment to another user
    const { user, userId, ...updates } = req.body;

    await application.update(updates);

    res.json({ success: true, application });
  } catch (error) {
    if (error.name === 'SequelizeDatabaseError') {
      return res.status(400).json({ message: 'Invalid application ID' });
    }
    console.error('Update application error:', error);
    res.status(500).json({ message: 'Server error updating application' });
  }
};

// @route   DELETE /api/applications/:id
// @access  Private
const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findByPk(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this application' });
    }

    await application.destroy();

    res.json({ success: true, message: 'Application deleted' });
  } catch (error) {
    if (error.name === 'SequelizeDatabaseError') {
      return res.status(400).json({ message: 'Invalid application ID' });
    }
    console.error('Delete application error:', error);
    res.status(500).json({ message: 'Server error deleting application' });
  }
};

module.exports = {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  getStats,
};
