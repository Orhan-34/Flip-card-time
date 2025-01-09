import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useColor } from '../context/ColorContext';
import { useNavigate, Link } from 'react-router-dom';
import FlipCard from './FlipCard';

interface TimerState {
  timeLeft: number;
  breakTimeLeft: number;
  timestamp: number;
}

export const Pomodoro = () => {
  const { isDark } = useTheme();
  const { selectedColor } = useColor();
  const navigate = useNavigate();

  // LocalStorage'dan değerleri al veya varsayılan değerleri kullan
  const getInitialTimerState = () => {
    const savedState = localStorage.getItem('pomodoroState');
    if (savedState) {
      const parsedState: TimerState = JSON.parse(savedState);
      const currentTime = new Date().getTime();
      const thirtyMinutes = 30 * 60 * 1000; // 30 dakika

      // Eğer 30 dakikadan fazla zaman geçtiyse, varsayılan değerleri kullan
      if (currentTime - parsedState.timestamp > thirtyMinutes) {
        localStorage.removeItem('pomodoroState');
        return {
          timeLeft: 25 * 60,
          breakTimeLeft: 5 * 60
        };
      }
      return {
        timeLeft: parsedState.timeLeft,
        breakTimeLeft: parsedState.breakTimeLeft
      };
    }
    return {
      timeLeft: 25 * 60,
      breakTimeLeft: 5 * 60
    };
  };

  const initialState = getInitialTimerState();
  const [timeLeft, setTimeLeft] = useState(initialState.timeLeft);
  const [breakTimeLeft, setBreakTimeLeft] = useState(initialState.breakTimeLeft);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [isBreakCardActive, setIsBreakCardActive] = useState(false);

  // Değerleri LocalStorage'a kaydet
  useEffect(() => {
    const timerState: TimerState = {
      timeLeft,
      breakTimeLeft,
      timestamp: new Date().getTime()
    };
    localStorage.setItem('pomodoroState', JSON.stringify(timerState));
  }, [timeLeft, breakTimeLeft]);

  // Component unmount olduğunda değerleri kaydet
  useEffect(() => {
    return () => {
      const timerState: TimerState = {
        timeLeft,
        breakTimeLeft,
        timestamp: new Date().getTime()
      };
      localStorage.setItem('pomodoroState', JSON.stringify(timerState));
    };
  }, [timeLeft, breakTimeLeft]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        if (isBreak) {
          setBreakTimeLeft(prev => prev - 1);
        } else {
          setTimeLeft(prev => prev - 1);
        }
      }, 1000);
    } else if ((isBreak && breakTimeLeft === 0) || (!isBreak && timeLeft === 0)) {
      // Pomodoro veya mola süresi bittiğinde
      if (isBreak) {
        setTimeLeft(25 * 60); // Pomodoro süresine geri dön
        setBreakTimeLeft(5 * 60); // Mola süresini resetle
      } else {
        setBreakTimeLeft(5 * 60); // Mola süresine geç
      }
      setIsBreak(!isBreak);
      setIsRunning(false);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, timeLeft, breakTimeLeft, isBreak]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const remainingMinutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: remainingMinutes.toString().padStart(2, '0'),
      seconds: remainingSeconds.toString().padStart(2, '0')
    };
  };

  const formattedFocusTime = formatTime(timeLeft);
  const formattedBreakTime = formatTime(breakTimeLeft);

  const controlButtonStyle = {
    padding: '12px 24px',
    background: isDark ? '#22c55e' : '#16a34a',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
  };

  const presetButtonStyle = {
    ...controlButtonStyle,
    padding: '12px 24px',
    fontSize: '1.1rem',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '4px',
    minWidth: '80px',
    position: 'relative' as const,
    overflow: 'hidden',
    background: isDark ? 'rgba(34, 197, 94, 0.15)' : 'rgba(22, 163, 74, 0.15)',
    border: `2px solid ${isDark ? 'rgba(34, 197, 94, 0.3)' : 'rgba(22, 163, 74, 0.3)'}`,
    color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
    transform: 'translateY(0)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: `0 4px 12px ${isDark ? 'rgba(34, 197, 94, 0.2)' : 'rgba(22, 163, 74, 0.2)'}`,
  };

  const activePresetStyle = {
    ...presetButtonStyle,
    background: isDark ? '#22c55e' : '#16a34a',
    border: `2px solid ${isDark ? '#22c55e' : '#16a34a'}`,
    color: '#FFFFFF',
    boxShadow: `0 4px 12px ${isDark ? 'rgba(34, 197, 94, 0.4)' : 'rgba(22, 163, 74, 0.4)'}`,
  };

  const handlePresetClick = (minutes: number) => {
    if (isBreakCardActive) {
      setBreakTimeLeft(minutes * 60);
    } else {
      setTimeLeft(minutes * 60);
    }
    setIsRunning(false);
    
    // Preset değerleri LocalStorage'a kaydet
    const timerState: TimerState = {
      timeLeft: isBreakCardActive ? timeLeft : minutes * 60,
      breakTimeLeft: isBreakCardActive ? minutes * 60 : breakTimeLeft,
      timestamp: new Date().getTime()
    };
    localStorage.setItem('pomodoroState', JSON.stringify(timerState));
  };

  const handleCardClick = () => {
    setIsBreakCardActive(!isBreakCardActive);
    setIsBreak(!isBreakCardActive);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: isDark 
        ? 'linear-gradient(135deg, rgb(17, 24, 39) 0%, rgb(9, 14, 24) 100%)'
        : 'linear-gradient(135deg, rgb(249, 250, 251) 0%, rgb(240, 242, 245) 100%)',
      color: isDark ? '#FFFFFF' : '#000000',
      transition: 'background 0.3s',
      position: 'relative',
    }}>
      <Link 
        to="/" 
        style={{
          position: 'absolute',
          left: '20px',
          top: '20px',
          textDecoration: 'none',
          padding: '12px 24px',
          background: isDark ? 'rgba(38, 38, 38, 0.9)' : 'rgba(0, 0, 0, 0.9)',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '12px',
          fontSize: '1rem',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          transform: 'translateX(0)',
          zIndex: 60
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateX(5px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateX(0)';
        }}
      >
        Back to Clock
      </Link>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: '12px 0',
        display: 'flex',
        justifyContent: 'center',
        background: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
        overflowX: 'auto',
        zIndex: 50,
      }}>
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          padding: '0 20px',
          minWidth: 'min-content',
        }}>
          {[5, 15, 25, 30, 45, 60, 75, 90].map((mins) => (
            <button
              key={mins}
              onClick={() => handlePresetClick(mins)}
              style={{
                ...(isBreakCardActive
                  ? breakTimeLeft === mins * 60 
                  : timeLeft === mins * 60) 
                    ? activePresetStyle 
                    : presetButtonStyle,
                padding: '8px 16px',
                minWidth: '70px',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 6px 16px ${
                  isDark ? 'rgba(34, 197, 94, 0.3)' : 'rgba(22, 163, 74, 0.3)'
                }`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `0 4px 12px ${
                  isDark ? 'rgba(34, 197, 94, 0.2)' : 'rgba(22, 163, 74, 0.2)'
                }`;
              }}
            >
              {mins}
              <span style={{ fontSize: '0.8rem' }}>min</span>
            </button>
          ))}
        </div>
      </div>
      <div 
        onClick={!isBreakCardActive ? handleCardClick : undefined}
        onMouseEnter={(e) => {
          if (!isBreakCardActive) {
            e.currentTarget.style.border = isDark 
              ? '2px solid rgba(34, 197, 94, 0.5)'
              : '2px solid rgba(22, 163, 74, 0.5)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isBreakCardActive) {
            e.currentTarget.style.border = '2px solid transparent';
          }
        }}
        style={{ 
          position: 'absolute',
          right: isBreakCardActive 
            ? '50%' 
            : (breakTimeLeft >= 3600 ? '-30px' : '20px'),
          top: isBreakCardActive 
            ? (breakTimeLeft >= 3600 ? '55%' : '50%')
            : '120px',
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          padding: '4px 6px',
          borderRadius: '10px',
          background: isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          opacity: isBreakCardActive ? 1 : 0.7,
          transform: isBreakCardActive 
            ? `translate(calc(50% - 65px), -50%) scale(1)`
            : 'scale(0.5, 0.65)',
          transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), border 0.2s ease',
          zIndex: isBreakCardActive ? 20 : 10,
          cursor: isBreakCardActive ? 'pointer' : 'default',
          border: '2px solid transparent',
          boxSizing: 'border-box',
          marginBottom: !isBreakCardActive && breakTimeLeft >= 3600 ? '20px' : '0',
        }}>
        <h2 style={{ 
          color: selectedColor,
          fontSize: '1.8rem',
          marginBottom: '0.125rem',
          lineHeight: '1',
          fontWeight: '600',
          letterSpacing: '0.5px',
        }}>
          Break Time
        </h2>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1px',
          transform: 'scale(0.8)',
          marginTop: '-4px',
        }}>
          {breakTimeLeft >= 3600 && (
            <>
              <FlipCard digit={formattedBreakTime.hours.charAt(0)} />
              <FlipCard digit={formattedBreakTime.hours.charAt(1)} />
              <span>:</span>
            </>
          )}
          <FlipCard digit={formattedBreakTime.minutes.charAt(0)} />
          <FlipCard digit={formattedBreakTime.minutes.charAt(1)} />
          <span>:</span>
          <FlipCard digit={formattedBreakTime.seconds.charAt(0)} />
          <FlipCard digit={formattedBreakTime.seconds.charAt(1)} />
        </div>
      </div>
      <div 
        onClick={isBreakCardActive ? handleCardClick : undefined}
        style={{
          position: 'absolute',
          right: isBreakCardActive 
            ? (timeLeft >= 3600 ? '-30px' : '20px')
            : '50%',
          top: isBreakCardActive 
            ? '120px'
            : (timeLeft >= 3600 ? '55%' : '50%'),
          marginBottom: '80px',
          opacity: isBreakCardActive ? 0.7 : 1,
          transform: isBreakCardActive 
            ? 'scale(0.5, 0.65)' 
            : `translate(calc(50% - 65px), -50%) scale(1)`,
          transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), border 0.2s ease',
          zIndex: isBreakCardActive ? 10 : 20,
          cursor: isBreakCardActive ? 'pointer' : 'default',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '4px 6px',
          borderRadius: '10px',
          background: isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          border: '2px solid transparent',
          boxSizing: 'border-box',
        }}>
        <h2 style={{ 
          color: selectedColor,
          fontSize: '2rem',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          Focus Time
        </h2>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          transform: isBreakCardActive 
            ? 'scale(0.9)' 
            : (!isBreakCardActive && !isBreak)
              ? 'scale(0.8)' 
              : 'scale(1)',
          transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
          {timeLeft >= 3600 && (
            <>
              <FlipCard digit={formattedFocusTime.hours.charAt(0)} />
              <FlipCard digit={formattedFocusTime.hours.charAt(1)} />
              <span>:</span>
            </>
          )}
          <FlipCard digit={formattedFocusTime.minutes.charAt(0)} />
          <FlipCard digit={formattedFocusTime.minutes.charAt(1)} />
          <span>:</span>
          <FlipCard digit={formattedFocusTime.seconds.charAt(0)} />
          <FlipCard digit={formattedFocusTime.seconds.charAt(1)} />
        </div>
      </div>
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '1rem',
        zIndex: 30,
      }}>
        <button
          onClick={() => setIsRunning(!isRunning)}
          style={controlButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(34, 197, 94, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.3)';
          }}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={() => {
            if (!isRunning) {
              if (isBreakCardActive) {
                setBreakTimeLeft(5 * 60);
              } else {
                setTimeLeft(25 * 60);
              }
            }
          }}
          disabled={isRunning}
          style={{
            ...controlButtonStyle,
            background: isDark ? 'rgba(34, 197, 94, 0.15)' : 'rgba(22, 163, 74, 0.15)',
            border: `2px solid ${isDark ? 'rgba(34, 197, 94, 0.3)' : 'rgba(22, 163, 74, 0.3)'}`,
            color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
            opacity: isRunning ? 0.5 : 1,
            cursor: isRunning ? 'not-allowed' : 'pointer',
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}; 