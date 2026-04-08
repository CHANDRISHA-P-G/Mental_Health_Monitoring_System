import React, { useEffect, useState } from "react";
import {
  Grid, Typography, Card, CardContent, CircularProgress,
  Box, Avatar, Stack, LinearProgress
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Bar, Doughnut } from "react-chartjs-2";
import axios from "axios";
import dayjs from "dayjs";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";

// Icons
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import BedtimeIcon from "@mui/icons-material/Bedtime";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import GroupsIcon from "@mui/icons-material/Groups";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AssessmentIcon from "@mui/icons-material/Assessment";
import QueryStatsIcon from "@mui/icons-material/QueryStats";

import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  BarElement, ArcElement, Tooltip, Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, BarElement, ArcElement, Tooltip, Legend);

const PASTEL_GREEN = "#A5D6A7";
const PASTEL_YELLOW = "#FFF59D";
const PASTEL_RED = "#EF9A9A";
const WATER_GOAL = 2000; 

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

const sessions = ["Morning", "Afternoon", "Night"];

function DailyReport() {
  const [dayData, setDayData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [responseDates, setResponseDates] = useState([]);
  const API_BASE = process.env.REACT_APP_API_URL || "https://mental-health-monitoring-system-pnuu.onrender.com";

  useEffect(() => {
    const fetchDaily = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const dateParam = selectedDate.format("YYYY-MM-DD");
        const res = await axios.get(
          `${API_BASE}/responses/by-date?date=${dateParam}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDayData(res.data);
      } catch (err) {
        console.error("Error fetching daily data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDaily();
  }, [selectedDate, API_BASE]);

  useEffect(() => {
    const fetchResponseDates = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE}/responses/all-dates`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setResponseDates(res.data.map((d) => dayjs(d).format("YYYY-MM-DD")));
      } catch (err) {
        console.error("Error fetching response dates:", err);
      }
    };
    fetchResponseDates();
  }, [API_BASE]);

  const d = dayData || {};

  // --- LOGIC 1: DYNAMIC MOOD DISTRIBUTION (DOUGHNUT) ---
  let pos = 0, neu = 0, neg = 0;
  sessions.forEach(s => {
    const sessionLogs = d[s] || [];
    sessionLogs.forEach(e => {
      const weight = Math.abs(e.score * e.intensity);
      if (e.score > 0) pos += weight;
      else if (e.score < 0) neg += weight;
      else neu += weight || 1; // Fallback for neutral
    });
  });

  // Check if we have any data to show
  const hasMoodData = pos > 0 || neu > 0 || neg > 0;

  // --- LOGIC 2: SESSION ENERGY (BAR) ---
  const sessionScores = sessions.map(s => {
    const logs = d[s] || [];
    if (logs.length === 0) return 0;
    // Sum of (score * intensity)
    return logs.reduce((sum, e) => sum + (e.score * (e.intensity || 1)), 0);
  });

  // Stats for cards
  const hydrationVal = d.hydration || 0;
  const hydrationPct = Math.min(Math.round((hydrationVal / WATER_GOAL) * 100), 100);
  const socialPct = Math.min(Math.round(((d.socialBattery || 0) / 10) * 100), 100);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ bgcolor: "#F8FAFC", minHeight: "100vh", p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography variant="h3" fontWeight={900}>Daily Summary</Typography>
          <Typography variant="h6" color="textSecondary" sx={{ mb: 2 }}>
            {selectedDate.format("dddd, MMMM D, YYYY")}
          </Typography>

          <Box sx={{ display: 'inline-flex', bgcolor: '#fff', px: 2, py: 0.5, borderRadius: '50px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <DatePicker
              value={selectedDate}
              onChange={(v) => setSelectedDate(v)}
              format="DD/MM/YYYY"
              slots={{ day: (props) => {
                const { day, outsideCurrentMonth, ...other } = props;
                const formatted = day.format("YYYY-MM-DD");
                return (
                  <PickersDay
                    {...other}
                    day={day}
                    outsideCurrentMonth={outsideCurrentMonth}
                    sx={{
                      ...other.sx,
                      ...(responseDates.includes(formatted) ? {
                        border: '1px solid #1976d2',
                        bgcolor: '#e3f2fd',
                      } : {}),
                    }}
                  />
                );
              }} }
              slotProps={{ textField: { variant: "standard", InputProps: { disableUnderline: true } } }}
            />
          </Box>
        </Box>

        <Box sx={{ width: '100%', maxWidth: '1000px' }}>
          <Grid container spacing={3} sx={{ mb: 6 }}>
            {/* DOUGHNUT CHART - DYNAMICALLY UPDATED */}
            <Grid item xs={12} md={6}>
              <ChartCard>
                <CardContent>
                  <Stack direction="row" spacing={1.5} mb={2}>
                    <Avatar sx={{ bgcolor: '#E8F5E9' }}><AssessmentIcon sx={{ color: '#4CAF50' }} /></Avatar>
                    <Typography fontWeight={800}>Mood Distribution</Typography>
                  </Stack>
                  <Box sx={{ height: 320 }}>
                    <Doughnut
                      data={{
                        labels: ["Positive", "Neutral", "Negative"],
                        datasets: [{
                          data: hasMoodData ? [pos, neu, neg] : [0, 1, 0], // Show neutral if no data
                          backgroundColor: [PASTEL_GREEN, PASTEL_YELLOW, PASTEL_RED],
                          borderWidth: 0,
                          hoverOffset: 10
                        }]
                      }}
                      options={{ 
                        maintainAspectRatio: false, 
                        plugins: { 
                          legend: { 
                            position: "bottom",
                            labels: { usePointStyle: true, boxWidth: 10, padding: 20, font: { weight: '600' } }
                          } 
                        } 
                      }}
                    />
                  </Box>
                </CardContent>
              </ChartCard>
            </Grid>

            {/* BAR CHART - ENERGY PER SESSION */}
            <Grid item xs={12} md={6}>
              <ChartCard>
                <CardContent>
                  <Stack direction="row" spacing={1.5} mb={2}>
                    <Avatar sx={{ bgcolor: '#FFF3E0' }}><QueryStatsIcon sx={{ color: '#FF9800' }} /></Avatar>
                    <Typography fontWeight={800}>Energy by Session</Typography>
                  </Stack>
                  <Box sx={{ height: 320 }}>
                    <Bar
                      data={{
                        labels: sessions,
                        datasets: [{
                          label: 'Energy Score',
                          data: sessionScores,
                          backgroundColor: sessionScores.map(v => v >= 0 ? PASTEL_GREEN : PASTEL_RED),
                          borderRadius: 12,
                          barThickness: 40,
                        }]
                      }}
                      options={{
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                          y: { 
                            beginAtZero: true,
                            grid: { display: false },
                            ticks: { font: { weight: '600' } }
                          },
                          x: { 
                            grid: { display: false },
                            ticks: { font: { weight: '600' } }
                          }
                        }
                      }}
                    />
                  </Box>
                </CardContent>
              </ChartCard>
            </Grid>
          </Grid>

          {/* TRACKER CARDS */}
          <Grid container spacing={3} justifyContent="center" sx={{ mb: 6 }}>
            {[
              { label: 'HYDRATION', val: `${hydrationVal}ml`, icon: <WaterDropIcon />, color: '#03A9F4', pct: hydrationPct },
              { label: 'SLEEP', val: `${d.sleep || 0}h`, icon: <BedtimeIcon />, color: '#7E57C2', text: d.sleep >= 7 ? "Fully Rested" : "Needs Sleep" },
              { label: 'EXERCISE', val: `${d.exercise || 0}m`, icon: <FitnessCenterIcon />, color: '#26C6DA', text: d.exercise > 0 ? "Active Day" : "Stationary" },
              { label: 'SOCIAL', val: `${d.socialBattery || 0}/10`, icon: <GroupsIcon />, color: '#81C784', pct: socialPct }
            ].map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <TrackerCard>
                  <Avatar sx={{ bgcolor: `${item.color}15`, color: item.color }}>{item.icon}</Avatar>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" fontWeight={800} color="textSecondary">{item.label}</Typography>
                    <Typography variant="h4" fontWeight={900}>{item.val}</Typography>
                  </Box>
                  <Box sx={{ width: '100%', textAlign: 'center' }}>
                    {item.pct !== undefined ? (
                      <>
                        <LinearProgress variant="determinate" value={item.pct} sx={{ height: 6, borderRadius: 5, bgcolor: `${item.color}20`, "& .MuiLinearProgress-bar": { bgcolor: item.color } }} />
                        <Typography variant="caption" fontWeight={700} sx={{ color: item.color }}>{item.pct}%</Typography>
                      </>
                    ) : (
                      <Typography variant="caption" fontWeight={700} color="textSecondary">{item.text}</Typography>
                    )}
                  </Box>
                </TrackerCard>
              </Grid>
            ))}
          </Grid>

          {/* QUOTE / GRATITUDE SECTION */}
          <Box sx={{ bgcolor: '#1A2027', borderRadius: '24px', py: 5, px: 4, textAlign: 'center' }}>
            <MenuBookIcon sx={{ color: '#FFA726', fontSize: 28, mb: 1.5 }} />
            <Typography variant="h6" sx={{ color: '#fff', fontStyle: 'italic', fontWeight: 300 }}>
              {d.gratitude?.length > 0 
                ? `"${d.gratitude[d.gratitude.length - 1].text}"` 
                : "Reflection: Take a moment to record one thing you're grateful for today."}
            </Typography>
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}

export default DailyReport;