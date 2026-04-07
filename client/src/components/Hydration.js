import React, { useState } from "react";
import { Box, Typography, Card, LinearProgress, Button, Container, IconButton } from "@mui/material";
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import RemoveIcon from '@mui/icons-material/Remove';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import StarsIcon from '@mui/icons-material/Stars'; // Icon for exceeding limit
import { useNavigate } from "react-router-dom";

const HYDRATION_BLUE = "#0288D1"; 
const BONUS_COLOR = "#FFA000"; // Amber/Gold for exceeding the limit

function Hydration() {
  const navigate = useNavigate();
  const [ml, setMl] = useState(1200);
  const GOAL = 3000; 

  const addWater = (amount) => setMl((prev) => Math.min(prev + amount, 5000)); // Cap at 5L
  const removeWater = () => setMl((prev) => Math.max(prev - 250, 0));

  const isExceeded = ml > GOAL;
  const progress = (ml / GOAL) * 100;

  return (
    <Container maxWidth="lg" sx={{ py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Header Section */}
      <Box sx={{ mb: 5, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <IconButton 
          onClick={() => navigate("/")}
          sx={{ 
            position: 'absolute', left: 0, 
            backgroundColor: "#fff", border: "1px solid #E0E0E0",
            "&:hover": { backgroundColor: `${HYDRATION_BLUE}10` }
          }}
        >
          <ArrowBackIosNewIcon sx={{ fontSize: 18, color: "#5F6D7C" }} />
        </IconButton>
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 900, color: "#1A2027" }}>
            Hydration <span style={{ color: isExceeded ? BONUS_COLOR : HYDRATION_BLUE }}>Tracker</span>
          </Typography>
          <Typography variant="body2" sx={{ color: "#5F6D7C", fontWeight: 600 }}>
            Daily Goal: 3.0 Liters
          </Typography>
        </Box>
      </Box>

      {/* Main Progress Card */}
      <Card 
        elevation={0} 
        sx={{ 
          p: { xs: 4, md: 6 }, 
          width: '100%',
          maxWidth: '800px',
          borderRadius: "32px", 
          border: `1px solid ${isExceeded ? BONUS_COLOR : HYDRATION_BLUE}30`, 
          textAlign: 'center',
          backgroundColor: "#fff",
          mb: 6,
          transition: "all 0.5s ease",
          boxShadow: isExceeded 
            ? `0 20px 50px ${BONUS_COLOR}15` 
            : `0 20px 50px ${HYDRATION_BLUE}10`
        }}
      >
        <Box sx={{ 
          width: 110, height: 110, borderRadius: '30px', 
          backgroundColor: isExceeded ? `${BONUS_COLOR}15` : `${HYDRATION_BLUE}12`, 
          display: 'inline-flex', 
          alignItems: 'center', justifyContent: 'center', mb: 3 
        }}>
          {isExceeded ? (
            <StarsIcon sx={{ fontSize: 55, color: BONUS_COLOR }} />
          ) : (
            <WaterDropIcon sx={{ fontSize: 55, color: HYDRATION_BLUE }} />
          )}
        </Box>

        <Typography variant="h2" sx={{ fontWeight: 900, color: "#1A2027", mb: 2 }}>
          {ml.toLocaleString()} <span style={{ fontSize: '1.5rem', color: '#BDC3C7' }}>ml</span>
        </Typography>

        {/* Progress Bar with Dynamic Color */}
        <Box sx={{ width: '100%', maxWidth: '500px', mx: 'auto', mb: 2 }}>
          <LinearProgress 
            variant="determinate" 
            value={Math.min(progress, 100)} 
            sx={{ 
              height: 14, borderRadius: 10, 
              backgroundColor: isExceeded ? `${BONUS_COLOR}15` : `${HYDRATION_BLUE}10`,
              '& .MuiLinearProgress-bar': { 
                backgroundColor: isExceeded ? BONUS_COLOR : HYDRATION_BLUE, 
                borderRadius: 10 
              }
            }} 
          />
        </Box>
        
        <Typography variant="subtitle2" sx={{ fontWeight: "800", color: isExceeded ? BONUS_COLOR : HYDRATION_BLUE, letterSpacing: 1.5 }}>
          {isExceeded ? "BONUS LIMIT REACHED! 🌟" : `${Math.round(progress)}% OF DAILY GOAL`}
        </Typography>
      </Card>

      {/* Quick Add Section - Even Spacing & Centered */}
      <Box sx={{ width: '100%', maxWidth: '900px' }}>
        <Typography variant="h6" sx={{ fontWeight: 900, color: "#1A2027", mb: 3, textAlign: 'center' }}>
          Quick Add
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
            { label: "Glass", amount: 250 },
            { label: "Small", amount: 500 },
            { label: "Medium", amount: 750 },
            { label: "Large", amount: 1000 }
          ].map((item) => (
            <Card
              key={item.label}
              onClick={() => addWater(item.amount)}
              elevation={0}
              sx={{
                display: "flex", 
                flexDirection: "column",
                alignItems: "center", 
                justifyContent: "center",
                minWidth: "180px", // Fixed even width
                height: "150px", 
                borderRadius: "28px", 
                border: `1px solid ${HYDRATION_BLUE}20`,
                cursor: "pointer", 
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                backgroundColor: "#fff",
                flexShrink: 0,
                "&:hover": { 
                  transform: "translateY(-8px)", 
                  borderColor: HYDRATION_BLUE,
                  boxShadow: `0 15px 30px ${HYDRATION_BLUE}20`
                }
              }}
            >
              <Box sx={{ 
                width: 48, height: 48, borderRadius: "14px", 
                backgroundColor: `${HYDRATION_BLUE}12`, display: 'flex', 
                alignItems: 'center', justifyContent: 'center', mb: 1.5
              }}>
                <LocalDrinkIcon sx={{ color: HYDRATION_BLUE, fontSize: 24 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: "900", color: "#1A2027", fontSize: '1.05rem' }}>
                +{item.amount}ml
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
          onClick={removeWater}
          sx={{ 
            color: '#BDC3C7', fontWeight: '800', borderRadius: '12px',
            "&:hover": { color: '#E74C3C', backgroundColor: '#FEECEB' } 
          }}
        >
          Remove last 250ml
        </Button>
      </Box>
    </Container>
  );
}

export default Hydration;