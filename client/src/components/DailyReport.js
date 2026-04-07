import React, { useState } from "react";
import {
  Grid, Typography, Card, CardContent, Box,
  LinearProgress, Stack, Avatar
} from "@mui/material";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";
import { Doughnut, Bar } from "react-chartjs-2";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import WaterDropIcon from "@mui/icons-material/WaterDrop";
import BedtimeIcon from "@mui/icons-material/Bedtime";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import GroupsIcon from "@mui/icons-material/Groups";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AssessmentIcon from "@mui/icons-material/Assessment";

import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const PASTEL_GREEN = "#A5D6A7";
const PASTEL_YELLOW = "#FFF59D";
const PASTEL_RED = "#EF9A9A";

const ChartCard = styled(Card)(() => ({
  borderRadius: "24px",
  boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
  border: "1px solid rgba(0,0,0,0.05)",
  height: "450px",
}));

const TrackerCard = styled(Card)(() => ({
  borderRadius: "20px",
  boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
  border: "1px solid rgba(0,0,0,0.06)",
  height: "220px",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "10px",
  background: "#fff",
}));

const DailyReport = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const mockData = {
    gratitude: "I am grateful for the progress I made on my project today."
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{
        bgcolor: "#F8FAFC",
        minHeight: "100vh",
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>

        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography variant="h3" fontWeight={900} sx={{ mb: 2 }}>
            Daily Summary
          </Typography>

          <Box sx={{
            display: 'inline-flex',
            bgcolor: '#fff',
            px: 2,
            py: 0.5,
            borderRadius: '50px',
            border: '1px solid #f0f0f0',
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
          }}>
            <DatePicker
              value={selectedDate}
              onChange={(v) => setSelectedDate(v)}
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  variant: 'standard',
                  InputProps: { disableUnderline: true },
                  sx: {
                    '& .MuiInputBase-input': {
                      textAlign: 'center',
                      fontWeight: 600
                    }
                  }
                }
              }}
            />
          </Box>
        </Box>

        <Box sx={{ width: '100%', maxWidth: '1000px' }}>

          {/* Charts */}
          <Grid container spacing={3} sx={{ mb: 6 }}>
            <Grid item xs={12} md={6}>
              <ChartCard>
                <CardContent>
                  <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                    <Avatar sx={{ bgcolor: '#E8F5E9', width: 28, height: 28 }}>
                      💡
                    </Avatar>
                    <Typography variant="h6" fontWeight={800}>
                      Emotion Distribution
                    </Typography>
                  </Stack>

                  <Box sx={{ height: 320 }}>
                    <Doughnut
                      data={{
                        labels: ["Positive", "Neutral", "Negative"],
                        datasets: [{
                          data: [60, 15, 25],
                          backgroundColor: [PASTEL_GREEN, PASTEL_YELLOW, PASTEL_RED],
                          borderWidth: 0
                        }]
                      }}
                      options={{
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: "bottom",
                            labels: {
                              usePointStyle: true,
                              pointStyle: "circle",
                              boxWidth: 8,
                              boxHeight: 8,
                              padding: 20,
                              font: {
                                size: 13,
                                weight: "600"
                              }
                            }
                          }
                        }
                      }}
                    />
                  </Box>
                </CardContent>
              </ChartCard>
            </Grid>

            <Grid item xs={12} md={6}>
              <ChartCard>
                <CardContent>
                  <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                    <AssessmentIcon sx={{ fontSize: 24, color: '#90A4AE' }} />
                    <Typography variant="h6" fontWeight={800}>
                      Energy Timeline
                    </Typography>
                  </Stack>

                  <Box sx={{ height: 320 }}>
                    <Bar
                      data={{
                        labels: ["Morning", "Afternoon", "Night"],
                        datasets: [{
                          data: [6, -4, 8],
                          backgroundColor: [PASTEL_GREEN, PASTEL_RED, PASTEL_GREEN],
                          borderRadius: 10
                        }]
                      }}
                      options={{
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } }
                      }}
                    />
                  </Box>
                </CardContent>
              </ChartCard>
            </Grid>
          </Grid>

          {/* Tracker Cards */}
          <Grid container spacing={3} justifyContent="center" sx={{ mb: 6 }}>
            {[
              { label: 'HYDRATION', val: '85%', icon: <WaterDropIcon />, color: '#03A9F4', pct: 85 },
              { label: 'SLEEP', val: '7.5h', icon: <BedtimeIcon />, color: '#7E57C2', text: "Good Session", textColor: "#9575CD" },
              { label: 'EXERCISE', val: '45m', icon: <FitnessCenterIcon />, color: '#26C6DA', text: "Goal Reached", textColor: "#4DD0E1" },
              { label: 'SOCIAL', val: '40%', icon: <GroupsIcon />, color: '#81C784', pct: 40 }
            ].map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <TrackerCard>

                  <Avatar sx={{
                    bgcolor: `${item.color}15`,
                    color: item.color,
                    width: 40,
                    height: 40
                  }}>
                    {item.icon}
                  </Avatar>

                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" fontWeight={800} sx={{ letterSpacing: 1.2 }}>
                      {item.label}
                    </Typography>
                    <Typography variant="h4" fontWeight={900}>
                      {item.val}
                    </Typography>
                  </Box>

                  <Box sx={{
                    width: '100%',
                    minHeight: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {item.pct ? (
                      <Box sx={{ width: "100%", textAlign: "center" }}>
                        <LinearProgress
                          variant="determinate"
                          value={item.pct}
                          sx={{
                            height: 8,
                            borderRadius: 5,
                            width: "90%",
                            mx: "auto",
                            bgcolor: `${item.color}20`
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{ mt: 0.5, display: "block", fontWeight: 700, color: item.color }}
                        >
                          {item.pct}% Completed
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="caption" fontWeight={800} sx={{ color: item.textColor }}>
                        {item.text}
                      </Typography>
                    )}
                  </Box>

                </TrackerCard>
              </Grid>
            ))}
          </Grid>

          {/* Gratitude */}
          <Box sx={{
            bgcolor: '#1A2027',
            borderRadius: '24px',
            py: 5,
            px: 4,
            textAlign: 'center'
          }}>
            <MenuBookIcon sx={{ color: '#FFA726', fontSize: 28, mb: 1.5 }} />
            <Typography variant="h6" sx={{ color: '#fff', fontStyle: 'italic' }}>
              "{mockData.gratitude}"
            </Typography>
          </Box>

        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default DailyReport;