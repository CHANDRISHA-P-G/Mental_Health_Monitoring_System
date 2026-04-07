import React, { useState } from "react";
import { Container, TextField, Button, Typography, Paper, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);

      // 1. Save the Token for API calls
      localStorage.setItem("token", res.data.token);

      // 2. SMART NAME PICKER: 
      // This checks the most common paths where backends store the name.
      const detectedName = 
        res.data.username || 
        (res.data.user && res.data.user.name) || 
        res.data.name || 
        "User";

      localStorage.setItem("username", detectedName);

      alert("Login successful ✅");
      navigate("/");
    } catch (err) {
      alert("Invalid credentials ❌");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 10 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" align="center" gutterBottom fontWeight="bold">Login</Typography>
        <TextField fullWidth label="Email" name="email" margin="normal" onChange={handleChange} />
        <TextField fullWidth type="password" label="Password" name="password" margin="normal" onChange={handleChange} />
        <Button fullWidth variant="contained" sx={{ mt: 3, py: 1.5 }} onClick={handleSubmit}>Login</Button>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button onClick={() => navigate("/signup")}>Don't have an account? Signup</Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;