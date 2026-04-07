import React, { useState } from "react";
import { Box, Typography, Card, LinearProgress, Button, Container, IconButton } from "@mui/material";
import BedtimeIcon from '@mui/icons-material/Bedtime';
//import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import { useNavigate } from "react-router-dom";

// The exact purple from your Wellness Hub card
const SLEEP_PURPLE = "#7C4DFF"; 
const BONUS_GOLD = "#FFA000"; 
const GOAL_HOURS = 8; 

function Sleep() {
  const navigate = useNavigate();
  const [hours, setHours] = useState(6.5);

  const addTime = (amount) => setHours((prev) => Math.min(prev + amount, 12));
  const removeTime = () => setHours((prev) => Math.max(prev - 0.5, 0));

  const isExceeded = hours >= GOAL_HOURS;
  const progress = (hours / GOAL_HOURS) * 100;

  return (
    <Container maxWidth="lg" sx={{ py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Header Section */}
      <Box sx={{ mb: 5, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <IconButton 
          onClick={() => navigate("/")}
          sx={{ 
            position: 'absolute', left: 0, 
            backgroundColor: "#fff", border: "1px solid #E0E0E0",
            "&:hover": { backgroundColor: `${SLEEP_PURPLE}10` }
          }}
        >
          <ArrowBackIosNewIcon sx={{ fontSize: 18, color: "#5F6D7C" }} />
        </IconButton>
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 900, color: "#1A2027" }}>
            Sleep <span style={{ color: isExceeded ? BONUS_GOLD : SLEEP_PURPLE }}>Quality</span>
          </Typography>
          <Typography variant="body2" sx={{ color: "#5F6D7C", fontWeight: 600 }}>
            Ideal Rest: 8.0 Hours
          </Typography>
        </Box>
      </Box>

      {/* Main Sleep Progress Card */}
      <Card 
        elevation={0} 
        sx={{ 
          p: { xs: 4, md: 6 }, 
          width: '100%',
          maxWidth: '800px',
          borderRadius: "32px", 
          border: `1px solid ${isExceeded ? BONUS_GOLD : SLEEP_PURPLE}30`, 
          textAlign: 'center',
          backgroundColor: "#fff",
          mb: 6,
          boxShadow: isExceeded 
            ? `0 20px 50px ${BONUS_GOLD}15` 
            : `0 20px 50px ${SLEEP_PURPLE}10`
        }}
      >
        <Box sx={{ 
          width: 110, height: 110, borderRadius: '30px', 
          backgroundColor: isExceeded ? `${BONUS_GOLD}15` : `${SLEEP_PURPLE}12`, 
          display: 'inline-flex', 
          alignItems: 'center', justifyContent: 'center', mb: 3 
        }}>
          <BedtimeIcon sx={{ fontSize: 55, color: isExceeded ? BONUS_GOLD : SLEEP_PURPLE }} />
        </Box>

        <Typography variant="h2" sx={{ fontWeight: 900, color: "#1A2027", mb: 2 }}>
          {hours} <span style={{ fontSize: '1.5rem', color: '#BDC3C7' }}>hrs</span>
        </Typography>

        <Box sx={{ width: '100%', maxWidth: '500px', mx: 'auto', mb: 2 }}>
          <LinearProgress 
            variant="determinate" 
            value={Math.min(progress, 100)} 
            sx={{ 
              height: 14, borderRadius: 10, 
              backgroundColor: isExceeded ? `${BONUS_GOLD}15` : `${SLEEP_PURPLE}10`,
              '& .MuiLinearProgress-bar': { 
                backgroundColor: isExceeded ? BONUS_GOLD : SLEEP_PURPLE, 
                borderRadius: 10 
              }
            }} 
          />
        </Box>
        
        <Typography variant="subtitle2" sx={{ fontWeight: "800", color: isExceeded ? BONUS_GOLD : SLEEP_PURPLE, letterSpacing: 1.5 }}>
          {isExceeded ? "FULLY RESTED! 🌙" : "RECOVERY IN PROGRESS"}
        </Typography>
      </Card>

      {/* Quick Log Section - Single Line, Perfectly Even */}
      <Box sx={{ width: '100%', maxWidth: '900px' }}>
        <Typography variant="h6" sx={{ fontWeight: 900, color: "#1A2027", mb: 3, textAlign: 'center' }}>
          Quick Log
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 2.5, 
          flexWrap: { xs: 'nowrap', sm: 'wrap' },
          overflowX: { xs: 'auto', sm: 'visible' },
          pb: 2
        }}>
          {[
            { label: "Power Nap", amount: 0.5 },
            { label: "Short Rest", amount: 2 },
            { label: "Deep Sleep", amount: 4 },
            { label: "Full Night", amount: 8 }
          ].map((item) => (
            <Card
              key={item.label}
              onClick={() => addTime(item.amount)}
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
                transition: "0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                backgroundColor: "#fff",
                flexShrink: 0,
                "&:hover": { 
                  transform: "translateY(-8px)", 
                  borderColor: SLEEP_PURPLE,
                  boxShadow: `0 15px 30px ${SLEEP_PURPLE}20`
                }
              }}
            >
              <Box sx={{ 
                width: 48, height: 48, borderRadius: "14px", 
                backgroundColor: `${SLEEP_PURPLE}12`, display: 'flex', 
                alignItems: 'center', justifyContent: 'center', mb: 1.5
              }}>
                <NightsStayIcon sx={{ color: SLEEP_PURPLE, fontSize: 24 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: "900", color: "#1A2027", fontSize: '1.05rem' }}>
                +{item.amount}h
              </Typography>
              <Typography variant="caption" sx={{ color: "#5F6D7C", fontWeight: 700, textTransform: 'uppercase', fontSize: '0.65rem' }}>
                {item.label}
              </Typography>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Footer Actions */}
      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Button 
          variant="text" 
          startIcon={<RemoveIcon />} 
          onClick={removeTime}
          sx={{ 
            color: '#BDC3C7', fontWeight: '800', borderRadius: '12px',
            "&:hover": { color: '#E74C3C', backgroundColor: '#FEECEB' } 
          }}
        >
          Subtract 30 minutes
        </Button>
      </Box>
    </Container>
  );
}

export default Sleep;