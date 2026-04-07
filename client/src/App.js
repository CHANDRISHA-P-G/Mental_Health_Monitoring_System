import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import Home from "./components/Home";
import Test from "./components/Test";
import Dashboard from "./components/Dashboard";
import DailyReport from "./components/DailyReport";
import WeeklyReport from "./components/WeeklyReport";
import MonthlyReport from "./components/MonthlyReport";
import YearlyReport from "./components/YearlyReport";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Hydration from "./components/Hydration";
import Sleep from "./components/Sleep";
import Exercise from "./components/Exercise";
import SocialBattery from "./components/SocialBattery";
import GratitudeJar from "./components/GratitudeJar";
import Pomodoro from "./components/Pomodoro";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes (NO NAVBAR) */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ================= MAIN APP WITH NAVBAR ================= */}
        <Route path="/" element={<Layout />}>
          {/* Home - Wellness Hub (default/index) */}
          <Route index element={<Home />} />

          {/* Feature Routes */}
          <Route path="test" element={<Test />} />
          <Route path="water" element={<Hydration />} />
          <Route path="sleep" element={<Sleep />} />
          <Route path="exercise" element={<Exercise />} />
          <Route path="mood-check" element={<SocialBattery />} />
          <Route path="gratitude-jar" element={<GratitudeJar />} />
          <Route path="pomodoro" element={<Pomodoro />} />

          {/* Dashboard */}
          <Route path="dashboard" element={<Dashboard />}>
            <Route index element={<DailyReport />} />
            <Route path="weekly" element={<WeeklyReport />} />
            <Route path="monthly" element={<MonthlyReport />} />
            <Route path="yearly" element={<YearlyReport />} />
          </Route>
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
