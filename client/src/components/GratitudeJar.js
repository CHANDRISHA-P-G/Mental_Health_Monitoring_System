import React, { useState, useEffect } from "react";
import { 
  Box, Typography, TextField, Button, Container, 
  IconButton, Paper, Card, Grid, Fade 
} from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'; 
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Your assigned color from the dashboard
const GRATITUDE_COLOR = "#FFA726";

function GratitudeJar() {
  const navigate = useNavigate();
  const [note, setNote] = useState("");
  const [savedNotes, setSavedNotes] = useState([]);
  const token = localStorage.getItem("token");

  // Fetch today's notes on load
  useEffect(() => {
    const fetchGratitude = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/gratitude/today", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSavedNotes(res.data || []);
      } catch (err) {
        console.error("Error fetching gratitude:", err);
      }
    };
    if (token) fetchGratitude();
  }, [token]);

  const handleSave = async () => {
    if (!note.trim()) return;

    try {
      // Mocking the post - Replace with your actual endpoint
      const newEntry = { text: note, id: Date.now() };
      await axios.post("http://localhost:5000/api/gratitude", newEntry, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSavedNotes([newEntry, ...savedNotes]);
      setNote(""); // Clear input
    } catch (err) {
      alert("Failed to save to the jar ❌");
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      
      {/* Header */}
      <Box sx={{ mb: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <IconButton 
          onClick={() => navigate("/")}
          sx={{ position: 'absolute', left: 0, border: "1px solid #E0E0E0", bgcolor: "#fff" }}
        >
          <ArrowBackIosNewIcon sx={{ fontSize: 18, color: "#5F6D7C" }} />
        </IconButton>
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 900, color: "#1A2027" }}>
            Gratitude <span style={{ color: GRATITUDE_COLOR }}>Jar</span>
          </Typography>
          <Typography variant="body2" sx={{ color: "#5F6D7C", fontWeight: 600 }}>
            What made you smile today?
          </Typography>
        </Box>
      </Box>

      {/* Input Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, mb: 6, borderRadius: "32px", 
          bgcolor: "#FFF8E1", // Very light amber tint
          border: `2px dashed ${GRATITUDE_COLOR}50`,
          textAlign: 'center'
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 800, color: "#5D4037" }}>
          Drop a note in the jar...
        </Typography>
        
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="Today I am thankful for..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          variant="outlined"
          sx={{ 
            bgcolor: "#fff", borderRadius: "16px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "16px",
              "& fieldset": { borderColor: "#E0E0E0" },
              "&:hover fieldset": { borderColor: GRATITUDE_COLOR },
            }
          }}
        />

        <Button 
          variant="contained" 
          onClick={handleSave}
          disabled={!note.trim()}
          startIcon={<AutoAwesomeIcon />}
          sx={{ 
            mt: 3, bgcolor: GRATITUDE_COLOR, color: '#fff', 
            px: 6, py: 1.5, borderRadius: "50px",
            fontWeight: 800, fontSize: "1rem",
            boxShadow: `0 8px 20px ${GRATITUDE_COLOR}40`,
            "&:hover": { bgcolor: "#FB8C00", boxShadow: 'none' }
          }}
        >
          Add to Jar
        </Button>
      </Paper>

      {/* Visual Display of Saved Notes */}
      <Typography variant="overline" sx={{ fontWeight: 900, color: "#BDC3C7", letterSpacing: 2 }}>
        Today's Blessings
      </Typography>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        {savedNotes.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="body2" sx={{ color: "#BDC3C7", fontStyle: 'italic', textAlign: 'center', py: 4 }}>
              The jar is empty. Add your first note above!
            </Typography>
          </Grid>
        ) : (
          savedNotes.map((item, index) => (
            <Grid item xs={12} sm={6} key={item.id}>
              <Fade in timeout={500 + index * 100}>
                <Card 
                  elevation={0} 
                  sx={{ 
                    p: 3, borderRadius: "20px", bgcolor: "#fff", 
                    borderLeft: `6px solid ${GRATITUDE_COLOR}`,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    position: 'relative', overflow: 'visible'
                  }}
                >
                  <FavoriteIcon sx={{ 
                    position: 'absolute', top: -10, right: -10, 
                    color: GRATITUDE_COLOR, fontSize: 30,
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
                  }} />
                  <Typography variant="body1" sx={{ fontWeight: 600, color: "#455A64", lineHeight: 1.6 }}>
                    "{item.text}"
                  </Typography>
                </Card>
              </Fade>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
}

export default GratitudeJar;