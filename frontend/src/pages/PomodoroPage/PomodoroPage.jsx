import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout/DashboardLayout';
import PageShell from '../../components/PageShell/PageShell';
import Input from '../../components/ui/Input/Input';
import Button from '../../components/ui/Button/Button';
import './PomodoroPage.css';

const DEFAULT_WORK_MINUTES = 25;
const MIN_WORK_MINUTES = 1;
const MAX_WORK_MINUTES = 120;

function fmt(s) {
  const m = Math.floor(s / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

export default function PomodoroPage() {
  const [workMinutes, setWorkMinutes] = useState(DEFAULT_WORK_MINUTES);
  const [seconds, setSeconds] = useState(DEFAULT_WORK_MINUTES * 60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const toggle = () => setRunning((r) => !r);

  const reset = () => {
    setRunning(false);
    setSeconds(workMinutes * 60);
  };

  const handleMinutesChange = (event) => {
    const nextMinutes = Number(event.target.value);
    if (!Number.isFinite(nextMinutes) || nextMinutes < MIN_WORK_MINUTES) {
      return;
    }
    const clamped = Math.min(nextMinutes, MAX_WORK_MINUTES);
    setWorkMinutes(clamped);
    setSeconds(clamped * 60);
    setRunning(false);
  };

  return (
    <DashboardLayout>
      <PageShell>
        <div className="pomodoro-page">
          <div className="pomodoro-card">
            <div className="pomodoro-card__timer" aria-live="polite" aria-label={`Time remaining: ${fmt(seconds)}`}>
              {fmt(seconds)}
            </div>
            <div className="pomodoro-card__settings">
              <label className="pomodoro-card__setting-label">
                <span className="pomodoro-card__setting-title">Session length</span>
                <Input
                  type="number"
                  min={MIN_WORK_MINUTES}
                  max={MAX_WORK_MINUTES}
                  step="1"
                  value={workMinutes}
                  onChange={handleMinutesChange}
                  className="pomodoro-card__setting-input"
                  aria-label="Pomodoro duration in minutes"
                />
                <span className="pomodoro-card__setting-unit">min</span>
              </label>
            </div>
            <div className="pomodoro-card__controls">
              <button
                type="button"
                className="pomodoro-card__start-btn"
                onClick={toggle}
                aria-label={running ? 'Pause timer' : 'Start timer'}
              >
                {running ? 'PAUSE' : 'START'}
              </button>
              <Button type="button" variant="ghost" onClick={reset}>
                RESET
              </Button>
            </div>
          </div>
        </div>
      </PageShell>
    </DashboardLayout>
  );
}
