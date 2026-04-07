import React, { useState } from "react";
import { Box, Typography, Card, Container, IconButton, Stack, Slider } from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Battery Segments Configuration
const BATTERY_LEVELS = [
  { color: "#D32F2F", label: "Drained", emoji: "☹️" },   // Red
  { color: "#F44336", label: "Low", emoji: "😟" },       // Light Red
  { color: "#E91E63", label: "Tired", emoji: "😑" },     // Pink
  { color: "#FFB300", label: "Steady", emoji: "😐" },    // Orange/Yellow
  { color: "#4CAF50", label: "Good", emoji: "🙂" },      // Light Green
  { color: "#2E7D32", label: "Great", emoji: "😊" },     // Green
  { color: "#00695C", label: "Fully Charged", emoji: "😁" } // Dark Green/Teal
];

function SocialBattery() {
  const navigate = useNavigate();
  const [value, setValue] = useState(4); // Default to a middle state (0-6)

  const currentLevel = BATTERY_LEVELS[value];

  return (
    <Container maxWidth="lg" sx={{ py: 6, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Header */}
      <Box sx={{ mb: 8, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <IconButton 
          onClick={() => navigate("/")}
          sx={{ position: 'absolute', left: 0, border: "1px solid #E0E0E0", bgcolor: "#fff" }}
        >
          <ArrowBackIosNewIcon sx={{ fontSize: 18, color: "#5F6D7C" }} />
        </IconButton>
        <Typography variant="h4" sx={{ fontWeight: 900, color: "#1A2027", letterSpacing: -1 }}>
          MY <span style={{ color: currentLevel.color }}>SOCIAL BATTERY</span>
        </Typography>
      </Box>

      {/* The Visual Battery Card */}
      <Card 
        elevation={0}
        sx={{ 
          p: 4, 
          width: '100%', 
          maxWidth: '600px', 
          borderRadius: "40px", 
          bgcolor: "#1A1A1A", // Dark theme like the image
          border: "8px solid #2A2A2A",
          position: 'relative',
          overflow: 'hidden',
          mb: 6
        }}
      >
        {/* Battery "Tip" */}
        <Box sx={{ 
          position: 'absolute', right: -10, top: '50%', transform: 'translateY(-50%)',
          width: '20px', height: '60px', bgcolor: '#2A2A2A', borderRadius: '0 10px 10px 0' 
        }} />

        <Stack direction="row" spacing={1} sx={{ height: '180px', alignItems: 'flex-end' }}>
          {BATTERY_LEVELS.map((level, index) => (
            <Box 
              key={index} 
              sx={{ 
                flex: 1, 
                height: '100%', 
                bgcolor: index <= value ? level.color : "#333",
                borderRadius: "12px",
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                opacity: index <= value ? 1 : 0.3,
                transform: index === value ? "scaleY(1.05)" : "scaleY(1)",
                position: 'relative'
              }}
            >
              {/* Emoji Label */}
              <Typography sx={{ fontSize: '1.8rem', mb: 1 }}>
                {level.emoji}
              </Typography>

              {/* Selection Glow */}
              {index === value && (
                <motion.div 
                  layoutId="glow"
                  style={{
                    position: 'absolute', bottom: 10, width: '12px', height: '12px',
                    borderRadius: '50%', backgroundColor: '#fff', boxShadow: '0 0 15px #fff'
                  }}
                />
              )}
            </Box>
          ))}
        </Stack>
      </Card>

      {/* Smooth Slider Controller */}
      <Box sx={{ width: '100%', maxWidth: '500px', textAlign: 'center' }}>
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
              width: 28, height: 28, backgroundColor: '#fff',
              border: `4px solid ${currentLevel.color}`,
              transition: '0.3s'
            },
            '& .MuiSlider-track': { border: 'none' },
            '& .MuiSlider-rail': { opacity: 0.2, backgroundColor: '#bfbfbf' },
          }}
        />
        
        <Typography variant="body2" sx={{ mt: 3, color: "#5F6D7C", fontWeight: 600 }}>
          Slide to update your energy capacity
        </Typography>
      </Box>

    </Container>
  );
}

export default SocialBattery;