import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useSpring, animated } from "@react-spring/web";
import { FiX } from "react-icons/fi";

const Toast = ({
  message,
  duration = 3,
  onClose,
  className,
  barColor = "bg-blue-400",
}) => {
  const [show, setShow] = useState(true);
  const [hasEntered, setHasEntered] = useState(false);

  // Entrance animation with bounce sequence; run only once
  const entranceSpring = useSpring({
    from: { opacity: 0, transform: "translateX(100%)" },
    to: async (next) => {
      await next({
        opacity: 1,
        transform: "translateX(0)",
        config: { tension: 300, friction: 20 },
      });
      await next({
        transform: "translateX(-10px)",
        config: { tension: 300, friction: 10 },
      });
      await next({
        transform: "translateX(0)",
        config: { tension: 300, friction: 20 },
      });
      setHasEntered(true);
    },
    reset: true,
  });

  // Exit animation (simple fade out and slide out)
  const exitSpring = useSpring({
    opacity: show ? 1 : 0,
    transform: show ? "translateX(0)" : "translateX(100%)",
    config: { tension: 300, friction: 25 },
  });

  // Combine entrance and exit: if not entered yet, use entranceSpring; else use exitSpring.
  const containerSpring = hasEntered ? exitSpring : entranceSpring;

  const progressSpring = useSpring({
    from: { width: "100%" },
    to: { width: "0%" },
    delay: 600, // start after entrance animation finishes
    config: { duration: duration * 1000 },
  });

  useEffect(() => {
    const totalDelay = duration * 1000 + 600;
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onClose(), 300);
    }, totalDelay);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <animated.div
      style={{
        ...containerSpring,
        position: "fixed",
        top: "1rem",
        right: "1rem",
      }}
      className={`mb-3 z-50 p-4 pr-8 min-w-[300px] bg-white rounded-lg shadow-lg ${className}`}
    >
      <div className="flex items-center gap-4 justify-between mb-2">
        <p
          className={`font-semibold text-10 max-w-72 text-gray-800 ${className}`}
        >
          {message}
        </p>
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
        className={`h-1 ${barColor} rounded-full`}
      />
    </animated.div>
  );
};

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  duration: PropTypes.number,
  onClose: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default Toast;
