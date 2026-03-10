const express = require("express");
const router = express.Router();
const Response = require("../models/Response");
const auth = require("../middleware/auth");
const dayjs = require("dayjs");

// 1. SUBMIT RESPONSE: POST /api/responses
router.post("/", auth, async (req, res) => {
  try {
    const { answers, scores } = req.body;
    const newResponse = new Response({
      user: req.user.id,
      answers,
      scores,
      // Ensure date is stored correctly
      createdAt: answers.date ? dayjs(answers.date).toDate() : new Date()
    });
    await newResponse.save();
    res.status(201).json(newResponse);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// 2. GET BY DATE: GET /api/responses/by-date?date=YYYY-MM-DD
router.get("/by-date", auth, async (req, res) => {
  try {
    const { date } = req.query;
    const startOfDay = dayjs(date).startOf("day").toDate();
    const endOfDay = dayjs(date).endOf("day").toDate();

    const response = await Response.findOne({
      user: req.user.id,
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });

    if (!response) return res.status(404).json({ message: "No data found" });
    res.json(response.scores); // Return only the scores object
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// 3. GET ALL DATES: GET /api/responses/all-dates (For Calendar colors)
router.get("/all-dates", auth, async (req, res) => {
  try {
    const responses = await Response.find({ user: req.user.id }).select("createdAt");
    const dates = responses.map(r => dayjs(r.createdAt).format("YYYY-MM-DD"));
    res.json([...new Set(dates)]);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// 4. GET WEEKLY: GET /api/responses/weekly?date=YYYY-MM-DD
router.get("/weekly", auth, async (req, res) => {
  try {
    const { date } = req.query;
    const endOfRange = dayjs(date).endOf("day");
    const startOfRange = dayjs(date).subtract(6, "day").startOf("day");

    const responses = await Response.find({
      user: req.user.id,
      createdAt: { $gte: startOfRange.toDate(), $lte: endOfRange.toDate() }
    });

    // Map data to a simple format for build7Days
    const formatted = responses.map(r => ({
      date: dayjs(r.createdAt).format("YYYY-MM-DD"),
      ...r.scores
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// 5. GET MONTHLY: GET /api/responses/monthly?date=YYYY-MM-DD
router.get("/monthly", auth, async (req, res) => {
  try {
    const { date } = req.query;
    const endOfRange = dayjs(date).endOf("day");
    const startOfRange = dayjs(date).subtract(29, "day").startOf("day");

    const responses = await Response.find({
      user: req.user.id,
      createdAt: { $gte: startOfRange.toDate(), $lte: endOfRange.toDate() }
    });

    // Map data to a simple format for build30Days
    const formatted = responses.map(r => ({
      date: dayjs(r.createdAt).format("YYYY-MM-DD"),
      ...r.scores
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// 6. GET YEARLY: GET /api/responses/yearly?date=YYYY-MM-DD
router.get("/yearly", auth, async (req, res) => {
  try {
    const { date } = req.query;
    const endOfRange = dayjs(date).endOf("day");
    const startOfRange = dayjs(date).subtract(364, "day").startOf("day");

    const responses = await Response.find({
      user: req.user.id,
      createdAt: { $gte: startOfRange.toDate(), $lte: endOfRange.toDate() }
    });

    // Map data to a simple format for build365Days
    const formatted = responses.map(r => ({
      date: dayjs(r.createdAt).format("YYYY-MM-DD"),
      ...r.scores
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;