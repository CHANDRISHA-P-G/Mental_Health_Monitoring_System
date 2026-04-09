import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography, TextField, Button, Container, IconButton, Paper, Card, Stack, Fade, CircularProgress } from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'; 
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

const GRATITUDE_COLOR = "#FFA726";
const API_BASE = process.env.REACT_APP_API_URL || "https://mental-health-monitoring-system-pnuu.onrender.com";

function GratitudeJar() {
  const navigate = useNavigate();
  const [note, setNote] = useState("");
  const [savedNotes, setSavedNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const today = dayjs().format("YYYY-MM-DD"); // use only date

  const fetchGratitude = useCallback(async () => {
    if (!token) return;
    const headers = { headers: { Authorization: `Bearer ${token}` } };
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/responses/by-date?date=${today}`, headers);
      if (res.data && res.data.gratitude) {
        setSavedNotes(res.data.gratitude);
      } else {
        setSavedNotes([]);
      }
    } catch (err) {
      console.error("Jar is fresh today", err.response?.data || err.message);
      setSavedNotes([]);
    } finally {
      setLoading(false);
    }
  }, [today, token]);

  useEffect(() => {
    fetchGratitude();
  }, [fetchGratitude]);

  const handleSave = async () => {
    if (!note.trim()) return;
    const newEntry = { text: note, id: Date.now() }; // unique id
    const updatedList = [newEntry, ...savedNotes];
    const headers = { headers: { Authorization: `Bearer ${token}` } };

    try {
      await axios.post(`${API_BASE}/responses`, 
        { date: today, answers: { gratitude: updatedList } },
        headers
      );
      setNote("");
      await fetchGratitude();
    } catch (err) {
      console.error("Gratitude save failed:", err.response?.data || err.message);
      alert("Failed to save to the jar ❌");
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      {/* Header */}
      <Box sx={{ mb: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <IconButton onClick={() => navigate("/")} sx={{ position: 'absolute', left: 0, border: "1px solid #E0E0E0", bgcolor: "#fff" }}>
          <ArrowBackIosNewIcon sx={{ fontSize: 18, color: "#5F6D7C" }} />
        </IconButton>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 900, color: "#1A2027" }}>
            Gratitude <span style={{ color: GRATITUDE_COLOR }}>Jar</span>
          </Typography>
          <Typography variant="body2" sx={{ color: "#5F6D7C", fontWeight: 600 }}>What made you smile today?</Typography>
        </Box>
      </Box>

      {/* Entry input */}
      <Paper elevation={0} sx={{ p: 4, mb: 6, borderRadius: "32px", bgcolor: "#FFF8E1", border: `2px dashed ${GRATITUDE_COLOR}50`, textAlign: 'center' }}>
        <TextField 
          fullWidth 
          multiline 
          rows={3} 
          placeholder="Today I am thankful for..." 
          value={note} 
          onChange={(e) => setNote(e.target.value)} 
          variant="outlined" 
          sx={{ bgcolor: "#fff", borderRadius: "16px", "& .MuiOutlinedInput-root": { borderRadius: "16px" } }} 
        />
        <Button 
          variant="contained" 
          onClick={handleSave} 
          disabled={!note.trim()} 
          startIcon={<AutoAwesomeIcon />} 
          sx={{ mt: 3, bgcolor: GRATITUDE_COLOR, px: 6, py: 1.5, borderRadius: "50px", fontWeight: 800, "&:hover": { bgcolor: "#FB8C00" } }}
        >
          Add to Jar
        </Button>
      </Paper>

      {/* Display today's blessings */}
      <Typography variant="overline" sx={{ fontWeight: 900, color: "#BDC3C7", letterSpacing: 2, mb: 2, display: 'block' }}>Today's Blessings</Typography>
      
      <Stack spacing={2}>
        {savedNotes.length === 0 ? (
          <Typography variant="body2" sx={{ color: "#BDC3C7", fontStyle: 'italic', textAlign: 'center', py: 4 }}>The jar is empty.</Typography>
        ) : (
          savedNotes.map((item) => (
            <Fade in timeout={400} key={item.id}>
              <Card elevation={0} sx={{ p: 3, borderRadius: "20px", bgcolor: "#fff", borderLeft: `6px solid ${GRATITUDE_COLOR}`, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", position: 'relative' }}>
                <FavoriteIcon sx={{ position: 'absolute', top: 12, right: 12, color: GRATITUDE_COLOR, fontSize: 20, opacity: 0.6 }} />
                <Typography variant="body1" sx={{ fontWeight: 600, color: "#455A64", mb: 0.5 }}>"{item.text}"</Typography>
              </Card>
            </Fade>
          ))
        )}
      </Stack>
    </Container>
  );
}

export default GratitudeJar;