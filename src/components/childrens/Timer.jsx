import React, { useEffect, useRef } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import clock from "../../assets/clock.mp3";
dayjs.extend(duration);

export default function Timer({
  remainingTime,
  setRemainingTime,
  testInstanceId,
  allocatedTime,
}) {
  const audioRef = useRef(new Audio(clock));

  useEffect(() => {
    const storedTestId = localStorage.getItem("testInstanceId");
    let storedStartTime = localStorage.getItem("testStartTime");

    if (storedTestId !== testInstanceId || !storedStartTime) {
      localStorage.setItem("testInstanceId", testInstanceId);
      storedStartTime = Date.now();
      localStorage.setItem("testStartTime", storedStartTime);
    }

    const elapsedSeconds = Math.floor((Date.now() - storedStartTime) / 1000);
    const remaining = Math.max(allocatedTime - elapsedSeconds, 0);
    setRemainingTime(remaining);
  }, [testInstanceId, allocatedTime, setRemainingTime]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        const newTime = prev <= 1 ? 0 : prev - 1;

        if (newTime === 60) {
          // Play ticking sound continuously for 1 minute
          audioRef.current.loop = true;
          audioRef.current
            .play()
            .catch((err) => console.error("Beep play error:", err));
        }
        if (newTime === 59) {
          // Ensure the audio starts properly if not playing
          if (audioRef.current.paused) {
            audioRef.current
              .play()
              .catch((err) => console.error("Audio restart error:", err));
          }
        }
        if (newTime === 0) {
          clearInterval(interval);
          // Stop the ticking sound
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
        return newTime;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [setRemainingTime]);

  const formattedTime = dayjs
    .duration(remainingTime, "seconds")
    .format("HH:mm:ss");

  return (
    <div>
      <div className="mb-4 mr-3 text-center gap-4 flex justify-end items-center">
        <h4 className=" text-2xl font-bold">Time Left:</h4>
        <p className={`text-2xl ${remainingTime < 60 ? "text-red-500" : ""}`}>
          {formattedTime}
        </p>
      </div>
    </div>
  );
}
