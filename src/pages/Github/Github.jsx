import GitHubCalendar from "react-github-calendar";
import "./Github.css";

export const Github = () => {
  return (
    <div className="calendar-container">
      <h1 className="calendar-heading">
        Days I <strong className="highlight">Code</strong>
      </h1>
      <div className="calendar">
        <GitHubCalendar
          username="utkarsh032"
          blockSize={15}
          blockMargin={5}
          color="#8a2be2"
          fontSize={16}
        />
      </div>
    </div>
  );
};
