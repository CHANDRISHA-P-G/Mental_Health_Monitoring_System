const mongoose = require("mongoose");

const emotionSchema = new mongoose.Schema({
  label: String,
  score: Number,
  intensity: Number,
});

const responseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  Morning: [emotionSchema],
  Afternoon: [emotionSchema],
  Night: [emotionSchema],
});

module.exports = mongoose.model("Response", responseSchema);
