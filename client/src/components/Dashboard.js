import React from "react";
import { Tabs, Tab, Box } from "@mui/material";
import { useNavigate, Outlet, useLocation } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentTab = () => {
    if (location.pathname.includes("weekly")) return 1;
    if (location.pathname.includes("monthly")) return 2;
    if (location.pathname.includes("yearly")) return 3;
    return 0;
  };

  const handleChange = (event, newValue) => {
    if (newValue === 0) navigate("/dashboard");
    if (newValue === 1) navigate("/dashboard/weekly");
    if (newValue === 2) navigate("/dashboard/monthly");
    if (newValue === 3) navigate("/dashboard/yearly");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>

      <Tabs
        value={getCurrentTab()}
        onChange={handleChange}
        centered
        sx={{ mt: 2 }}
      >
        <Tab label="Daily" />
        <Tab label="Weekly" />
        <Tab label="Monthly" />
        <Tab label="Yearly" />
      </Tabs>

      <Box sx={{ p: 3, width: "100%", maxWidth: 800 }}>
        <Outlet />
      </Box>

    </Box>
  );
}

export default Dashboard;