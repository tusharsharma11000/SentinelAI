import "./ChartCard.css";

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="glass-pane chart-wrapper-card">
      <div className="chart-card-header">
        <div>
          <span className="chart-card-title">{title}</span>
          {subtitle && <p className="chart-card-subtitle">{subtitle}</p>}
        </div>
      </div>
      <div className="chart-card-content">
        {children}
      </div>
    </div>
  );
}

export default ChartCard;
