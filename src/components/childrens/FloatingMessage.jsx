import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useSpring, animated } from "@react-spring/web";
import { FiX } from "react-icons/fi";

const Toast = ({ message, duration = 5, onClose }) => {
  const [progress, setProgress] = useState(100);
  const [show, setShow] = useState(true);

  // Animation for entrance and exit
  const springs = useSpring({
    opacity: show ? 1 : 0,
    transform: show ? "translateY(0)" : "translateY(-20px)",
    config: { tension: 300, friction: 20 },
  });

  // Progress bar animation
  const progressSpring = useSpring({
    width: `${progress}%`,
    config: { duration: duration * 1000 },
  });

  const startTimer = useCallback(() => {
    const interval = 50; // Update every 50ms for smooth progress
    const totalSteps = (duration * 1000) / interval;
    let step = 0;

    const timer = setInterval(() => {
      step += 1;
      const newProgress = 100 - (step / totalSteps) * 100;
      setProgress(newProgress);

      if (step >= totalSteps) {
        clearInterval(timer);
        setShow(false);
        setTimeout(onClose, 300); // Wait for exit animation
      }
    }, interval);

    return () => clearInterval(timer);
  }, [duration, onClose]);

  useEffect(() => {
    startTimer();
  }, [startTimer]);

  return (
    <animated.div
      style={springs}
      className="relative mb-3 p-4 pr-8 min-w-[300px] bg-white rounded-lg shadow-lg border-l-4 border-blue-500"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-gray-800">{message}</span>
        <button
          onClick={() => {
            setShow(false);
            onClose();
          }}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <FiX size={18} />
        </button>
      </div>
      <animated.div
        style={progressSpring}
        className="h-1 bg-blue-400 rounded-full transition-colors"
      />
    </animated.div>
  );
};

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  duration: PropTypes.number,
  onClose: PropTypes.func.isRequired,
};

// Toast Container Context/Provider
const ToastContext = React.createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, duration = 5) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, duration }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className="fixed top-4 right-4 z-[9999]">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
