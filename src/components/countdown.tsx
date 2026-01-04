"use client";

import { useState, useEffect } from "react";

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeUntil2031(): TimeRemaining {
  const targetDate = new Date("2031-01-01T00:00:00");
  const now = new Date();
  const diffTime = Math.max(0, targetDate.getTime() - now.getTime());

  const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
}

export function Countdown() {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(
    null
  );

  useEffect(() => {
    // Subscribe to time updates via interval - setState only in callback
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeUntil2031());
    }, 100); // Start quickly, then every 100ms for smooth updates

    return () => clearInterval(interval);
  }, []);

  const formatTime = (value: number): string => {
    return value.toString().padStart(2, "0");
  };

  // Render placeholder during SSR
  if (!timeRemaining) {
    return (
      <p className="text-body tabular-nums">--:--:--:-- (till 2031)</p>
    );
  }

  return (
    <p className="text-body tabular-nums" suppressHydrationWarning>
      {timeRemaining.days}:{formatTime(timeRemaining.hours)}:
      {formatTime(timeRemaining.minutes)}:{formatTime(timeRemaining.seconds)}{" "}
      (till 2031)
    </p>
  );
}

