const StatCard = ({
  title,
  value,
  icon,
  type = "normal",
  progress,
}) => {
  return (
    <div className="stat-card">
      <div>
        <p className="stat-title">{title}</p>
        <h2>{value}</h2>
      </div>

      {type === "readiness" ? (
        <div className="readiness-ring">
          <div className="readiness-inner">
            {progress}%
          </div>
        </div>
      ) : (
        <div className={`stat-icon ${type}`}>
          {icon}
        </div>
      )}
    </div>
  );
};

export default StatCard;