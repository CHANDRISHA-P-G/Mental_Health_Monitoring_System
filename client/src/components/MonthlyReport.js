import React, { useEffect, useState, useCallback } from "react";
import {
  Grid, Typography, Card, CardContent, CircularProgress,
  Box, Avatar, Stack, LinearProgress
} from "@mui/material";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { styled } from "@mui/material/styles";
import { Line, Doughnut } from "react-chartjs-2";
import axios from "axios";
import dayjs from "dayjs";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

// Icons
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import BedtimeIcon from "@mui/icons-material/Bedtime";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import GroupsIcon from "@mui/icons-material/Groups";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import TimelineIcon from "@mui/icons-material/Timeline";
import AssessmentIcon from "@mui/icons-material/Assessment";

import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, ArcElement, Tooltip, Legend, Filler
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler);

const PASTEL_GREEN = "#A5D6A7";
const PASTEL_YELLOW = "#FFF59D";
const PASTEL_RED = "#EF9A9A";

/* Styled Cards */
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

function MonthlyReport() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [referenceDate, setReferenceDate] = useState(dayjs());
  const [responseDates, setResponseDates] = useState([]);
  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  // ✅ DATE RANGE
  const startDate = referenceDate.subtract(29, 'day').format("DD/MM/YYYY");
  const endDate = referenceDate.format("DD/MM/YYYY");

  // BUILD 30 DAYS
  const build30Days = useCallback((serverData) => {
    let month = [];
    for (let i = 29; i >= 0; i--) {
      const date = referenceDate.subtract(i, "day").startOf("day");
      const found = serverData.find((d) => dayjs(d.date).isSame(date, "day"));

      month.push(found || {
        date: date.toISOString(),
        Morning: [],
        Afternoon: [],
        Night: [],
        hydration: 0,
        sleep: 0,
        exercise: 0,
        socialBattery: 0
      });
    }
    setData(month);
  }, [referenceDate]);

  useEffect(() => {
    const fetchMonthly = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${API_BASE}/responses/monthly?date=${referenceDate.format("YYYY-MM-DD")}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        build30Days(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMonthly();
  }, [referenceDate, build30Days, API_BASE]);

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

  // CALCULATIONS
  const dailyTotals = data.map(day =>
    sessions.reduce((t, s) =>
      t + (day[s]?.reduce((sum, e) => sum + e.score * e.intensity, 0) || 0), 0)
  );

  const avgHydration = data.length ? Math.round(data.reduce((a, c) => a + c.hydration, 0) / data.length) : 0;
  const avgSleep = data.length ? (data.reduce((a, c) => a + c.sleep, 0) / data.length).toFixed(1) : 0;
  const avgExercise = data.length ? Math.round(data.reduce((a, c) => a + c.exercise, 0) / data.length) : 0;
  const avgSocial = data.length ? Math.round(data.reduce((a, c) => a + c.socialBattery, 0) / data.length) : 0;

  let pos = 0, neu = 0, neg = 0;
  data.forEach(d => sessions.forEach(s => d[s]?.forEach(e => {
    const val = Math.abs(e.score * e.intensity);
    if (e.score > 0) pos += val;
    else if (e.score < 0) neg += val;
    else neu += 0.5;
  })));

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

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

        {/* HEADER */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography variant="h3" fontWeight={900}>
            Monthly Summary
          </Typography>

          {/* 🔥 RANGE */}
          <Typography sx={{ mb: 2 }}>
            {startDate} — {endDate}
          </Typography>

          <Box sx={{
            display: 'inline-flex',
            bgcolor: '#fff',
            px: 2,
            py: 0.5,
            borderRadius: '50px'
          }}>
            <DatePicker
              value={referenceDate}
              onChange={(v) => setReferenceDate(v)}
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
            />
          </Box>
        </Box>

        <Box sx={{ width: '100%', maxWidth: '1000px' }}>

          {/* CHARTS */}
          <Grid container spacing={3} sx={{ mb: 6 }}>
            <Grid item xs={12} md={6}>
              <ChartCard>
                <CardContent>
                  <Stack direction="row" spacing={1.5} mb={2}>
                    <Avatar sx={{ bgcolor: '#E8F5E9' }}>
                      <AssessmentIcon sx={{ color: '#4CAF50' }} />
                    </Avatar>
                    <Typography fontWeight={800}>Monthly Distribution</Typography>
                  </Stack>

                  <Box sx={{ height: 320 }}>
                    <Doughnut
                      data={{
                        labels: ["Positive", "Neutral", "Negative"],
                        datasets: [{
                          data: [pos, neu, neg],
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
                              padding: 18,
                              font: { size: 13, weight: "600" }
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
                  <Stack direction="row" spacing={1.5} mb={2}>
                    <Avatar sx={{ bgcolor: '#E3F2FD' }}>
                      <TimelineIcon sx={{ color: '#1E88E5' }} />
                    </Avatar>
                    <Typography fontWeight={800}>Monthly Trend</Typography>
                  </Stack>

                  <Box sx={{ height: 320 }}>
                    <Line
                      data={{
                        labels: data.map(d => dayjs(d.date).format("DD/MM")),
                        datasets: [{
                          data: dailyTotals,
                          borderColor: "#42A5F5",
                          fill: true,
                          tension: 0.4
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

          {/* 4 CARDS */}
          <Grid container spacing={3} justifyContent="center" sx={{ mb: 6 }}>
            {[
              { label: 'HYDRATION', val: `${avgHydration}%`, icon: <WaterDropIcon />, color: '#03A9F4', pct: avgHydration },
              { label: 'SLEEP', val: `${avgSleep}h`, icon: <BedtimeIcon />, color: '#7E57C2', text: "Avg. Rest" },
              { label: 'EXERCISE', val: `${avgExercise}m`, icon: <FitnessCenterIcon />, color: '#26C6DA', text: "Daily Avg" },
              { label: 'SOCIAL', val: `${avgSocial}%`, icon: <GroupsIcon />, color: '#81C784', pct: avgSocial }
            ].map((item, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <TrackerCard>

                  <Avatar sx={{ bgcolor: `${item.color}15`, color: item.color }}>
                    {item.icon}
                  </Avatar>

                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" fontWeight={800}>{item.label}</Typography>
                    <Typography variant="h4" fontWeight={900}>{item.val}</Typography>
                  </Box>

                  {item.pct ? (
                    <>
                      <LinearProgress variant="determinate" value={item.pct} />
                      <Typography variant="caption">{item.pct}%</Typography>
                    </>
                  ) : (
                    <Typography variant="caption">{item.text}</Typography>
                  )}

                </TrackerCard>
              </Grid>
            ))}
          </Grid>

          {/* LAST CARD */}
          <Box sx={{
            bgcolor: '#1A2027',
            borderRadius: '24px',
            py: 5,
            px: 4,
            textAlign: 'center'
          }}>
            <MenuBookIcon sx={{ color: '#FFA726', fontSize: 28, mb: 1.5 }} />
            <Typography variant="h6" sx={{ color: '#fff', fontStyle: 'italic' }}>
              "You're building a strong monthly rhythm. Stay consistent."
            </Typography>
          </Box>

        </Box>
      </Box>
    </LocalizationProvider>
  );
}

export default MonthlyReport;