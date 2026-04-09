import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  LinearProgress,
  Button,
  Container,
  IconButton,
  CircularProgress,
} from "@mui/material";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import RemoveIcon from "@mui/icons-material/Remove";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
const API_BASE = process.env.REACT_APP_API_URL || "https://mental-health-monitoring-system-pnuu.onrender.com";
const EXERCISE_TEAL = "#00ACC1";
const BONUS_GOLD = "#FFA000";
const GOAL_MINUTES = 60;

function Exercise() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pendingValue, setPendingValue] = useState(0);
  const token = localStorage.getItem("token");
  const today = dayjs().format("YYYY-MM-DD");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${API_BASE}/api/responses/by-date?date=${today}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data) {
          setPendingValue(res.data.exercise ?? 0);
        }
      } catch (err) {
        console.log("No existing data for today, starting fresh.");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
  }, [token, today]);

  const updateDB = async () => {
    try {
      await axios.post(
        `${API_BASE}/api/responses`,
        { date: today, exercise: pendingValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Sync failed");
    }
  };

  const handleSubmit = () => {
    updateDB();
  };

  const isExceeded = pendingValue >= GOAL_MINUTES;
  const progress = (pendingValue / GOAL_MINUTES) * 100;

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          mb: 5,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <IconButton
          onClick={() => navigate("/")}
          sx={{
            position: "absolute",
            left: 0,
            bgcolor: "#fff",
            border: "1px solid #E0E0E0",
          }}
        >
          <ArrowBackIosNewIcon sx={{ fontSize: 18, color: "#5F6D7C" }} />
        </IconButton>
        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 900, color: "#1A2027" }}
          >
            Exercise <span style={{ color: isExceeded ? BONUS_GOLD : EXERCISE_TEAL }}>Logger</span>
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#5F6D7C", fontWeight: 600 }}
          >
            Daily Target: 60 Minutes
          </Typography>
        </Box>
      </Box>

      {/* Stats card */}
      <Card
        elevation={0}
        sx={{
          p: { xs: 4, md: 6 },
          width: "100%",
          maxWidth: "800px",
          borderRadius: "32px",
          border: `1px solid ${isExceeded ? BONUS_GOLD : EXERCISE_TEAL}30`,
          textAlign: "center",
          bgcolor: "#fff",
          mb: 6,
          boxShadow: isExceeded
            ? `0 20px 50px ${BONUS_GOLD}15`
            : `0 20px 50px ${EXERCISE_TEAL}10`,
        }}
      >
        <Box
          sx={{
            width: 110,
            height: 110,
            borderRadius: "30px",
            bgcolor: isExceeded ? `${BONUS_GOLD}15` : `${EXERCISE_TEAL}12`,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 3,
          }}
        >
          {isExceeded ? (
            <EmojiEventsIcon sx={{ fontSize: 55, color: BONUS_GOLD }} />
          ) : (
            <FitnessCenterIcon sx={{ fontSize: 55, color: EXERCISE_TEAL }} />
          )}
        </Box>
        <Typography
          variant="h2"
          sx={{ fontWeight: 900, color: "#1A2027", mb: 2 }}
        >
          {pendingValue}{" "}
          <span style={{ fontSize: "1.5rem", color: "#BDC3C7" }}>mins</span>
        </Typography>
        <Box
          sx={{
            width: "100%",
            maxWidth: "500px",
            mx: "auto",
            mb: 2,
          }}
        >
          <LinearProgress
            variant="determinate"
            value={Math.min(progress, 100)}
            sx={{
              height: 14,
              borderRadius: 10,
              bgcolor: isExceeded ? `${BONUS_GOLD}15` : `${EXERCISE_TEAL}10`,
              "& .MuiLinearProgress-bar": {
                bgcolor: isExceeded ? BONUS_GOLD : EXERCISE_TEAL,
                borderRadius: 10,
              },
            }}
          />
        </Box>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: "800",
            color: isExceeded ? BONUS_GOLD : EXERCISE_TEAL,
            letterSpacing: 1.5,
          }}
        >
          {isExceeded ? "DAILY GOAL CRUSHED! 🔥" : "KEEP MOVING!"}
        </Typography>
        {/* Submit Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ mt: 3 }}
        >
          Submit
        </Button>
      </Card>

      {/* Quick Log Buttons */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "900px",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 900, color: "#1A2027", mb: 3, textAlign: "center" }}
        >
          Quick Log
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2.5,
            flexWrap: { xs: "nowrap", sm: "wrap" },
            overflowX: { xs: "auto", sm: "visible" },
            pb: 2,
          }}
        >
          {[
            { label: "Quick Hit", amount: 15 },
            { label: "Standard", amount: 30 },
            { label: "Intense", amount: 45 },
            { label: "Full Session", amount: 60 },
          ].map((item) => (
            <Card
              key={item.label}
              onClick={() =>
                setPendingValue(Math.min(pendingValue + item.amount, 180))
              }
              elevation={0}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "180px",
                height: "150px",
                borderRadius: "28px",
                border: `1px solid ${EXERCISE_TEAL}20`,
                cursor: "pointer",
                transition: "0.3s",
                bgcolor: "#fff",
                flexShrink: 0,
                "&:hover": {
                  transform: "translateY(-8px)",
                  borderColor: EXERCISE_TEAL,
                  boxShadow: `0 15px 30px ${EXERCISE_TEAL}20`,
                },
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "14px",
                  bgcolor: `${EXERCISE_TEAL}12`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 1.5,
                }}
              >
                <DirectionsRunIcon sx={{ color: EXERCISE_TEAL, fontSize: 24 }} />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "900",
                  color: "#1A2027",
                  fontSize: "1.05rem",
                }}
              >
                +{item.amount}m
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "#5F6D7C",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  fontSize: "0.65rem",
                }}
              >
                {item.label}
              </Typography>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Remove time button */}
      <Box sx={{ mt: 6, textAlign: "center" }}>
        <Button
          variant="text"
          startIcon={<RemoveIcon />}
          onClick={() =>
            setPendingValue(Math.max(pendingValue - 10, 0))
          }
          sx={{
            color: "#BDC3C7",
            fontWeight: "800",
            borderRadius: "12px",
            "&:hover": { color: "#E74C3C", backgroundColor: "#FEECEB" },
          }}
        >
          Remove 10 minutes
        </Button>
      </Box>
    </Container>
  );
}

export default Exercise;