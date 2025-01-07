import React, { useState, useContext, useEffect } from 'react';
import FlipCard from './FlipCard';
import ColorPicker from './ColorPicker';
import { useTime } from '../context/TimeContext';
import { useTheme } from '../context/ThemeContext';
import { BiTime, BiTimer, BiStopwatch, BiUpArrow, BiDownArrow } from 'react-icons/bi';
import '../styles/Clock.css';
import { useColor } from '../context/ColorContext';

const TimerFlipCard = ({ 
  digit, 
  field, 
  position,
  onIncrement, 
  onDecrement 
}: { 
  digit: string, 
  field: 'hours' | 'minutes' | 'seconds',
  position: 'tens' | 'ones',
  onIncrement: () => void,
  onDecrement: () => void 
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <button
        onClick={onIncrement}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px',
          color: 'inherit'
        }}
      >
        <BiUpArrow size={24} />
      </button>
      <FlipCard digit={digit} />
      <button
        onClick={onDecrement}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px',
          color: 'inherit'
        }}
      >
        <BiDownArrow size={24} />
      </button>
    </div>
  );
};

// Ortak buton stilini tanımlayalım
const commonButtonStyle = (isDark: boolean) => ({
  padding: '12px',
  width: '80px',
  height: '80px',
  background: isDark ? 'rgba(45, 45, 45, 0.8)' : 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
  borderRadius: '16px',
  color: isDark ? '#FFFFFF' : '#000000',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  transition: 'all 0.3s ease',
  boxShadow: isDark 
    ? '0 4px 12px rgba(0, 0, 0, 0.3)' 
    : '0 4px 12px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: isDark 
      ? '0 6px 16px rgba(0, 0, 0, 0.4)' 
      : '0 6px 16px rgba(0, 0, 0, 0.15)',
  },
  '&:active': {
    transform: 'translateY(1px)',
  }
});

const controlButtonStyle = (isDark: boolean, isSecondary = false) => ({
  padding: '12px 24px',
  background: isSecondary 
    ? (isDark 
        ? 'rgba(45, 45, 45, 0.8)' 
        : 'rgba(229, 231, 235, 0.8)')
    : (isDark ? '#4A90E2' : '#2563EB'),
  color: isSecondary 
    ? (isDark ? '#FFFFFF' : '#374151')
    : '#FFFFFF',
  border: 'none',
  borderRadius: '12px',
  fontSize: '1rem',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backdropFilter: 'blur(10px)',
  boxShadow: `0 4px 12px ${isSecondary 
    ? (isDark 
        ? 'rgba(0, 0, 0, 0.15)'
        : 'rgba(0, 0, 0, 0.08)')
    : 'rgba(37, 99, 235, 0.3)'}`,
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 6px 16px ${isSecondary 
      ? (isDark 
          ? 'rgba(0, 0, 0, 0.2)'
          : 'rgba(0, 0, 0, 0.12)')
      : 'rgba(37, 99, 235, 0.4)'}`,
  },
  '&:active': {
    transform: 'translateY(1px)',
  }
});

// Deaktif buton stili için yeni bir stil fonksiyonu ekleyelim
const disabledButtonStyle = (isDark: boolean) => ({
  ...controlButtonStyle(isDark, true),
  opacity: 0.5,
  cursor: 'not-allowed',
  transform: 'none',
  background: isDark 
    ? 'rgba(45, 45, 45, 0.8)'
    : 'rgba(229, 231, 235, 0.5)',
  '&:hover': {
    transform: 'none',
    boxShadow: isDark 
      ? '0 4px 12px rgba(0, 0, 0, 0.15)'
      : '0 4px 12px rgba(0, 0, 0, 0.08)',
  },
});

export const Clock = () => {
  const { hour, minute, second, is24Hour, toggle24Hour } = useTime();
  const { isDark, toggleTheme } = useTheme();
  const [showSeconds, setShowSeconds] = useState(true);
  const [showDate, setShowDate] = useState(false);
  const { selectedColor } = useColor();
  const [mode, setMode] = useState<'clock' | 'timer' | 'stopwatch'>('clock');
  const [timerSeconds, setTimerSeconds] = useState(300); // 5 dakika
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timerInput, setTimerInput] = useState({
    hours: '00',
    minutes: '05',
    seconds: '00'
  });

  // Timer için useEffect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (mode === 'timer' && isRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (mode === 'stopwatch' && isRunning) {
      interval = setInterval(() => {
        setStopwatchSeconds(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [mode, isRunning, timerSeconds]);

  // Timer bittiğinde bildirim
  useEffect(() => {
    if (mode === 'timer' && timerSeconds === 0) {
      setIsRunning(false);
    }
  }, [timerSeconds, mode]);

  // mode state'inin değişimini izleyen yeni bir useEffect ekleyelim
  useEffect(() => {
    if (mode !== 'clock') {
      setShowSeconds(true);
    }
  }, [mode]);

  const getCurrentDate = () => {
    const date = new Date();
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Timer ve Stopwatch için sayı formatlama fonksiyonu
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return { hours, minutes, seconds };
  };

  // Timer ve Stopwatch için görüntülenecek zamanı belirle
  const displayTime = () => {
    if (mode === 'clock') {
      return { hours: hour, minutes: minute, seconds: second };
    } else if (mode === 'timer') {
      return formatTime(timerSeconds);
    } else {
      return formatTime(stopwatchSeconds);
    }
  };

  const { hours, minutes, seconds } = displayTime();

  // Timer input değişikliklerini yönetmek için fonksiyonu güncelle
  const handleTimerInputChange = (field: 'hours' | 'minutes' | 'seconds', value: string, position: 'tens' | 'ones') => {
    setTimerInput(prev => {
      let currentValue = parseInt(prev[field]);
      let newValue = currentValue;

      if (position === 'tens') {
        // Onlar basamağı için
        const currentTens = Math.floor(currentValue / 10);
        const currentOnes = currentValue % 10;
        const newTens = parseInt(value);
        newValue = (newTens * 10) + currentOnes;
      } else {
        // Birler basamağı için
        const currentTens = Math.floor(currentValue / 10);
        const newOnes = parseInt(value);
        newValue = (currentTens * 10) + newOnes;
      }

      // Sınırları kontrol et
      if (field === 'hours') {
        newValue = Math.min(99, Math.max(0, newValue));
      } else {
        newValue = Math.min(59, Math.max(0, newValue));
      }

      // Yeni değeri iki basamaklı formata çevir
      const formattedValue = newValue.toString().padStart(2, '0');
      
      const newInput = {
        ...prev,
        [field]: formattedValue
      };
      
      // timerSeconds'ı güncelle
      const totalSeconds = 
        parseInt(newInput.hours) * 3600 + 
        parseInt(newInput.minutes) * 60 + 
        parseInt(newInput.seconds);
      
      setTimerSeconds(totalSeconds);
      
      return newInput;
    });
  };

  // Timer kontrol butonlarını güncelleyelim
  const renderTimerControls = () => {
    if (mode === 'timer') {
      return (
        <div style={{ 
          position: 'fixed',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '16px',
          padding: '20px',
          background: isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)',
          borderRadius: '20px',
          backdropFilter: 'blur(10px)',
          zIndex: 10,
        }}>
          <button
            onClick={() => setIsRunning(!isRunning)}
            style={controlButtonStyle(isDark)}
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={handleReset}
            style={isRunning ? disabledButtonStyle(isDark) : controlButtonStyle(isDark, true)}
          >
            Reset
          </button>
        </div>
      );
    }
    return null;
  };

  // Reset fonksiyonunu güncelleyelim
  const handleReset = () => {
    if (!isRunning) {
      setIsRunning(false);
      setTimerSeconds(0);
      setTimerInput({
        hours: '00',
        minutes: '00',
        seconds: '00'
      });
    }
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
      overflow: 'hidden',
    }}>
      {/* Tarih göstergesini buraya taşıyoruz */}
      {showDate && (
        <div 
          className={`date-display ${isDark ? 'dark' : 'light'}`}
          data-black-selected={selectedColor === '#000000'}
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 10
          }}
        >
          <span className="date-numbers" style={{ color: selectedColor }}>
            {getCurrentDate()}
          </span>
        </div>
      )}

      {/* Arka plan efekti için blur circles */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '15%',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)',
        filter: 'blur(80px)',
        zIndex: 0,
      }} />
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '10%',
        width: '250px',
        height: '250px',
        borderRadius: '50%',
        background: isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.1)',
        filter: 'blur(80px)',
        zIndex: 0,
      }} />
      
      {/* Mevcut içerik */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="clock-container">
          <div className="time-section" style={{ display: 'flex', gap: '8px' }}>
            {mode === 'timer' && !isRunning ? (
              <>
                <TimerFlipCard
                  digit={hours.charAt(0)}
                  field="hours"
                  position="tens"
                  onIncrement={() => {
                    const current = parseInt(timerInput.hours);
                    const tens = Math.floor(current / 10);
                    if (tens < 9) {
                      handleTimerInputChange('hours', (tens + 1).toString(), 'tens');
                    }
                  }}
                  onDecrement={() => {
                    const current = parseInt(timerInput.hours);
                    const tens = Math.floor(current / 10);
                    if (tens > 0) {
                      handleTimerInputChange('hours', (tens - 1).toString(), 'tens');
                    }
                  }}
                />
                <TimerFlipCard
                  digit={hours.charAt(1)}
                  field="hours"
                  position="ones"
                  onIncrement={() => {
                    const current = parseInt(timerInput.hours);
                    const ones = current % 10;
                    if (current < 99) {
                      handleTimerInputChange('hours', (ones + 1).toString(), 'ones');
                    }
                  }}
                  onDecrement={() => {
                    const current = parseInt(timerInput.hours);
                    const ones = current % 10;
                    if (ones > 0) {
                      handleTimerInputChange('hours', (ones - 1).toString(), 'ones');
                    }
                  }}
                />
              </>
            ) : (
              <>
                <FlipCard digit={hours.charAt(0)} />
                <FlipCard digit={hours.charAt(1)} />
              </>
            )}
          </div>
          <span className="colon" style={{ 
            color: isDark ? '#FFFFFF' : '#000000',
            fontSize: '3rem',
            fontWeight: 'bold',
            margin: '0 8px'
          }}>:</span>
          <div className="time-section" style={{ display: 'flex', gap: '8px' }}>
            {mode === 'timer' && !isRunning ? (
              <>
                <TimerFlipCard
                  digit={minutes.charAt(0)}
                  field="minutes"
                  position="tens"
                  onIncrement={() => {
                    const current = parseInt(timerInput.minutes);
                    const tens = Math.floor(current / 10);
                    if (tens < 5) {
                      handleTimerInputChange('minutes', (tens + 1).toString(), 'tens');
                    }
                  }}
                  onDecrement={() => {
                    const current = parseInt(timerInput.minutes);
                    const tens = Math.floor(current / 10);
                    if (tens > 0) {
                      handleTimerInputChange('minutes', (tens - 1).toString(), 'tens');
                    }
                  }}
                />
                <TimerFlipCard
                  digit={minutes.charAt(1)}
                  field="minutes"
                  position="ones"
                  onIncrement={() => {
                    const current = parseInt(timerInput.minutes);
                    const ones = current % 10;
                    if (current < 59) {
                      handleTimerInputChange('minutes', (ones + 1).toString(), 'ones');
                    }
                  }}
                  onDecrement={() => {
                    const current = parseInt(timerInput.minutes);
                    const ones = current % 10;
                    if (ones > 0) {
                      handleTimerInputChange('minutes', (ones - 1).toString(), 'ones');
                    }
                  }}
                />
              </>
            ) : (
              <>
                <FlipCard digit={minutes.charAt(0)} />
                <FlipCard digit={minutes.charAt(1)} />
              </>
            )}
          </div>
          {showSeconds && (
            <>
              <span className="colon" style={{ 
                color: isDark ? '#FFFFFF' : '#000000',
                fontSize: '3rem',
                fontWeight: 'bold',
                margin: '0 8px'
              }}>:</span>
              <div className="time-section" style={{ display: 'flex', gap: '8px' }}>
                {mode === 'timer' && !isRunning ? (
                  <>
                    <TimerFlipCard
                      digit={seconds.charAt(0)}
                      field="seconds"
                      position="tens"
                      onIncrement={() => {
                        const current = parseInt(timerInput.seconds);
                        const tens = Math.floor(current / 10);
                        if (tens < 5) {
                          handleTimerInputChange('seconds', (tens + 1).toString(), 'tens');
                        }
                      }}
                      onDecrement={() => {
                        const current = parseInt(timerInput.seconds);
                        const tens = Math.floor(current / 10);
                        if (tens > 0) {
                          handleTimerInputChange('seconds', (tens - 1).toString(), 'tens');
                        }
                      }}
                    />
                    <TimerFlipCard
                      digit={seconds.charAt(1)}
                      field="seconds"
                      position="ones"
                      onIncrement={() => {
                        const current = parseInt(timerInput.seconds);
                        const ones = current % 10;
                        if (current < 59) {
                          handleTimerInputChange('seconds', (ones + 1).toString(), 'ones');
                        }
                      }}
                      onDecrement={() => {
                        const current = parseInt(timerInput.seconds);
                        const ones = current % 10;
                        if (ones > 0) {
                          handleTimerInputChange('seconds', (ones - 1).toString(), 'ones');
                        }
                      }}
                    />
                  </>
                ) : (
                  <>
                    <FlipCard digit={seconds.charAt(0)} />
                    <FlipCard digit={seconds.charAt(1)} />
                  </>
                )}
              </div>
            </>
          )}
        </div>
        
        <div style={{ 
          position: 'fixed',
          left: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '50px'
        }}>
          <button
            className={`time-toggle-btn ${isDark ? 'dark' : 'light'}`}
            onClick={toggle24Hour}
            style={{
              ...commonButtonStyle(isDark),
              position: 'relative',
            }}
          >
            <div style={{
              fontSize: '1.5rem',
              marginBottom: '4px'
            }}>
              <BiTime size={28} />
            </div>
            <span style={{ 
              fontSize: '0.9rem',
              fontWeight: '500',
              letterSpacing: '0.5px'
            }}>
              {is24Hour ? '12H' : '24H'}
            </span>
          </button>
          
          <button
            className={`time-toggle-btn ${isDark ? 'dark' : 'light'}`}
            onClick={toggleTheme}
            style={{
              ...commonButtonStyle(isDark),
              position: 'relative',
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>{isDark ? '☀️' : '🌙'}</span>
            <span style={{ fontSize: '0.8rem' }}>{isDark ? 'Light' : 'Dark'}</span>
          </button>

          <button
            className={`time-toggle-btn ${isDark ? 'dark' : 'light'} ${mode !== 'clock' ? 'disabled-button' : ''}`}
            onClick={() => mode === 'clock' && setShowSeconds(!showSeconds)}
            style={{
              ...commonButtonStyle(isDark),
              position: 'relative',
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>⏱️</span>
            <span style={{ fontSize: '0.8rem' }}>{showSeconds ? 'Hide Sec' : 'Show Sec'}</span>
            {mode !== 'clock' && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0, 0, 0, 0.1)',
                borderRadius: '4px',
                overflow: 'hidden',
              }}>
                <span style={{
                  color: '#FF0000',
                  fontSize: '1.2rem',
                  fontWeight: '100',
                  position: 'absolute',
                  width: '150%',
                  height: '2px',
                  background: '#FF0000',
                  transform: 'rotate(-35deg)',
                  transformOrigin: 'center',
                }}/>
              </div>
            )}
          </button>

          <button
            className={`time-toggle-btn ${isDark ? 'dark' : 'light'}`}
            onClick={() => setShowDate(!showDate)}
            style={{
              ...commonButtonStyle(isDark),
              position: 'relative',
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>📅</span>
            <span style={{ fontSize: '0.8rem' }}>{showDate ? 'Hide Date' : 'Show Date'}</span>
          </button>

          <button
            className={`time-toggle-btn ${isDark ? 'dark' : 'light'}`}
            onClick={() => {
              if (mode === 'timer') {
                setMode('clock');
              } else {
                setMode('timer');
                setShowSeconds(true);
              }
            }}
            style={{
              ...commonButtonStyle(isDark),
              position: 'relative',
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>⏳</span>
            <span style={{ fontSize: '0.8rem' }}>{mode === 'timer' ? 'Clock' : 'Timer'}</span>
          </button>

          <button
            className={`time-toggle-btn ${isDark ? 'dark' : 'light'}`}
            onClick={() => {
              if (mode === 'stopwatch') {
                setMode('clock');
              } else {
                setMode('stopwatch');
                setShowSeconds(true);
              }
            }}
            style={{
              ...commonButtonStyle(isDark),
              position: 'relative',
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>⏱️</span>
            <span style={{ fontSize: '0.8rem' }}>{mode === 'stopwatch' ? 'Clock' : 'Stopwatch'}</span>
          </button>
        </div>

        {renderTimerControls()}
        {mode === 'stopwatch' && (
          <div style={{ 
            position: 'fixed',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex', 
            gap: '16px',
            padding: '20px',
            background: isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)',
            borderRadius: '20px',
            backdropFilter: 'blur(10px)',
            zIndex: 10,
          }}>
            <button
              onClick={() => setIsRunning(!isRunning)}
              style={controlButtonStyle(isDark)}
            >
              {isRunning ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={() => {
                if (!isRunning) {  // Sadece çalışmıyorken reset'e izin ver
                  setIsRunning(false);
                  setStopwatchSeconds(0);
                }
              }}
              style={isRunning ? disabledButtonStyle(isDark) : controlButtonStyle(isDark, true)}
            >
              Reset
            </button>
          </div>
        )}

        <div style={{
          position: 'fixed',
          right: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <ColorPicker />
        </div>
      </div>
    </div>
  );
}; 