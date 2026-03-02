import { Link } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  return (
    <div className="home-container">
      <div className="home-card">
        <h1 className="home-logo">CashFlow</h1><br/>
        <h2 className="home-title">Manage your money with confidence!</h2>
        <p className="home-subtitle"><i>
          Track transactions, monitor spending, and stay on top of your financial goals.
        </i></p>

        <div className="home-actions">
          <Link to="/login" className="home-btn home-btn-primary">
            Login
          </Link>
          <Link to="/register" className="home-btn home-btn-secondary">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;