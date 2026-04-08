import React from "react";
import { Box, Card, Grid, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PsychologyIcon from "@mui/icons-material/Psychology";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import BedtimeIcon from "@mui/icons-material/Bedtime";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import GroupsIcon from "@mui/icons-material/Groups";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

function Home() {
  const navigate = useNavigate();

  const wellnessCards = [
    { title: "Emotion", description: "Track your daily emotions and moods", icon: PsychologyIcon, path: "/test", color: "#FF1744" },
    { title: "Hydration", description: "Monitor your daily water intake", icon: WaterDropIcon, path: "/water", color: "#0288D1" },
    { title: "Sleep", description: "Track your sleep patterns and quality", icon: BedtimeIcon, path: "/sleep", color: "#7C4DFF" },
    { title: "Exercise", description: "Log your workouts and activities", icon: FitnessCenterIcon, path: "/exercise", color: "#00ACC1" },
    { title: "Social Battery", description: "Check your social energy levels", icon: GroupsIcon, path: "/mood-check", color: "#66BB6A" },
    { title: "Gratitude Jar", description: "Write your daily reflections and thoughts", icon: MenuBookIcon, path: "/gratitude-jar", color: "#FFA726" },
  ];

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '8vh', 
      backgroundColor: "#F4F7F9", // Soft background
      py:-5 
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="center">
          {wellnessCards.map((card, index) => {
            const CardIcon = card.icon;
            const colorTint = card.color + "15"; // Very light
            const colorBorder = card.color + "30"; // Soft border
            
            return (
              <Grid item xs={12} sm={6} md={4} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Card
                  onClick={() => navigate(card.path)}
                  elevation={0}
                  sx={{
                    // CRITICAL: Fixed dimensions for perfect symmetry
                    
                    width: "400px", 
                    height: "160px",
                    
                    display: "flex",
                    alignItems: "center",
                    padding: "0 24px",
                    backgroundColor: "#fff",
                    border: `1px solid ${colorBorder}`,
                    borderRadius: "28px", // Extra rounded like reference
                    cursor: "pointer",
                    position: "relative",
                    transition: "all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: `0 20px 40px ${card.color}20`,
                      borderColor: card.color,
                    },
                  }}
                >
                  {/* 1. FIXED ICON AREA */}
                  <Box
                    sx={{
                      width: "80px",
                      height: "80px",
                      backgroundColor: colorTint,
                      borderRadius: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <CardIcon sx={{ fontSize: 38, color: card.color }} />
                  </Box>

                  {/* 2. CONSTANT LENGTH TEXT AREA */}
                  <Box sx={{ 
                    flex: 1, 
                    ml: 3, 
                    pr: 2, // Extra space before the button
                    overflow: "hidden",
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}>
                    <Typography variant="h6" sx={{ fontWeight: "900", color: "#1A2027", mb: 0.5, fontSize: "1.15rem" }}>
                      {card.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: "#5F6D7C", 
                        lineHeight: 1.4,
                        // Fixes height so text doesn't push the card boundaries
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        minHeight: "40px" 
                      }}
                    >
                      {card.description}
                    </Typography>
                  </Box>

                  {/* 3. FIXED RIGHT ACTION BUTTON */}
                  <Box
                    sx={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "16px",
                      backgroundColor: "#F0F4F8",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#A0AEC0",
                      flexShrink: 0,
                      transition: "0.3s",
                      ".MuiCard-root:hover &": {
                        backgroundColor: card.color,
                        color: "#fff",
                        boxShadow: `0 8px 15px ${card.color}40`
                      }
                    }}
                  >
                    <ArrowForwardIcon sx={{ fontSize: 24 }} />
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}

export default Home;