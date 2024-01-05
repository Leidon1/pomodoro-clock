import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timerLabel, setTimerLabel] = useState("Session");
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60);
  const [isRunning, setIsRunning] = useState(false);
  const audioElement = document.getElementById(
    "beep"
  ) as HTMLAudioElement | null;

  useEffect(() => {
    if (timeLeft === 0) {
      // Timer has reached zero, play the "beep" sound
      if (audioElement) {
        audioElement.play();
      }
    }
  }, [timeLeft, audioElement]);

  let timer: NodeJS.Timeout | null = null; // Declare timer variable

  useEffect(() => {
    if (isRunning && timer === null) {
      // Initialize the timer only if it's not already running
      timer = setInterval(() => {
        if (timeLeft > 0) {
          setTimeLeft(timeLeft - 1);
        } else {
          // Timer reached 00:00, switch to break or session
          if (timerLabel === "Session") {
            setTimerLabel("Break");
            setTimeLeft(breakLength * 60);
          } else {
            setTimerLabel("Session");
            setTimeLeft(sessionLength * 60);
          }
        }
      }, 1000);
    } else if (!isRunning && timer !== null) {
      // Clear the timer if it's running and the user stops it
      clearInterval(timer);
      timer = null;
    }

    return () => {
      // Cleanup function to clear the timer on unmount
      if (timer !== null) {
        clearInterval(timer);
      }
    };
  }, [isRunning, timeLeft, timerLabel, sessionLength, breakLength]);

  // Functions to handle user interactions
  const decrementBreak = () => {
    if (breakLength > 1) {
      setBreakLength(breakLength - 1);
    }
  };

  const incrementBreak = () => {
    if (breakLength < 60) {
      setBreakLength(breakLength + 1);
    }
  };

  const decrementSession = () => {
    if (sessionLength > 1) {
      setSessionLength(sessionLength - 1);
      if (!isRunning) {
        setTimeLeft((sessionLength - 1) * 60);
      }
    }
  };

  const incrementSession = () => {
    if (sessionLength < 60) {
      setSessionLength(sessionLength + 1);
      if (!isRunning) {
        setTimeLeft((sessionLength + 1) * 60);
      }
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimerLabel("Session");
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(sessionLength * 60);
  };

  const startStopTimer = () => {
    setIsRunning(!isRunning);
  };

  // Format timeLeft into mm:ss format
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="app">
      {/* UI elements and components */}
      <h2 id="h2-element">25+5 Clock</h2>
      <div id="break-label">Break Length</div>

      <div className="row">
        <div id="break-decrement" onClick={decrementBreak}>
          Decrement
        </div>
        <div id="break-length">{breakLength}</div>
        <div id="break-increment" onClick={incrementBreak}>
          Increment
        </div>
      </div><div id="session-label">Session Length</div>

      <div className="row">
        <div id="session-decrement" onClick={decrementSession}>
          Decrement
        </div>
        <div id="session-length">{sessionLength}</div>
        <div id="session-increment" onClick={incrementSession}>
          Increment
        </div>
      </div>



      <div id="timer-label">{timerLabel}</div>
      <div id="time-left">{formatTime(timeLeft)}</div>
      <div id="start_stop" onClick={startStopTimer}>
        Start/Stop
      </div>
      <div id="reset" onClick={resetTimer}>
        Reset
      </div>
      <audio
        id="beep"
        preload="auto"
        src="https://www.myinstants.com/media/sounds/bell.mp3"
      />
    </div>
  );
}

export default App;
