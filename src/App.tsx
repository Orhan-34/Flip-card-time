import React, { FC } from 'react';
import { TimeProvider } from './context/TimeContext';
import { ThemeProvider } from './context/ThemeContext';
import Clock from './components/Clock';
import { ColorProvider } from './context/ColorContext';
import './App.css';

const App: FC = () => {
  return (
    <ThemeProvider>
      <ColorProvider>
        <TimeProvider>
          <div className="App">
            <Clock />
          </div>
        </TimeProvider>
      </ColorProvider>
    </ThemeProvider>
  );
}

export default App; 