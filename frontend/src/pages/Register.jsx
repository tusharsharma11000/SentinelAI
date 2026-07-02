import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import "./Auth.css";

function Register() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passcodes do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/register", { name, email, password });
      const { token, user } = response.data;
      
      login(token, user);
      setLoading(false);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout theme-dark">
      <div className="digital-grid" />
      
      <motion.div 
        className="glass-pane auth-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="auth-header">
          <div className="auth-logo">🛡️</div>
          <h1 className="auth-title">Register Commander</h1>
          <p className="auth-subtitle">Initialize SentinelAI Security Access</p>
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
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Commander Vance"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
            <label className="form-label">Passcode Secret</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Passcode</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="cyber-btn cyber-btn-primary auth-submit-btn"
            disabled={loading}
          >
            {loading ? "Registering..." : "Initialize Command Profile"}
          </button>
        </form>

        <div className="auth-footer">
          <span>Already registered? </span>
          <Link to="/login" className="auth-link">Login Command Link</Link>
        </div>
      </motion.div>
    </div>
  );
}

export default Register;
