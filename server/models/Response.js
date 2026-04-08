const mongoose = require('mongoose');

const gratitudeSchema = new mongoose.Schema({
  text: { type: String, required: true },
  id: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
}, { _id: false });

const ResponseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  hydration: { type: Number, default: 0 },
  exercise: { type: Number, default: 0 },
  sleep: { type: Number, default: 0 },
  gratitude: { type: [gratitudeSchema], default: [] },
  socialBattery: { type: Number },
  Morning: { type: [Object], default: [] },
  Afternoon: { type: [Object], default: [] },
  Night: { type: [Object], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('Response', ResponseSchema);