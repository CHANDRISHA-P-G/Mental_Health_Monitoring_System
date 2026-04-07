import React, { useState, useEffect } from "react";
import { 
  Box, Typography, IconButton, Stack, Button, 
  CircularProgress, Slider, Divider, Dialog, Zoom 
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ReplayIcon from '@mui/icons-material/Replay';
import TimerIcon from '@mui/icons-material/Timer';

// 1. CONSTANTS MOVED OUTSIDE TO AVOID ESLINT DEPENDENCY ISSUES
const FOCUS_COLOR = "#EF5350";
const BREAK_COLOR = "#66BB6A";
const FOCUS_DURATION = 25 * 60; // 1500 seconds
const BREAK_DURATION = 5 * 60;  // 300 seconds

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Zoom ref={ref} {...props} />;
});

function Pomodoro({ open, handleClose }) {
  const [totalGoalMinutes, setTotalGoalMinutes] = useState(60); 
  const [isStarted, setIsStarted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_DURATION);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionCount, setSessionCount] = useState(1);

  // Calculate progress based on current mode
  const currentMax = isBreak ? BREAK_DURATION : FOCUS_DURATION;
  const progress = ((currentMax - secondsLeft) / currentMax) * 100;

  useEffect(() => {
    let interval = null;

    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      // Auto-switch modes when timer hits zero
      const nextMode = !isBreak;
      setIsBreak(nextMode);
      setSecondsLeft(nextMode ? BREAK_DURATION : FOCUS_DURATION);
      
      if (!nextMode) {
        setSessionCount(prev => prev + 1);
      }
      
      // Sound or Notification could be triggered here
    }

    return () => clearInterval(interval);
  }, [isActive, secondsLeft, isBreak]); // ESLINT Warning resolved

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleReset = () => {
    setIsStarted(false);
    setIsActive(false);
    setIsBreak(false);
    setSecondsLeft(FOCUS_DURATION);
    setSessionCount(1);
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: "28px", p: 1, overflow: "hidden" }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, pt: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
          <TimerIcon sx={{ color: isBreak ? BREAK_COLOR : FOCUS_COLOR }} /> Focus Flow
        </Typography>
        <IconButton onClick={handleClose} size="small"><CloseIcon /></IconButton>
      </Box>

      {!isStarted ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ color: FOCUS_COLOR, fontWeight: 900, mb: 1 }}>
            {totalGoalMinutes} <span style={{ fontSize: '1rem' }}>mins</span>
          </Typography>
          <Slider 
            value={totalGoalMinutes} min={25} max={240} step={5}
            onChange={(e, val) => setTotalGoalMinutes(val)}
            sx={{ color: FOCUS_COLOR, width: '90%', mb: 2 }}
          />
          <Stack direction="row" spacing={2} sx={{ bgcolor: '#F5F5F5', p: 2, borderRadius: '12px', mb: 3 }}>
            <Box sx={{ flex: 1 }}>
                <Typography variant="caption" display="block">Focus Blocks</Typography>
                <Typography variant="subtitle2" fontWeight={700}>{Math.ceil(totalGoalMinutes / 25)}</Typography>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box sx={{ flex: 1 }}>
                <Typography variant="caption" display="block">Breaks</Typography>
                <Typography variant="subtitle2" fontWeight={700}>{Math.floor(totalGoalMinutes / 25) * 5}m</Typography>
            </Box>
          </Stack>
          <Button 
            fullWidth variant="contained" 
            onClick={() => { setIsStarted(true); setIsActive(true); }}
            sx={{ bgcolor: FOCUS_COLOR, borderRadius: '12px', py: 1.5, fontWeight: 800, "&:hover": { bgcolor: '#D32F2F' }}}
          >
            Start Session
          </Button>
        </Box>
      ) : (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Box sx={{ position: 'relative', display: 'inline-flex', mb: 3 }}>
            <CircularProgress variant="determinate" value={100} size={200} thickness={2} sx={{ color: '#F0F0F0' }} />
            <CircularProgress 
              variant="determinate" value={progress} size={200} thickness={2} 
              sx={{ 
                color: isBreak ? BREAK_COLOR : FOCUS_COLOR, 
                position: 'absolute', 
                left: 0, 
                strokeLinecap: 'round', 
                transition: 'stroke-dashoffset 0.5s ease' 
              }} 
            />
            <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 800, fontFamily: 'monospace' }}>{formatTime(secondsLeft)}</Typography>
              <Typography variant="caption" sx={{ color: isBreak ? BREAK_COLOR : FOCUS_COLOR, fontWeight: 800 }}>{isBreak ? "REST" : "FOCUSING"}</Typography>
            </Box>
          </Box>

          <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ mb: 3 }}>
             <IconButton onClick={handleReset} size="small" sx={{ border: '1px solid #EEE' }}><ReplayIcon /></IconButton>
             <Button 
                variant="contained" 
                onClick={() => setIsActive(!isActive)}
                sx={{ 
                  width: 64, height: 64, borderRadius: '50%', 
                  bgcolor: isBreak ? BREAK_COLOR : FOCUS_COLOR, 
                  "&:hover": { bgcolor: isBreak ? "#4CAF50" : "#D32F2F" }
                }}
             >
                {isActive ? <PauseIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" />}
             </Button>
             <Box sx={{ width: 40 }} />
          </Stack>

          <Box sx={{ p: 1.5, bgcolor: '#F9F9F9', borderRadius: '16px' }}>
            <Stack direction="row" spacing={0.5} justifyContent="center">
              {[...Array(Math.ceil(totalGoalMinutes / 25))].map((_, i) => (
                <Box 
                  key={i} 
                  sx={{ 
                    width: 15, height: 6, borderRadius: '4px', 
                    bgcolor: i + 1 < sessionCount ? FOCUS_COLOR : (i + 1 === sessionCount ? `${FOCUS_COLOR}40` : '#DDD') 
                  }} 
                />
              ))}
            </Stack>
            <Typography variant="caption" sx={{ mt: 1, display: 'block', fontWeight: 700, color: '#777' }}>
                Session {sessionCount} of {Math.ceil(totalGoalMinutes / 25)}
            </Typography>
          </Box>
        </Box>
      )}
    </Dialog>
  );
}

export default Pomodoro;