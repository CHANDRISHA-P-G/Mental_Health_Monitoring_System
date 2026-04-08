const express = require('express');
const router = express.Router();
const Response = require('../models/Response'); // Your Mongoose model
const auth = require('../middleware/authMiddleware'); // Your auth middleware

const normalizeDate = (value) => {
  if (!value) return null;
  const d = new Date(value);
  d.setHours(0, 0, 0, 0);
  return d;
};

// POST /api/responses - create or update response
router.post('/', auth, async (req, res) => {
  try {
    const { date, answers = {}, ...directFields } = req.body;

    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    const responseDate = normalizeDate(date);
    if (!responseDate) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    const payload = { ...answers, ...directFields };
    const updateData = {};

    if (payload.gratitude !== undefined) {
      updateData.gratitude = Array.isArray(payload.gratitude) ? payload.gratitude : [];
    }
    if (payload.socialBattery !== undefined) updateData.socialBattery = payload.socialBattery;
    if (payload.hydration !== undefined) updateData.hydration = payload.hydration;
    if (payload.sleep !== undefined) updateData.sleep = payload.sleep;
    if (payload.exercise !== undefined) updateData.exercise = payload.exercise;
    if (payload.Morning !== undefined) updateData.Morning = Array.isArray(payload.Morning) ? payload.Morning : [];
    if (payload.Afternoon !== undefined) updateData.Afternoon = Array.isArray(payload.Afternoon) ? payload.Afternoon : [];
    if (payload.Night !== undefined) updateData.Night = Array.isArray(payload.Night) ? payload.Night : [];

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No valid fields provided to save' });
    }

    const responseDoc = await Response.findOneAndUpdate(
      { user: req.user.id, date: responseDate },
      { $set: updateData, $setOnInsert: { user: req.user.id, date: responseDate } },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );

    res.json(responseDoc);
  } catch (err) {
    console.error('Error in POST /responses:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/responses/by-date?date=YYYY-MM-DD
// Fetch response for a specific date
router.get('/by-date', auth, async (req, res) => {
  try {
    const dateStr = req.query.date;
    if (!dateStr) {
      return res.status(400).json({ message: 'Date query parameter is required' });
    }
    const doc = await Response.findOne({ user: req.user.id, date: normalizeDate(dateStr) });
    res.json(doc);
  } catch (err) {
    console.error('Error in GET /by-date:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

const getRangeResponses = async (req, res, daysBack) => {
  try {
    const dateStr = req.query.date;
    if (!dateStr) {
      return res.status(400).json({ message: 'Date query parameter is required' });
    }
    const endDate = normalizeDate(dateStr);
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - daysBack);

    const docs = await Response.find({
      user: req.user.id,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 });

    res.json(docs);
  } catch (err) {
    console.error('Error in GET range response:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

router.get('/weekly', auth, async (req, res) => getRangeResponses(req, res, 6));
router.get('/monthly', auth, async (req, res) => getRangeResponses(req, res, 29));
router.get('/yearly', auth, async (req, res) => getRangeResponses(req, res, 364));

// GET /api/responses/latest
router.get('/latest', auth, async (req, res) => {
  try {
    const doc = await Response.findOne({ user: req.user.id }).sort({ date: -1 });
    res.json(doc);
  } catch (err) {
    console.error('Error in GET /latest:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/responses/all-dates
router.get('/all-dates', auth, async (req, res) => {
  try {
    const responses = await Response.find({ user: req.user.id }, { date: 1, _id: 0 });
    res.json(responses.map(r => r.date));
  } catch (err) {
    console.error('Error in GET /all-dates:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Test route
router.get('/test-saved', auth, async (req, res) => {
  try {
    const responses = await Response.find({ user: req.user.id });
    res.json(responses);
  } catch (err) {
    console.error('Error fetching responses:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;