require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const responseRoutes = require("./routes/responseRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Debug logger (optional but useful)
app.use((req, res, next) => {
  console.log("Incoming:", req.method, req.url);
  next();
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("Mongo Error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/responses", responseRoutes);   // ✅ plural (important)


// 404 handler (very useful for debugging)
app.use((req, res) => {
  res.status(404).json({ message: "Route Not Found" });
});

app.listen(5000, () =>
  console.log("Server running on port 5000")
);