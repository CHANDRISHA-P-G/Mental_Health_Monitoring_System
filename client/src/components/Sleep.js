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
import RemoveIcon from "@mui/icons-material/Remove";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

const SLEEP_PURPLE = "#7C4DFF";
const BONUS_GOLD = "#FFA000";
const GOAL_HOURS = 8;

function Sleep() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pendingHours, setPendingHours] = useState(0);
  const token = localStorage.getItem("token");
  const today = dayjs().format("YYYY-MM-DD");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:5000/api/responses/by-date?date=${today}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data) {
          setPendingHours(res.data.sleep ?? 0);
        }
      } catch (err) {
        console.log("Starting fresh rest today");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
  }, [token, today]);

  const updateDB = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/responses",
        { date: today, sleep: pendingHours },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Sync failed");
    }
  };

  const handleSubmit = () => {
    updateDB();
  };

  const isExceeded = pendingHours >= GOAL_HOURS;
  const progress = (pendingHours / GOAL_HOURS) * 100;

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
            Sleep <span style={{ color: isExceeded ? BONUS_GOLD : SLEEP_PURPLE }}>Quality</span>
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#5F6D7C", fontWeight: 600 }}
          >
            Ideal Rest: 8.0 Hours
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
          border: `1px solid ${isExceeded ? BONUS_GOLD : SLEEP_PURPLE}30`,
          textAlign: "center",
          bgcolor: "#fff",
          mb: 6,
          boxShadow: isExceeded
            ? `0 20px 50px ${BONUS_GOLD}15`
            : `0 20px 50px ${SLEEP_PURPLE}10`,
        }}
      >
        <Box
          sx={{
            width: 110,
            height: 110,
            borderRadius: "30px",
            bgcolor: isExceeded ? `${BONUS_GOLD}15` : `${SLEEP_PURPLE}12`,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 3,
          }}
        >
          <NightsStayIcon sx={{ fontSize: 55, color: isExceeded ? BONUS_GOLD : SLEEP_PURPLE }} />
        </Box>
        <Typography
          variant="h2"
          sx={{ fontWeight: 900, color: "#1A2027", mb: 2 }}
        >
          {pendingHours}{" "}
          <span style={{ fontSize: "1.5rem", color: "#BDC3C7" }}>hrs</span>
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
              bgcolor: isExceeded ? `${BONUS_GOLD}15` : `${SLEEP_PURPLE}10`,
              "& .MuiLinearProgress-bar": {
                bgcolor: isExceeded ? BONUS_GOLD : SLEEP_PURPLE,
                borderRadius: 10,
              },
            }}
          />
        </Box>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: "800",
            color: isExceeded ? BONUS_GOLD : SLEEP_PURPLE,
            letterSpacing: 1.5,
          }}
        >
          {isExceeded ? "FULLY RESTED! 🌙" : "RECOVERY IN PROGRESS"}
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
            { label: "Power Nap", amount: 0.5 },
            { label: "Short Rest", amount: 2 },
            { label: "Deep Sleep", amount: 4 },
            { label: "Full Night", amount: 8 },
          ].map((item) => (
            <Card
              key={item.label}
              onClick={() =>
                setPendingHours(Math.min(pendingHours + item.amount, 12))
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
                border: `1px solid ${SLEEP_PURPLE}20`,
                cursor: "pointer",
                transition: "0.3s",
                bgcolor: "#fff",
                flexShrink: 0,
                "&:hover": {
                  transform: "translateY(-8px)",
                  borderColor: SLEEP_PURPLE,
                  boxShadow: `0 15px 30px ${SLEEP_PURPLE}20`,
                },
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "14px",
                  bgcolor: `${SLEEP_PURPLE}12`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 1.5,
                }}
              >
                <NightsStayIcon sx={{ color: SLEEP_PURPLE, fontSize: 24 }} />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "900",
                  color: "#1A2027",
                  fontSize: "1.05rem",
                }}
              >
                +{item.amount}h
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

      {/* Remove time */}
      <Box sx={{ mt: 6, textAlign: "center" }}>
        <Button
          variant="text"
          startIcon={<RemoveIcon />}
          onClick={() =>
            setPendingHours(Math.max(pendingHours - 0.5, 0))
          }
          sx={{
            color: "#BDC3C7",
            fontWeight: "800",
            borderRadius: "12px",
            "&:hover": { color: "#E74C3C", backgroundColor: "#FEECEB" },
          }}
        >
          Subtract 30 minutes
        </Button>
      </Box>
    </Container>
  );
}

export default Sleep;