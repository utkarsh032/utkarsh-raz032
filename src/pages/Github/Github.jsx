import React, { useState, useEffect } from "react";
import GitHubCalendar from "react-github-calendar";
import "./Github.css";

export const Github = () => {
  const [calendarConfig, setCalendarConfig] = useState({
    blockSize: 15,
    blockMargin: 5,
    fontSize: 16,
  });

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;

      if (screenWidth <= 480) {
        // Small screens (mobile)
        setCalendarConfig({ blockSize: 8, blockMargin: 2, fontSize: 10 });
      } else if (screenWidth <= 768) {
        // Medium screens (tablets)
        setCalendarConfig({ blockSize: 12, blockMargin: 3, fontSize: 12 });
      } else {
        // Large screens (desktops)
        setCalendarConfig({ blockSize: 15, blockMargin: 5, fontSize: 16 });
      }
    };

    // Add event listener on component mount
    window.addEventListener("resize", handleResize);

    // Call the resize handler initially to set the correct configuration
    handleResize();

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="calendar-container">
      <h1 className="calendar-heading">
        Days I <strong className="highlight">Code</strong>
      </h1>
      <div className="calendar">
        <GitHubCalendar
          username="utkarsh032"
          blockSize={calendarConfig.blockSize}
          blockMargin={calendarConfig.blockMargin}
          color="#8a2be2"
          fontSize={calendarConfig.fontSize}
        />
      </div>
    </div>
  );
};
