// src/components/childrens/Timer.jsx
import React, { useEffect } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);
// import beepSound from "../assets/beep.mp3"; // Ensure you have this file

export default function Timer({
  remainingTime,
  setRemainingTime,
  testInstanceId,
  allocatedTime,
}) {
  // On mount or when testInstanceId/allocatedTime changes, set the start time if needed
  useEffect(() => {
    const storedTestId = localStorage.getItem("testInstanceId");
    let storedStartTime = localStorage.getItem("testStartTime");

    // If there's no stored start time or the test ID has changed, reset the stored time
    if (storedTestId !== testInstanceId || !storedStartTime) {
      localStorage.setItem("testInstanceId", testInstanceId);
      storedStartTime = Date.now();
      localStorage.setItem("testStartTime", storedStartTime);
    }

    // Calculate elapsed time in seconds and set remaining time
    const elapsedSeconds = Math.floor((Date.now() - storedStartTime) / 1000);
    const remaining = Math.max(allocatedTime - elapsedSeconds, 0);
    setRemainingTime(remaining);
  }, [testInstanceId, allocatedTime, setRemainingTime]);

  // Start the interval that decrements remaining time every second and plays beep if < 30 seconds.
  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        const newTime = prev <= 1 ? 0 : prev - 1;
        if (newTime < 30 && newTime !== prev) {
          // Play beep sound
          // const beep = new Audio(beepSound);
          // beep.play().catch((err) => console.error("Beep play error:", err));
        }
        if (newTime === 0) {
          clearInterval(interval);
        }
        return newTime;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [setRemainingTime]);

  // Format the remaining time (HH:mm:ss)
  const formattedTime = dayjs
    .duration(remainingTime, "seconds")
    .format("HH:mm:ss");

  return (
    <div>
      <div className="mb-4 mr-3 text-center gap-4 flex justify-end items-center">
        <h4 className=" text-2xl font-bold">Time Left:</h4>
        <p className={`text-2xl ${remainingTime < 30 ? "text-red-500" : ""}`}>
          {formattedTime}
        </p>
      </div>
    </div>
  );
}
