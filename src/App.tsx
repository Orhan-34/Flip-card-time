import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Clock } from './components/Clock';
import { Pomodoro } from './components/Pomodoro';
import { ThemeProvider } from './context/ThemeContext';
import { TimeProvider } from './context/TimeContext';
import { ColorProvider } from './context/ColorContext';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <TimeProvider>
          <ColorProvider>
            <Routes>
              <Route path="/" element={<Clock />} />
              <Route path="/pomodoro" element={<Pomodoro />} />
            </Routes>
          </ColorProvider>
        </TimeProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App; 