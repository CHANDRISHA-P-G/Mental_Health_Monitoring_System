import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Typography,
  Button,
  Card,
  CardContent,
  Box,
  TextField,
  IconButton,
  Container,
  Grid,
  Paper,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";

// ── Constants ─────────────────────────────────────────────────────────────────

const EMOTION_THEME = "#E53935";
const POSITIVE_COLOR = "#4CAF50";
const NEUTRAL_COLOR = "#9E9E9E";
const NEGATIVE_COLOR = "#EF5350";

const EMOTIONS = [
  { label: "Happy", score: 2, color: POSITIVE_COLOR },
  { label: "Calm", score: 2, color: POSITIVE_COLOR },
  { label: "Neutral", score: 0, color: NEUTRAL_COLOR },
  { label: "Sad", score: -1, color: NEGATIVE_COLOR },
  { label: "Anxious", score: -1, color: NEGATIVE_COLOR },
  { label: "Angry", score: -2, color: NEGATIVE_COLOR },
  { label: "Stressed", score: -2, color: NEGATIVE_COLOR },
  { label: "Tired", score: -2, color: NEGATIVE_COLOR },
];

const SESSIONS = ["Morning", "Afternoon", "Night"];

// ── Styled Calendar Day ───────────────────────────────────────────────────────

const StyledPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) => prop !== "isSubmitted" && prop !== "isToday",
})(({ isSubmitted, isToday, selected }) => ({
  ...(isSubmitted && {
    backgroundColor: "#ffebee !important",
    color: EMOTION_THEME,
    "&:hover": { backgroundColor: "#ffcdd2 !important" },
  }),
  ...(isToday && {
    border: `1px solid ${EMOTION_THEME}`,
  }),
  ...(selected && {
    backgroundColor: `${EMOTION_THEME} !important`,
    color: "white",
  }),
}));

const API_BASE = process.env.REACT_APP_API_URL || "https://mental-health-monitoring-system-pnuu.onrender.com";

// ── Component ─────────────────────────────────────────────────────────────────

function Test() {
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [isEditing, setIsEditing] = useState(false);
  const [hasExistingData, setHasExistingData] = useState(false);
  const [submittedDates, setSubmittedDates] = useState([]);
  const [data, setData] = useState({ Morning: [], Afternoon: [], Night: [] });
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  const token = localStorage.getItem("token");

  // Fix: Memoize headers to solve ESLint dependency warnings
  const authHeaders = useMemo(() => ({
    headers: { Authorization: `Bearer ${token}` },
  }), [token]);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/responses/all-dates`, authHeaders);
      setSubmittedDates(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("fetchHistory error:", err.response?.data || err.message);
    }
  }, [authHeaders]);

  const checkExistingData = useCallback(async () => {
    try {
      const formattedDate = selectedDate.format("YYYY-MM-DD");
      const res = await axios.get(
        `${API_BASE}/responses/by-date?date=${formattedDate}`,
        authHeaders
      );
      const doc = res.data;
      if (
        doc &&
        ((Array.isArray(doc.Morning) && doc.Morning.length > 0) ||
          (Array.isArray(doc.Afternoon) && doc.Afternoon.length > 0) ||
          (Array.isArray(doc.Night) && doc.Night.length > 0))
      ) {
        setData({
          Morning: Array.isArray(doc.Morning) ? doc.Morning : [],
          Afternoon: Array.isArray(doc.Afternoon) ? doc.Afternoon : [],
          Night: Array.isArray(doc.Night) ? doc.Night : [],
        });
        setHasExistingData(true);
        setIsEditing(false);
      } else {
        setData({ Morning: [], Afternoon: [], Night: [] });
        setHasExistingData(false);
        setIsEditing(true);
      }
    } catch (err) {
      console.error("checkExistingData error:", err.response?.data || err.message);
      setData({ Morning: [], Afternoon: [], Night: [] });
      setHasExistingData(false);
      setIsEditing(true);
    }
  }, [selectedDate, authHeaders]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchHistory();
  }, [token, navigate, fetchHistory]);

  useEffect(() => {
    if (token) checkExistingData();
  }, [selectedDate, checkExistingData, token]);

  const addEmotion = (session, emotion) => {
    if (!isEditing) return;
    if (data[session].length >= 3) return;
    if (data[session].some((e) => e.label === emotion.label)) return;
    setData((prev) => ({
      ...prev,
      [session]: [...prev[session], { ...emotion, intensity: 1 }],
    }));
  };

  const updateIntensity = (session, index, value) => {
    if (!isEditing) return;
    const val = Math.max(1, Math.min(3, Number(value)));
    const updated = [...data[session]];
    updated[index] = { ...updated[index], intensity: val };
    setData((prev) => ({ ...prev, [session]: updated }));
  };

  const removeEmotion = (session, index) => {
    if (!isEditing) return;
    setData((prev) => ({
      ...prev,
      [session]: prev[session].filter((_, i) => i !== index),
    }));
  };

  // Fix: Scope logic - ensure it uses the 'label' argument
  const getEmotionColor = (label) => {
    const found = EMOTIONS.find((e) => e.label === label);
    return found ? found.color : NEUTRAL_COLOR;
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        date: selectedDate.format("YYYY-MM-DD"),
        Morning: data.Morning,
        Afternoon: data.Afternoon,
        Night: data.Night,
      };
      await axios.post(`${API_BASE}/responses`, payload, authHeaders);
      await fetchHistory();
      await checkExistingData();
      setSnack({
        open: true,
        message: hasExistingData ? "Mood updated ✅" : "Response saved ✅",
        severity: "success",
      });
    } catch (err) {
      console.error("handleSubmit error:", err.response?.data || err.message);
      setSnack({ open: true, message: "Error saving response ❌", severity: "error" });
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container
        maxWidth={isEditing ? "xl" : "lg"}
        sx={{ py: 4, display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        {/* Header */}
        <Box sx={{ mb: 5, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <IconButton
            onClick={() => navigate("/")}
            sx={{ position: "absolute", left: 0, bgcolor: "#fff", border: "1px solid #E0E0E0", "&:hover": { bgcolor: `${EMOTION_THEME}10` } }}
          >
            <ArrowBackIosNewIcon sx={{ fontSize: 18, color: "#5F6D7C" }} />
          </IconButton>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h4" sx={{ fontWeight: 900, color: "#1A2027" }}>
              Emotion <span style={{ color: EMOTION_THEME }}>Tracker</span>
            </Typography>
            <Typography variant="body2" sx={{ color: "#5F6D7C", fontWeight: 600 }}>Track your daily mood patterns</Typography>
          </Box>
        </Box>

        {/* Date Picker */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: "20px", border: "1px solid #E0E0E0", display: "flex", alignItems: "center", gap: 2, bgcolor: "#FFF" }}>
            <DatePicker
              label="Select Date"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              maxDate={dayjs()}
              format="DD-MM-YYYY"
              slots={{ day: StyledPickersDay }}
              slotProps={{
                day: (ownerState) => ({
                  isSubmitted: submittedDates.includes(ownerState.day.format("YYYY-MM-DD")),
                  isToday: ownerState.day.isSame(dayjs(), "day"),
                }),
                textField: { size: "small", sx: { width: 180 } },
              }}
            />
            {hasExistingData && !isEditing && (
              <Button
                startIcon={<EditIcon />}
                variant="contained"
                onClick={() => setIsEditing(true)}
                sx={{ bgcolor: EMOTION_THEME, borderRadius: "12px", fontWeight: 700, "&:hover": { bgcolor: "#C62828" } }}
              >
                Edit
              </Button>
            )}
          </Paper>
        </Box>

        {/* Session Cards - Horizontal in Edit Mode */}
        <Grid container spacing={isEditing ? 2 : 4} sx={{ justifyContent: "center" }}>
          {SESSIONS.map((session) => (
            <Grid item xs={12} md={isEditing ? 4 : 12} key={session}>
              <Card
                elevation={0}
                sx={{
                  p: isEditing ? 0.5 : 1,
                  borderRadius: "32px",
                  border: "1px solid #F0F0F0",
                  backgroundColor: "#fff",
                  boxShadow: "0 15px 40px rgba(0,0,0,0.04)",
                }}
              >
                <CardContent>
                  <Typography variant={isEditing ? "subtitle1" : "h6"} fontWeight={900} sx={{ color: "#1A2027", mb: isEditing ? 1 : 3 }}>
                    {session} Session
                  </Typography>

                  {isEditing && (
                    <Box sx={{ display: "flex", gap: 1, mb: 2, overflowX: "auto", pb: 1, "&::-webkit-scrollbar": { display: "none" } }}>
                      {EMOTIONS.map((emotion) => {
                        const isSelected = data[session].some((e) => e.label === emotion.label);
                        return (
                          <Button
                            key={emotion.label}
                            variant={isSelected ? "contained" : "outlined"}
                            disabled={!isSelected && data[session].length >= 3}
                            onClick={() => addEmotion(session, emotion)}
                            sx={{
                              borderRadius: "12px", fontSize: "0.7rem", py: 0.5, px: 1.5, whiteSpace: "nowrap", textTransform: "none", fontWeight: 800,
                              borderColor: isSelected ? emotion.color : `${emotion.color}40`,
                              color: isSelected ? "#FFF" : emotion.color,
                              bgcolor: isSelected ? emotion.color : "transparent",
                            }}
                          >
                            {emotion.label}
                          </Button>
                        );
                      })}
                    </Box>
                  )}

                  <Box sx={{ display: "flex", flexDirection: "column", gap: isEditing ? 1 : 2 }}>
                    {data[session].map((e, i) => (
                      <Paper
                        key={i}
                        elevation={0}
                        sx={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          p: isEditing ? 1.5 : 2, borderRadius: "20px", bgcolor: "#F9FAFB", border: "1px solid #F0F0F0",
                          borderLeft: `6px solid ${getEmotionColor(e.label)}`,
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: isEditing ? 1 : 3 }}>
                          <Typography fontWeight={900} sx={{ width: isEditing ? 70 : 85, color: "#2C3E50", fontSize: isEditing ? "0.9rem" : "1rem" }}>
                            {e.label}
                          </Typography>
                          <Divider orientation="vertical" flexItem sx={{ height: 24 }} />
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography variant="caption" fontWeight={800} color="#7F8C8D">INTENSITY</Typography>
                            <TextField
                              size="small"
                              type="number"
                              disabled={!isEditing}
                              value={e.intensity}
                              inputProps={{ min: 1, max: 3 }}
                              onChange={(ev) => updateIntensity(session, i, ev.target.value)}
                              sx={{ width: 55, "& .MuiOutlinedInput-root": { borderRadius: "10px", bgcolor: "#FFF" } }}
                            />
                          </Box>
                        </Box>
                        {isEditing && (
                          <IconButton onClick={() => removeEmotion(session, i)} sx={{ color: "#EF5350" }} size="small">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Paper>
                    ))}
                    {data[session].length === 0 && (
                      <Typography variant="body2" sx={{ textAlign: "center", py: 2, color: "#BDC3C7" }}>No emotions logged.</Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {isEditing && (
          <Box sx={{ mt: 6, width: "100%", display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained" size="large" onClick={handleSubmit}
              sx={{ maxWidth: 320, py: 2, px: 8, borderRadius: "20px", fontWeight: 900, bgcolor: EMOTION_THEME, "&:hover": { bgcolor: "#C62828" } }}
            >
              {hasExistingData ? "Update Daily Mood" : "Save Response"}
            </Button>
          </Box>
        )}
      </Container>

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack((prev) => ({ ...prev, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snack.severity} sx={{ fontWeight: 700 }}>{snack.message}</Alert>
      </Snackbar>
    </LocalizationProvider>
  );
}

export default Test;