import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";
import logo from "../assets/cashflow-logo.png";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState("");
  const navigate = useNavigate();

  const validateForm = () => {
    if (!name.trim()) {
      setError("Name is required");
      return false;
    }
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
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const register = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });

      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-container">
        {/* Left Section */}
        <div className="register-left">
          <div className="register-circle register-circle-1"></div>
          <div className="register-circle register-circle-2"></div>
          <div className="register-circle register-circle-3"></div>
          <div className="left-overlay"></div>
          <div className="left-content">
            <h1 className="welcome-title">Start Your Journey!</h1>
            <p className="welcome-subtitle"><i>
              ✨ Create your CashFlow account and take control of your finances. Get insights, track expenses, and build better spending habits.
            </i></p>
            <p className="signup-prompt">Already have an account?</p>
            <a href="/login" className="login-button-alt">
              SIGN IN
            </a>
          </div>
        </div>

        {/* Right Section */}
        <div className="register-right">
          <div className="register-card">
            <div className="logo-section">
              <img src={logo} alt="CashFlow Logo" className="logo-icon" />
            </div>

            <h3 className="register-title">Create Account</h3>

            <form className="register-form" onSubmit={register}>
              {error && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  {error}
                </div>
              )}

              <div className={`input-group ${focusedField === "name" ? "focused" : ""}`}>
                <input
                  id="name"
                  type="text"
                  placeholder="Full name"
                  className="register-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField("")}
                  required
                />
              </div>

              <div className={`input-group ${focusedField === "email" ? "focused" : ""}`}>
                <input
                  id="email"
                  type="email"
                  placeholder="Email address"
                  className="register-input"
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
                  placeholder="Password (min. 6 characters)"
                  className="register-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField("")}
                  required
                />
              </div>

              <div className={`input-group ${focusedField === "confirmPassword" ? "focused" : ""}`}>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  className="register-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={() => setFocusedField("confirmPassword")}
                  onBlur={() => setFocusedField("")}
                  required
                />
              </div>

              <button
                type="submit"
                className={`register-button ${loading ? "loading" : ""}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    CREATING ACCOUNT...
                  </>
                ) : (
                  "SIGN UP"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
