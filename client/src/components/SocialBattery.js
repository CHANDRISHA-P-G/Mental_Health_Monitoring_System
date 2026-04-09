import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Box, Typography, Card, Container, IconButton, Stack, Slider } from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const BATTERY_LEVELS = [
  { color: "#D32F2F", label: "Drained", emoji: "☹️" },
  { color: "#F44336", label: "Low", emoji: "😟" },
  { color: "#E91E63", label: "Tired", emoji: "😑" },
  { color: "#FFB300", label: "Steady", emoji: "😐" },
  { color: "#4CAF50", label: "Good", emoji: "🙂" },
  { color: "#2E7D32", label: "Great", emoji: "😊" },
  { color: "#00695C", label: "Fully Charged", emoji: "😁" },
];

function SocialBattery() {
  const navigate = useNavigate();
  const [value, setValue] = useState(4);
  const [loading, setLoading] = useState(false);
  const API_BASE = process.env.REACT_APP_API_URL || "https://mental-health-monitoring-system-pnuu.onrender.com";
  const token = localStorage.getItem("token");
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };
  const today = new Date().toISOString().slice(0, 10);
  const currentLevel = BATTERY_LEVELS[value];

  const fetchLatestResponse = useCallback(async () => {
    if (!token) return;
    const headers = { headers: { Authorization: `Bearer ${token}` } };
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/responses/by-date?date=${today}`, headers);
      if (res.data && res.data.socialBattery !== undefined) {
        setValue(res.data.socialBattery);
      }
    } catch (err) {
      console.log("Error fetching latest response", err);
    } finally {
      setLoading(false);
    }
  }, [API_BASE, today, token]);

  useEffect(() => {
    fetchLatestResponse();
  }, [fetchLatestResponse]);

  const handleSaveScore = async () => {
    if (!token) {
      alert("Please login to save your score");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(
        `${API_BASE}/api/responses`,
        { date: today, answers: { socialBattery: value } },
        authHeaders
      );
      if (res.status === 200) {
        alert("Score saved successfully!");
        fetchLatestResponse();
      } else {
        alert(`Failed to save: ${res.data?.message || res.statusText}`);
      }
    } catch (err) {
      console.error("Error saving score:", err.response?.data || err.message);
      alert("Failed to save score");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Header */}
      <Box sx={{ mb: 8, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <IconButton onClick={() => navigate("/")} sx={{ position: "absolute", left: 0, border: "1px solid #E0E0E0", bgcolor: "#fff" }}>
          <ArrowBackIosNewIcon sx={{ fontSize: 18, color: "#5F6D7C" }} />
        </IconButton>
        <Typography variant="h4" sx={{ fontWeight: 900, color: "#1A2027", letterSpacing: -1 }}>
          MY <span style={{ color: currentLevel.color }}>SOCIAL BATTERY</span>
        </Typography>
      </Box>

      {/* Battery Visualization */}
      <Card
        elevation={0}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: "600px",
          borderRadius: "40px",
          bgcolor: "#1A1A1A",
          border: "8px solid #2A2A2A",
          position: "relative",
          overflow: "hidden",
          mb: 6,
        }}
      >
        {/* Battery Tip */}
        <Box sx={{ position: "absolute", right: -10, top: "50%", transform: "translateY(-50%)", width: "20px", height: "60px", bgcolor: "#2A2A2A", borderRadius: "0 10px 10px 0" }} />

        {/* Battery Levels */}
        <Stack direction="row" spacing={1} sx={{ height: "180px", alignItems: "flex-end" }}>
          {BATTERY_LEVELS.map((level, index) => (
            <Box
              key={index}
              sx={{
                flex: 1,
                height: "100%",
                bgcolor: index <= value ? level.color : "#333",
                borderRadius: "12px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                opacity: index <= value ? 1 : 0.3,
                transform: index === value ? "scaleY(1.05)" : "scaleY(1)",
                position: "relative",
              }}
            >
              {/* Emoji */}
              <Typography sx={{ fontSize: "1.8rem", mb: 1 }}>{level.emoji}</Typography>
            </Box>
          ))}
        </Stack>
      </Card>

      {/* Slider & Submit */}
      <Box sx={{ width: "100%", maxWidth: "500px", textAlign: "center" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={value}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Typography variant="h5" sx={{ fontWeight: 800, color: currentLevel.color, mb: 1 }}>
              {currentLevel.label}
            </Typography>
          </motion.div>
        </AnimatePresence>
        <Slider
          value={value}
          min={0}
          max={6}
          step={1}
          onChange={(e, val) => setValue(val)}
          sx={{
            color: currentLevel.color,
            height: 12,
            '& .MuiSlider-thumb': {
              width: 28,
              height: 28,
              backgroundColor: '#fff',
              border: `4px solid ${currentLevel.color}`,
              transition: '0.3s',
            },
            '& .MuiSlider-track': { border: 'none' },
            '& .MuiSlider-rail': { opacity: 0.2, backgroundColor: '#bfbfbf' },
          }}
        />
        <Typography variant="body2" sx={{ mt: 3, color: "#5F6D7C", fontWeight: 600 }}>
          Slide to update your energy capacity
        </Typography>
        {/* Submit Button */}
        <button
          onClick={handleSaveScore}
          disabled={loading}
          style={{
            marginTop: 16,
            padding: '10px 20px',
            backgroundColor: currentLevel.color,
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Saving..." : "Submit"}
        </button>
      </Box>
    </Container>
  );
}

export default SocialBattery;