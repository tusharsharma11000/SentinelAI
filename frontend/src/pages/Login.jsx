import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import "./Auth.css";

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, user } = response.data;
      
      login(token, user);
      setLoading(false);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Authentication failed. Check credentials.");
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout theme-dark">
      <div className="digital-grid" />
      
      <motion.div 
        className="glass-pane auth-card neon-border-glowing"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="auth-header">
          <div className="auth-logo">🛡️</div>
          <h1 className="auth-title">SentinelAI</h1>
          <p className="auth-subtitle">Surveillance Command Console</p>
        </div>

        {error && (
          <motion.div 
            className="auth-error-box"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            ⚠️ {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="commander@sentinel.ai"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Commander Passcode</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="cyber-btn cyber-btn-primary auth-submit-btn"
            disabled={loading}
          >
            {loading ? "Authenticating..." : "Establish Command Link"}
          </button>
        </form>

        <div className="auth-footer">
          <span>Don't have an account? </span>
          <Link to="/register" className="auth-link">Register Profile</Link>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
