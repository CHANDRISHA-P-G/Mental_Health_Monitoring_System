const express = require("express");
const router = express.Router();
const Response = require("../models/Response");
const auth = require("../middleware/auth");


// =======================================
// 📅 DAILY - Get response by specific date
// =======================================
router.get("/by-date", auth, async (req, res) => {
  try {
    if (!req.query.date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const selected = new Date(req.query.date);

    const start = new Date(selected);
    start.setHours(0, 0, 0, 0);

    const end = new Date(selected);
    end.setHours(23, 59, 59, 999);

    const response = await Response.findOne({
      user: req.user.id,
      date: { $gte: start, $lte: end },
    });

    res.status(200).json(response || null);
  } catch (err) {
    console.error("DAILY ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// =======================================
// 📊 WEEKLY - Last 7 Days Data
// =======================================
router.get("/weekly", auth, async (req, res) => {
  try {
    const today = new Date();

    const firstDay = new Date();
    firstDay.setDate(today.getDate() - 6);
    firstDay.setHours(0, 0, 0, 0);

    const lastDay = new Date();
    lastDay.setHours(23, 59, 59, 999);

    const responses = await Response.find({
      user: req.user.id,
      date: { $gte: firstDay, $lte: lastDay },
    }).sort({ date: 1 });

    res.status(200).json(responses);
  } catch (err) {
    console.error("WEEKLY ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;