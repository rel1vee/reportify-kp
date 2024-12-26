import React from "react";
import { useEffect, useState } from "react";

const Loading = ({
  text = "Loading",
  primaryColor = "#2C707B",
  secondaryColor = "#397480",
}) => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <div className="relative">
        <div
          className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin"
          style={{
            borderColor: `${primaryColor} transparent ${secondaryColor} transparent`,
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full animate-pulse"
          style={{
            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
          }}
        />
      </div>
      <div className="relative">
        <span className="text-sm font-medium text-gray-700 tracking-wide">
          {text}
          <span className="animate-pulse">{dots}</span>
        </span>
      </div>
    </div>
  );
};

export default Loading;
