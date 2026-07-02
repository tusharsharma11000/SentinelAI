import { useAnalytics } from "../hooks/useAnalytics";
import { 
  ResponsiveContainer, 
  LineChart, Line, 
  BarChart, Bar, Cell,
  PieChart, Pie, 
  AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from "recharts";
import "./Analytics.css";

// Loading Skeleton component for charts
function ChartSkeleton() {
  return (
    <div className="skeleton-card" style={{ height: "240px", gap: "10px" }}>
      <div className="skeleton skeleton-title" style={{ width: "40%" }} />
      <div className="skeleton" style={{ flexGrow: 1, width: "100%", borderRadius: "8px" }} />
    </div>
  );
}

function Analytics() {
  const { analytics, loading, error } = useAnalytics();

  if (loading) {
    return (
      <div className="analytics-grid">
        <ChartSkeleton />
        <ChartSkeleton />
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-pane chart-card" style={{ padding: "40px", textAlign: "center", color: "var(--danger)" }}>
        <h3>⚠️ Telemetry Analytics Connection Failure</h3>
        <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "10px" }}>{error}</p>
      </div>
    );
  }

  const { weeklyAlerts, monthlyDetection, cameraUsage, detectionCategories } = analytics || {};

  return (
    <div className="analytics-grid">
      
      {/* 1. Line Chart: Threat Timeline */}
      <div className="glass-pane chart-card">
        <span className="chart-title">Threat Incidents Timeline</span>
        <div style={{ width: "100%", height: 160 }}>
          <ResponsiveContainer>
            <LineChart data={weeklyAlerts} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={10} tickLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} />
              <Tooltip 
                contentStyle={{ background: "rgba(10,18,36,0.9)", border: "1px solid var(--card-border)", borderRadius: "6px" }}
                labelStyle={{ color: "var(--primary)" }}
              />
              <Line 
                type="monotone" 
                dataKey="alerts" 
                stroke="var(--danger)" 
                strokeWidth={2}
                dot={{ fill: "var(--danger)", r: 4 }}
                activeDot={{ r: 6, stroke: "#fff", strokeWidth: 1 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Bar Chart: Camera Usage */}
      <div className="glass-pane chart-card">
        <span className="chart-title">Detections by Sector Feed</span>
        <div style={{ width: "100%", height: 160 }}>
          <ResponsiveContainer>
            <BarChart data={cameraUsage} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="cameraName" stroke="var(--text-muted)" fontSize={9} tickLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} />
              <Tooltip 
                contentStyle={{ background: "rgba(10,18,36,0.9)", border: "1px solid var(--card-border)", borderRadius: "6px" }}
                labelStyle={{ color: "var(--primary)" }}
              />
              <Bar dataKey="detections" radius={[4, 4, 0, 0]}>
                {cameraUsage?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "var(--primary)" : "var(--accent)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Donut Chart: Detection Categories */}
      <div className="glass-pane chart-card">
        <span className="chart-title">Incidents by Object Class</span>
        <div style={{ width: "100%", height: 160 }}>
          <ResponsiveContainer>
            <PieChart>
              <Tooltip 
                contentStyle={{ background: "rgba(10,18,36,0.9)", border: "1px solid var(--card-border)", borderRadius: "6px" }}
              />
              <Pie
                data={detectionCategories}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={55}
                paddingAngle={4}
                dataKey="value"
              >
                {detectionCategories?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Legend 
                verticalAlign="middle" 
                align="right" 
                layout="vertical"
                iconSize={8}
                wrapperStyle={{ fontSize: "10px", color: "var(--text-muted)" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Area Chart: Daily Detections */}
      <div className="glass-pane chart-card">
        <span className="chart-title">Daily Classifications Stack</span>
        <div style={{ width: "100%", height: 160 }}>
          <ResponsiveContainer>
            <AreaChart data={monthlyDetection} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="areaColorPerson" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--danger)" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="var(--danger)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="areaColorVehicle" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={10} tickLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} />
              <Tooltip 
                contentStyle={{ background: "rgba(10,18,36,0.9)", border: "1px solid var(--card-border)", borderRadius: "6px" }}
              />
              <Area type="monotone" dataKey="Person" stackId="1" stroke="var(--danger)" fill="url(#areaColorPerson)" />
              <Area type="monotone" dataKey="Vehicle" stackId="1" stroke="var(--accent)" fill="url(#areaColorVehicle)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}

export default Analytics;
