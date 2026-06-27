import { useState, useEffect } from "react";
import "../styles/Dashboard.css";

function Dashboard() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard">

      {/* Sidebar */}
      <div className="sidebar">
        <h2>🛡 SentinelAI</h2>

        <p className="time">{time}</p>

        <ul>
          <li>🏠 Dashboard</li>
          <li>📹 Cameras</li>
          <li>🚨 Alerts</li>
          <li>📊 Reports</li>
          <li>⚙️ Settings</li>
          <li>🚪 Logout</li>
        </ul>
      </div>

      {/* Content */}
      <div className="content">

        <div className="navbar">
          <h2>Border Surveillance Dashboard</h2>
          <button>Commander</button>
        </div>

        {/* Cards */}
        <div className="cards">

          <div className="card">
            <h2>12</h2>
            <p>Active Cameras</p>
          </div>

          <div className="card">
            <h2>5</h2>
            <p>AI Alerts</p>
          </div>

          <div className="card">
            <h2>2</h2>
            <p>Intrusions</p>
          </div>

        </div>

        {/* Border Status */}
        <div className="status">
          <h2>🟢 Border Status</h2>

          <div className="status-box">
            Border is Secure
          </div>
        </div>

        {/* AI Accuracy */}
        <div className="accuracy">

          <h2>🎯 AI Detection Accuracy</h2>

          <div className="progress">
            <div className="fill"></div>
          </div>

          <p>98%</p>

        </div>

        {/* Camera */}
        <div className="camera">

          <h2>🎥 Live Camera Feed</h2>

          <div className="video">
            Camera Feed Will Appear Here
          </div>

        </div>

        {/* Recent Alerts */}
        <div className="table-section">

          <h2>🚨 Recent Alerts</h2>

          <table>

            <thead>
              <tr>
                <th>ID</th>
                <th>Time</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

              <tr>
                <td>101</td>
                <td>05:32 PM</td>
                <td>Person</td>
                <td>⚠ High</td>
              </tr>

              <tr>
                <td>102</td>
                <td>05:35 PM</td>
                <td>Vehicle</td>
                <td>Medium</td>
              </tr>

              <tr>
                <td>103</td>
                <td>05:41 PM</td>
                <td>Animal</td>
                <td>Low</td>
              </tr>

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;