// Timer.jsx
import React, { useEffect } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

export default function Timer({ remainingTime, setRemainingTime }) {
  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Optionally, auto-submit test or take action when time's up.
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [setRemainingTime]);

  // Format remaining time (e.g., HH:mm:ss)
  const formattedTime = dayjs
    .duration(remainingTime, "seconds")
    .format("HH:mm:ss");

  return (
    <div className="mb-4 text-center">
      <h4 className="font-bold">Time Left</h4>
      <p className="text-xl">{formattedTime}</p>
    </div>
  );
}
