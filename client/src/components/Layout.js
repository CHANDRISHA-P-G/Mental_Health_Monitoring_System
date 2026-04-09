import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
  Button,
  Fade,
  Divider
} from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import HomeIcon from "@mui/icons-material/Home";
import TimerIcon from "@mui/icons-material/Timer";
import InsightsIcon from '@mui/icons-material/Insights';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import Pomodoro from "./Pomodoro"; 
const API_BASE = process.env.REACT_APP_API_URL || "https://mental-health-monitoring-system-pnuu.onrender.com";
function Layout() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [username, setUsername] = useState("User");
  const [pomoOpen, setPomoOpen] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const res = await axios.get(`${API_BASE}/api/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` },
      });
        setUsername(res.data.name || "User");
      } catch (err) {
        console.error("Failed to fetch user profile:", err.message);
        setUsername("User");
      }
    };
    fetchUserProfile();
  }, [navigate]);

  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const PRIMARY_BLUE = "#8DE0F7";
  const TEXT_DARK = "#1A2027";

  return (
    <Box sx={{ flexGrow: 1, minHeight: "100vh", bgcolor: "#F0F4F8" }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(12px)",
          color: TEXT_DARK,
          borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.03)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", py: 1, px: { md: 5 } }}>
          
          {/* Logo with Bounce Interaction */}
          <Box 
            onClick={() => navigate("/")} 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
              gap: 1.5,
              transition: "transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              "&:hover": { transform: "scale(1.05)" },
              "&:active": { transform: "scale(0.95)" }
            }}
          >
            <Box sx={{ 
              width: 40, height: 40, bgcolor: PRIMARY_BLUE, borderRadius: '12px', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 8px 20px ${PRIMARY_BLUE}60`,
            }}>
              <HomeIcon sx={{ color: '#fff', fontSize: 24 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 900, color: TEXT_DARK, letterSpacing: -1 }}>
              Clear <span style={{ color: PRIMARY_BLUE }}>Sky</span>
            </Typography>
          </Box>

          {/* Action Center */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            
            {/* INTERACTIVE DASHBOARD BUTTON */}
            <Button
              onClick={() => navigate("/dashboard")}
              startIcon={<InsightsIcon />}
              sx={{
                display: { xs: 'none', sm: 'flex' },
                borderRadius: '16px',
                textTransform: 'none',
                fontWeight: 800,
                color: '#fff',
                bgcolor: TEXT_DARK,
                px: 3,
                py: 1,
                boxShadow: "0 10px 20px rgba(26, 32, 39, 0.2)",
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                "&:hover": {
                  bgcolor: "#2C3E50",
                  transform: 'translateY(-4px)',
                  boxShadow: "0 15px 30px rgba(26, 32, 39, 0.3)",
                },
                "&:active": { transform: 'translateY(0px)' }
              }}
            >
              Dashboard
            </Button>

            {/* INTERACTIVE POMODORO */}
            <Tooltip title="Focus Timer">
              <IconButton
                onClick={() => setPomoOpen(true)}
                sx={{ 
                  bgcolor: "#fff", 
                  color: TEXT_DARK, 
                  width: 48, height: 48,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  transition: "all 0.2s",
                  "&:hover": { 
                    bgcolor: PRIMARY_BLUE, 
                    color: "#fff",
                    transform: "rotate(15deg) scale(1.1)",
                    boxShadow: `0 8px 20px ${PRIMARY_BLUE}40`
                  } 
                }}
              >
                <TimerIcon />
              </IconButton>
            </Tooltip>

            <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 30, alignSelf: 'center' }} />

            {/* INTERACTIVE USER AVATAR */}
            <Box 
                onClick={handleOpenMenu}
                sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 1.5, 
                    cursor: 'pointer',
                    p: 0.5,
                    pr: 2,
                    borderRadius: '50px',
                    transition: '0.2s',
                    "&:hover": { bgcolor: "rgba(0,0,0,0.03)" }
                }}
            >
              <Avatar 
                sx={{ 
                  bgcolor: PRIMARY_BLUE, 
                  width: 40, height: 40, 
                  fontWeight: 900,
                  boxShadow: `0 4px 15px ${PRIMARY_BLUE}50`,
                  transition: '0.3s',
                  border: '2px solid #fff'
                }}
              >
                {username.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="body2" sx={{ display: { xs: 'none', md: 'block' }, color: TEXT_DARK, fontWeight: 800 }}>
                {username}
              </Typography>
            </Box>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
              TransitionComponent={Fade}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              PaperProps={{
                elevation: 0,
                sx: {
                  mt: 2,
                  minWidth: 220,
                  borderRadius: '24px',
                  border: '1px solid rgba(0,0,0,0.05)',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                  p: 1,
                  overflow: 'visible',
                  '&:before': { // The little arrow on top of the menu
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 24,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                }
              }}
            >
              <MenuItem onClick={() => { navigate("/profile"); handleCloseMenu(); }} sx={{ borderRadius: '14px', py: 1.5, mb: 0.5, "&:hover": { bgcolor: `${PRIMARY_BLUE}15` } }}>
                <PersonOutlineIcon sx={{ mr: 2, color: TEXT_DARK }} />
                <Typography fontWeight={700}>Profile Settings</Typography>
              </MenuItem>
              
              <MenuItem onClick={handleLogout} sx={{ borderRadius: '14px', py: 1.5, color: '#EF4444', "&:hover": { bgcolor: '#FEE2E2' } }}>
                <LogoutIcon sx={{ mr: 2 }} />
                <Typography fontWeight={700}>Sign Out</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Content Area */}
      <Box sx={{ p: { xs: 2, md: 5 }, maxWidth: '1400px', mx: 'auto' }}>
        <Outlet />
      </Box>

      <Pomodoro open={pomoOpen} handleClose={() => setPomoOpen(false)} />
    </Box>
  );
}

export default Layout;