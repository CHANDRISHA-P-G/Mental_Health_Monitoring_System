import React, { useState, useEffect, useCallback } from "react";
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";

const EMOTION_RED = "#E53935"; 

const EMOTIONS = [
  { label: "Happy", score: 2, color: "#4CAF50" },
  { label: "Calm", score: 2, color: "#4CAF50" },
  { label: "Neutral", score: 0, color: "#9E9E9E" },
  { label: "Sad", score: -1, color: "#EF5350" },
  { label: "Anxious", score: -1, color: "#EF5350" },
  { label: "Angry", score: -2, color: "#EF5350" },
  { label: "Stressed", score: -2, color: "#EF5350" },
  { label: "Tired", score: -2, color: "#EF5350" },
];

const SESSIONS = ["Morning", "Afternoon", "Night"];

const StyledPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) => prop !== "isSubmitted" && prop !== "isToday",
})(({ theme, isSubmitted, isToday, selected }) => ({
  ...(isSubmitted && {
    backgroundColor: "#ffebee !important",
    color: EMOTION_RED,
    "&:hover": { backgroundColor: "#ffcdd2 !important" },
  }),
  ...(isToday && {
    border: `1px solid ${EMOTION_RED}`,
  }),
  ...(selected && {
    backgroundColor: `${EMOTION_RED} !important`,
    color: "white",
  }),
}));

function Test() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [isEditing, setIsEditing] = useState(false);
  const [hasExistingData, setHasExistingData] = useState(false);
  const [submittedDates, setSubmittedDates] = useState([]);
  const [data, setData] = useState({ Morning: [], Afternoon: [], Night: [] });

  const token = localStorage.getItem("token");

  const fetchHistory = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/responses/all-dates", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubmittedDates(Array.isArray(res.data) ? res.data : []);
    } catch (err) { console.error(err); }
  }, [token]);

  const checkExistingData = useCallback(async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/responses/by-date?date=${selectedDate.format("YYYY-MM-DD")}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data) {
        setData(res.data);
        setHasExistingData(true);
        setIsEditing(false);
      } else { resetForm(); }
    } catch (err) { resetForm(); }
  }, [selectedDate, token]);

  const resetForm = () => {
    setData({ Morning: [], Afternoon: [], Night: [] });
    setHasExistingData(false);
    setIsEditing(true);
  };

  useEffect(() => {
    if (!token) navigate("/login");
    fetchHistory();
  }, [token, navigate, fetchHistory]);

  useEffect(() => { checkExistingData(); }, [selectedDate, checkExistingData]);

  const addEmotion = (session, emotion) => {
    if (!isEditing || data[session].length >= 3) return;
    if (data[session].some((e) => e.label === emotion.label)) return;
    setData({ ...data, [session]: [...data[session], { ...emotion, intensity: 1 }] });
  };

  const updateIntensity = (session, index, value) => {
    if (!isEditing || value < 1 || value > 3) return;
    const updated = [...data[session]];
    updated[index].intensity = value;
    setData({ ...data, [session]: updated });
  };

  const removeEmotion = (session, index) => {
    if (!isEditing) return;
    setData({ ...data, [session]: data[session].filter((_, i) => i !== index) });
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        answers: { ...data, date: selectedDate.format("YYYY-MM-DD") },
        scores: data,
      };
      await axios.post("http://localhost:5000/api/responses", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Emotion Response Saved ✅");
      fetchHistory();
      setHasExistingData(true);
      setIsEditing(false);
    } catch (err) { alert("Error saving response ❌"); }
  };

  const getEmotionColor = (label) => {
    const emotion = EMOTIONS.find(e => e.label === label);
    return emotion ? emotion.color : "#9E9E9E";
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Header Section */}
        <Box sx={{ mb: 5, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <IconButton 
            onClick={() => navigate("/")}
            sx={{ 
              position: 'absolute', left: 0, 
              backgroundColor: "#fff", border: "1px solid #E0E0E0",
              "&:hover": { backgroundColor: `${EMOTION_RED}10` }
            }}
          >
            <ArrowBackIosNewIcon sx={{ fontSize: 18, color: "#5F6D7C" }} />
          </IconButton>
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 900, color: "#1A2027" }}>
              Emotion <span style={{ color: EMOTION_RED }}>Tracker</span>
            </Typography>
            <Typography variant="body2" sx={{ color: "#5F6D7C", fontWeight: 600 }}>
              Track your daily mood patterns
            </Typography>
          </Box>
        </Box>

        {/* Date Selection Box */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Paper elevation={0} sx={{ 
            p: 2, borderRadius: '20px', border: '1px solid #E0E0E0',
            display: 'flex', alignItems: 'center', gap: 2, bgcolor: '#FFF'
          }}>
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
                textField: { size: "small", sx: { width: 180 } }
              }}
            />
            {hasExistingData && !isEditing && (
              <Button 
                startIcon={<EditIcon />} 
                variant="contained" 
                onClick={() => setIsEditing(true)}
                sx={{ bgcolor: EMOTION_RED, borderRadius: '12px', fontWeight: 700, "&:hover": { bgcolor: '#C62828' } }}
              >
                Edit
              </Button>
            )}
          </Paper>
        </Box>

        {/* Main Content Grid - Centered & Fixed Width */}
        <Grid container spacing={4} sx={{ maxWidth: '800px', mx: 'auto' }}>
          {SESSIONS.map((session) => (
            <Grid item xs={12} key={session}>
              <Card 
                elevation={0} 
                sx={{ 
                  p: { xs: 1, md: 1 }, // Reduced padding slightly
                  borderRadius: "32px", 
                  border: `1px solid #F0F0F0`, 
                  backgroundColor: "#fff",
                  boxShadow: `0 15px 40px rgba(0,0,0,0.04)`,
                  overflow: 'visible' // CRITICAL: Ensures hovering buttons don't clip
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" fontWeight={900} sx={{ color: "#1A2027", letterSpacing: -0.5 }}>
                      {session} Session
                    </Typography>
                  </Box>
                  
                  {isEditing && (
                    <Box sx={{ 
                      display: "flex", gap: 1.5, mb: 4, overflowX: "auto", pb: 2,
                      '&::-webkit-scrollbar': { display: 'none' },
                      position: 'relative',
                      zIndex: 2 // Keeps buttons above card background
                    }}>
                      {EMOTIONS.map((emotion) => {
                        const isSelected = data[session].some((e) => e.label === emotion.label);
                        return (
                          <Button
                            key={emotion.label}
                            variant={isSelected ? "contained" : "outlined"}
                            disabled={!isSelected && data[session].length >= 3}
                            onClick={() => addEmotion(session, emotion)}
                            sx={{ 
                              borderRadius: '14px', fontSize: '0.75rem', py: 1, px: 2.5,
                              whiteSpace: 'nowrap', minWidth: 'max-content',
                              textTransform: 'none', fontWeight: 800,
                              borderColor: isSelected ? emotion.color : `${emotion.color}40`, 
                              color: isSelected ? '#FFF' : emotion.color,
                              bgcolor: isSelected ? emotion.color : 'transparent',
                              boxShadow: isSelected ? `0 4px 12px ${emotion.color}40` : 'none',
                              position: 'relative',
                              zIndex: 3, // Forces button to top when animating
                              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                              "&:hover": { 
                                bgcolor: isSelected ? emotion.color : `${emotion.color}10`, 
                                borderColor: emotion.color,
                                transform: 'translateY(-5px)', // Lift effect
                                zIndex: 10 // Ensure it stays on top while lifting
                              }
                            }}
                          >
                            {emotion.label}
                          </Button>
                        );
                      })}
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {data[session].map((e, i) => (
                      <Paper key={i} elevation={0} sx={{ 
                        display: "flex", alignItems: "center", justifyContent: 'space-between',
                        p: 2, borderRadius: '20px', bgcolor: '#F9FAFB', 
                        border: '1px solid #F0F0F0',
                        borderLeft: `6px solid ${getEmotionColor(e.label)}`
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 3 } }}>
                          <Typography fontWeight={900} sx={{ width: 85, color: "#2C3E50" }}>{e.label}</Typography>
                          <Divider orientation="vertical" flexItem sx={{ height: 24, alignSelf: 'center' }} />
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="caption" fontWeight={800} color="#7F8C8D" sx={{ textTransform: 'uppercase' }}>Intensity</Typography>
                            <TextField
                              size="small" type="number" disabled={!isEditing}
                              value={e.intensity}
                              inputProps={{ min: 1, max: 3 }}
                              onChange={(ev) => updateIntensity(session, i, Number(ev.target.value))}
                              sx={{ width: 65, '& .MuiOutlinedInput-root': { borderRadius: '10px', bgcolor: '#FFF', fontWeight: 700 } }}
                            />
                          </Box>
                        </Box>
                        {isEditing && (
                          <IconButton onClick={() => removeEmotion(session, i)} sx={{ color: '#EF5350', bgcolor: '#FFF', '&:hover': { bgcolor: '#FEECEB' } }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Paper>
                    ))}
                    {data[session].length === 0 && (
                      <Typography variant="body2" sx={{ textAlign: 'center', py: 2, color: '#BDC3C7', fontWeight: 500 }}>
                        No emotions logged.
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {isEditing && (
          <Box sx={{ mt: 6, width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              size="large"
              fullWidth
              onClick={handleSubmit}
              sx={{ 
                maxWidth: 320, py: 2, borderRadius: '20px', fontWeight: 900, 
                bgcolor: EMOTION_RED, 
                fontSize: '1rem',
                letterSpacing: 0.5,
                boxShadow: `0 10px 25px ${EMOTION_RED}30`,
                transition: "all 0.3s ease",
                "&:hover": { 
                  bgcolor: '#C62828', 
                  boxShadow: `0 12px 30px ${EMOTION_RED}40`,
                  transform: 'translateY(-2px)'
                }
              }} 
            >
              {hasExistingData ? "Update Daily Mood" : "Save Response"}
            </Button>
          </Box>
        )}
      </Container>
    </LocalizationProvider>
  );
}

export default Test;