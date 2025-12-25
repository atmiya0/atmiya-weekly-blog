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
  const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
}

export function Countdown() {
  // Start with null to ensure server and client render the same initial value
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Set mounted to true after hydration
    setMounted(true);
    // Calculate and set the initial time
    setTimeRemaining(calculateTimeUntil2031());

    // Update every second to show the countdown ticking
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeUntil2031());
    }, 1000); // 1000ms = 1 second

    return () => clearInterval(interval);
  }, []);

  const formatTime = (value: number): string => {
    return value.toString().padStart(2, "0");
  };

  // Render placeholder during SSR and initial hydration
  if (!mounted || !timeRemaining) {
    return (
      <p className="text-body tabular-nums">
        --:--:--:-- (till 2031)
      </p>
    );
  }

  return (
    <p className="text-body tabular-nums" suppressHydrationWarning>
      {timeRemaining.days}:{formatTime(timeRemaining.hours)}:{formatTime(timeRemaining.minutes)}:{formatTime(timeRemaining.seconds)} (till 2031)
    </p>
  );
}

