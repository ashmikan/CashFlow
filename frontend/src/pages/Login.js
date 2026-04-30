import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import logo from "../assets/cashflow-logo.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState("");
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const login = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        {/* Left Section */}
        <div className="login-left">
          <div className="login-circle login-circle-1"></div>
          <div className="login-circle login-circle-2"></div>
          <div className="login-circle login-circle-3"></div>
          <div className="left-overlay"></div>
          <div className="left-content">
            <h1 className="welcome-title">Welcome to CashFlow!</h1>
            <p className="welcome-subtitle"><i>
              ✨ CashFlow is where your finances shine. Track expenses, manage budgets, and achieve your financial goals with ease.
            </i></p>
            <p className="signup-prompt">Don't you have an account?</p>
            <a href="/register" className="register-button-alt">
              REGISTER
            </a>
          </div>
        </div>

        {/* Right Section */}
        <div className="login-right">
          <div className="login-card">
            <div className="logo-section">
              <img src={logo} alt="CashFlow Logo" className="logo-icon" />
            </div>

            <h3 className="login-title">Login</h3>

            <form className="login-form" onSubmit={login}>
              {error && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  {error}
                </div>
              )}

              <div className={`input-group ${focusedField === "email" ? "focused" : ""}`}>
                <input
                  id="email"
                  type="email"
                  placeholder="Email address"
                  className="login-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField("")}
                  required
                />
              </div>

              <div className={`input-group ${focusedField === "password" ? "focused" : ""}`}>
                <input
                  id="password"
                  type="password"
                  placeholder="Password"
                  className="login-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField("")}
                  required
                />
              </div>

              <button
                type="submit"
                className={`login-button ${loading ? "loading" : ""}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    SIGNING IN...
                  </>
                ) : (
                  "LOGIN"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
